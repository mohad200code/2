import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import fs from "fs";
import crypto from "crypto";
import Stripe from "stripe";
import nodemailer from "nodemailer";

dotenv.config();

// Lazy Stripe initialization to prevent crash when key is missing on startup
let stripeClient: Stripe | null = null;
function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY environment variable is missing.");
  }
  if (!stripeClient) {
    stripeClient = new Stripe(key, {
      apiVersion: "2025-02-02" as any,
    });
  }
  return stripeClient;
}


const app = express();
const PORT = 3000;

app.use(express.json());

// Password SHA256 Hashing Helper for secure authentication storage
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// In-memory temporary store for pending signup users verifying OTP
interface PendingUser {
  email: string;
  passwordHash: string;
  code: string;
  expiresAt: number;
}
const pendingUsers = new Map<string, PendingUser>();

// Helper to send real verification email via SMTP if configured, with graceful simulated fallback
async function sendVerificationEmail(toEmail: string, code: string): Promise<{ success: boolean; error?: string; isSimulated: boolean }> {
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass) {
    console.log(`[EMAIL SIMULATOR] Real SMTP credentials missing. Verification email simulated. Code is: ${code}`);
    return { success: true, isSimulated: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const emailSubject = `🔐 Nike Cyberport Verification Code: ${code}`;
    const emailBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Account Verification</title>
</head>
<body style="margin: 0; padding: 0; background-color: #020617; font-family: sans-serif; color: #f1f5f9;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #020617; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 500px; background-color: #0f172a; border: 1px solid #334155; border-radius: 16px; overflow: hidden;">
          <tr>
            <td style="background-color: #1e1b4b; padding: 24px; border-bottom: 2px solid #ec4899; text-align: center;">
              <span style="font-size: 10px; font-weight: 900; letter-spacing: 0.2em; color: #ec4899; font-family: monospace; display: block; margin-bottom: 8px;">SECURITY VERIFICATION SYSTEM</span>
              <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff; text-transform: uppercase;">NIKE CYBERPORT</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px; text-align: center;">
              <p style="margin-top: 0; font-size: 15px; line-height: 1.6; color: #cbd5e1; text-align: left;">
                Welcome to Nike Cyberport! 
              </p>
              <p style="font-size: 14px; line-height: 1.6; color: #94a3b8; text-align: left; margin-bottom: 24px;">
                To complete your sign-up process and secure your account as a verified athlete, please input the 6-digit verification code below:
              </p>
              
              <div style="background-color: #020617; border: 1px solid #334155; padding: 20px; border-radius: 12px; margin: 24px 0; text-align: center;">
                <span style="font-size: 32px; font-weight: 900; color: #00f0ff; font-family: monospace; letter-spacing: 0.15em; display: block;">
                  ${code}
                </span>
              </div>
              
              <p style="font-size: 11px; color: #64748b; font-family: monospace; text-align: left; margin-top: 24px; border-top: 1px solid #334155; padding-top: 15px;">
                This security code is active for 15 minutes. If you did not request this code, you can safely ignore this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    await transporter.sendMail({
      from: `"Nike Cyberport" <${smtpUser}>`,
      to: toEmail,
      subject: emailSubject,
      html: emailBody,
    });

    console.log(`[SMTP SUCCESS] Verification code email sent to ${toEmail}`);
    return { success: true, isSimulated: false };
  } catch (error: any) {
    console.error(`[SMTP ERROR] Failed to send verification email to ${toEmail}:`, error);
    return { success: false, error: error.message, isSimulated: false };
  }
}

// Luhn Algorithm validation helper for credit cards
function validateLuhn(cardNumber: string): boolean {
  const cleanNumber = cardNumber.replace(/\D/g, "");
  if (cleanNumber.length < 13 || cleanNumber.length > 19) return false;
  
  let sum = 0;
  let shouldDouble = false;
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

// Initialize Local JSON Databases if they do not exist
const USERS_DB_PATH = path.join(process.cwd(), "users_db.json");
const PAYMENTS_DB_PATH = path.join(process.cwd(), "payments_db.json");

if (!fs.existsSync(USERS_DB_PATH)) {
  const seedUsers = [
    {
      email: "mohabmohnad9@gmail.com",
      passwordHash: hashPassword("password123"), // Seed password is "password123" for quick convenience
      createdAt: new Date().toISOString()
    }
  ];
  fs.writeFileSync(USERS_DB_PATH, JSON.stringify(seedUsers, null, 2), "utf-8");
  console.log("[DATABASE] Initialized users database with administrator seed account.");
}

if (!fs.existsSync(PAYMENTS_DB_PATH)) {
  fs.writeFileSync(PAYMENTS_DB_PATH, JSON.stringify([], null, 2), "utf-8");
  console.log("[DATABASE] Initialized payments ledger database.");
}

// ==========================================
// AUTHENTICATION APIs (Real Login & Signup)
// ==========================================

// Real Signup Endpoint (Generates & Sends 6-digit verification code to user's Gmail)
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long." });
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    let users = [];
    try {
      users = JSON.parse(fs.readFileSync(USERS_DB_PATH, "utf-8"));
    } catch (e) {
      users = [];
    }

    const emailLower = email.toLowerCase();
    const userExists = users.some((u: any) => u.email === emailLower);
    if (userExists) {
      return res.status(400).json({ error: "An account with this email address already exists." });
    }

    // Generate a 6-digit numeric OTP verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in-memory with expiration set to 15 minutes
    pendingUsers.set(emailLower, {
      email: emailLower,
      passwordHash: hashPassword(password),
      code,
      expiresAt: Date.now() + 15 * 60 * 1000
    });

    console.log(`[AUTH SIGNUP] Verification code ${code} generated for pending user: ${emailLower}`);

    // Try to dispatch real email to their Gmail address
    const emailResult = await sendVerificationEmail(emailLower, code);

    return res.json({
      success: true,
      pendingVerification: true,
      email: emailLower,
      isSimulated: emailResult.isSimulated,
      // Pass the debug code so user can register if SMTP is not yet configured in local workspace environment secrets
      debugCode: emailResult.isSimulated ? code : undefined,
      message: emailResult.isSimulated
        ? "Verification code generated in Sandbox Mode."
        : `A secure verification code has been successfully dispatched to your Gmail: ${emailLower}`
    });

  } catch (error: any) {
    console.error("[SIGNUP CONTROLLER ERROR]", error);
    return res.status(500).json({ error: "Internal server error occurred during signup." });
  }
});

// Endpoint to verify the 6-digit code and finalize sign up
app.post("/api/auth/verify-signup", (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ error: "Email and verification code are required." });
    }

    const emailLower = email.toLowerCase();
    const pending = pendingUsers.get(emailLower);

    if (!pending) {
      return res.status(400).json({ error: "No pending sign-up session found. Please try registering again." });
    }

    if (pending.expiresAt < Date.now()) {
      pendingUsers.delete(emailLower);
      return res.status(400).json({ error: "Your verification code has expired. Please sign up again." });
    }

    if (pending.code !== code.trim()) {
      return res.status(400).json({ error: "Incorrect verification code. Please check your email inbox and try again." });
    }

    // Finalize Registration
    let users = [];
    try {
      users = JSON.parse(fs.readFileSync(USERS_DB_PATH, "utf-8"));
    } catch (e) {
      users = [];
    }

    if (users.some((u: any) => u.email === emailLower)) {
      pendingUsers.delete(emailLower);
      return res.status(400).json({ error: "This email has already been registered." });
    }

    const newAthlete = {
      email: emailLower,
      passwordHash: pending.passwordHash,
      createdAt: new Date().toISOString()
    };

    users.push(newAthlete);
    fs.writeFileSync(USERS_DB_PATH, JSON.stringify(users, null, 2), "utf-8");

    // Clean up map
    pendingUsers.delete(emailLower);

    console.log(`[AUTH VERIFIED SUCCESS] New athlete verified & registered: ${emailLower}`);
    return res.json({ success: true, email: emailLower });

  } catch (error: any) {
    console.error("[VERIFY SIGNUP ERROR]", error);
    return res.status(500).json({ error: "Internal server error during code verification." });
  }
});

// Real Login Endpoint
app.post("/api/auth/login", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    let users = [];
    try {
      users = JSON.parse(fs.readFileSync(USERS_DB_PATH, "utf-8"));
    } catch (e) {
      users = [];
    }

    const emailLower = email.toLowerCase();
    const targetUser = users.find((u: any) => u.email === emailLower);
    if (!targetUser) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const inputHash = hashPassword(password);
    if (targetUser.passwordHash !== inputHash) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    console.log(`[AUTH SUCCESS] Athlete logged in: ${emailLower}`);
    return res.json({ success: true, email: emailLower });
  } catch (error: any) {
    console.error("[LOGIN CONTROLLER ERROR]", error);
    return res.status(500).json({ error: "Internal server error occurred during login." });
  }
});

// ==========================================
// PAYMENT APIs (Real Merchant Processing)
// ==========================================
app.post("/api/payment/process", async (req, res) => {
  try {
    const { cardNumber, expiry, cvc, amount, address } = req.body;

    if (!cardNumber || !expiry || !cvc || !amount) {
      return res.status(400).json({ error: "Missing required checkout parameters." });
    }

    const cleanCard = cardNumber.replace(/\D/g, "");
    const cleanCVC = cvc.replace(/\D/g, "");

    // 1. Check card length
    if (cleanCard.length < 13 || cleanCard.length > 19) {
      return res.status(400).json({ error: "Invalid credit card number length. (Must be between 13 and 19 digits)" });
    }

    // 2. Card Validation (Luhn algorithm checks)
    // To allow sandbox standard testing, we accept 4111 1111 1111 1111 and cards passing Luhn
    const isLuhnValid = validateLuhn(cleanCard);
    const isSandboxTestCard = cleanCard === "4111111111111111" || cleanCard === "4242424242424242";
    
    if (!isLuhnValid && !isSandboxTestCard) {
      return res.status(400).json({ error: "The card number failed merchant verification. Please check for typos." });
    }

    // 3. Expiry date MM/YY format & check future
    const match = expiry.match(/^(\d{2})\/(\d{2})$/);
    if (!match) {
      return res.status(400).json({ error: "Expiry must be formatted as MM/YY." });
    }

    const expMonth = parseInt(match[1], 10);
    const expYear = parseInt("20" + match[2], 10);
    
    if (expMonth < 1 || expMonth > 12) {
      return res.status(400).json({ error: "Invalid expiration month." });
    }

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      return res.status(400).json({ error: "This credit card has expired." });
    }

    // 4. CVV checking
    if (cleanCVC.length < 3 || cleanCVC.length > 4) {
      return res.status(400).json({ error: "Security CVC must be a 3 or 4-digit number." });
    }

    // Check if Stripe is configured
    const isStripeConfigured = !!process.env.STRIPE_SECRET_KEY;
    let transactionId = "";
    let gatewayUsed = "Simulated Sandbox";

    if (isStripeConfigured) {
      try {
        console.log("[PAYMENT] Processing secure transaction via Stripe Gateway...");
        const stripe = getStripe();

        // Step A: Create card token
        const token = await stripe.tokens.create({
          card: {
            number: cleanCard,
            exp_month: expMonth.toString(),
            exp_year: expYear.toString(),
            cvc: cleanCVC,
            name: address?.name || "Athlete",
            address_line1: address?.address,
            address_city: address?.city,
          },
        });

        // Step B: Create a real charge via token
        const charge = await stripe.charges.create({
          amount: Math.round(amount * 100), // Stripe expects amounts in cents
          currency: "usd",
          source: token.id,
          description: `sdazum Athletic Gear purchase by ${address?.email || "athlete@sdazum.com"}`,
          receipt_email: address?.email || undefined,
        });

        transactionId = charge.id;
        gatewayUsed = "Stripe Live/Test API";
        console.log(`[STRIPE SUCCESS] Charge processed successfully. Charge ID: ${charge.id}`);
      } catch (stripeError: any) {
        console.error("[STRIPE API DEVIATION]", stripeError);
        return res.status(400).json({
          error: stripeError.message || "Your payment card was declined or rejected by the Stripe Gateway."
        });
      }
    } else {
      // Capture payment and record to transaction log
      transactionId = "TXN-" + crypto.randomBytes(4).toString("hex").toUpperCase();
    }

    const paymentRecord = {
      transactionId,
      amount,
      cardLast4: cleanCard.slice(-4),
      customerEmail: address?.email || "unknown@athlete.com",
      customerName: address?.name || "Athlete",
      timestamp: new Date().toISOString(),
      gateway: gatewayUsed
    };

    let payments = [];
    try {
      payments = JSON.parse(fs.readFileSync(PAYMENTS_DB_PATH, "utf-8"));
    } catch (e) {
      payments = [];
    }
    payments.push(paymentRecord);
    fs.writeFileSync(PAYMENTS_DB_PATH, JSON.stringify(payments, null, 2), "utf-8");

    console.log(`[PAYMENT CAPTURED] Charged $${amount} via Card (...${cleanCard.slice(-4)}) using [${gatewayUsed}]. Transaction ID: ${transactionId}`);

    return res.json({
      success: true,
      transactionId,
      cardLast4: cleanCard.slice(-4),
      gateway: gatewayUsed,
      isSandbox: !isStripeConfigured,
      message: isStripeConfigured 
        ? "Payment successfully processed and captured securely by Stripe."
        : "Payment successfully processed in local Sandbox mode."
    });

  } catch (error: any) {
    console.error("[PAYMENT CONTROLLER ERROR]", error);
    return res.status(500).json({ error: "Gateway transaction timeout or processing exception. Try again." });
  }
});


// Log Google OAuth Credentials status on startup for troubleshooting
console.log("[OAUTH DIAGNOSTICS] Checking Google OAuth Environment variables...");
if (process.env.GOOGLE_CLIENT_ID) {
  console.log(`[OAUTH DIAGNOSTICS] GOOGLE_CLIENT_ID: Found (${process.env.GOOGLE_CLIENT_ID.substring(0, 10)}...)`);
} else {
  console.warn("[OAUTH DIAGNOSTICS] GOOGLE_CLIENT_ID is not set in environment.");
}
if (process.env.GOOGLE_CLIENT_SECRET) {
  console.log("[OAUTH DIAGNOSTICS] GOOGLE_CLIENT_SECRET: Found");
} else {
  console.warn("[OAUTH DIAGNOSTICS] GOOGLE_CLIENT_SECRET is not set in environment.");
}

// 1. Endpoint to retrieve Google Client ID safely (Client ID is public)
app.get("/api/google-client-id", (req, res) => {
  res.json({
    clientId: process.env.GOOGLE_CLIENT_ID || ""
  });
});

// 2. Exchange Authorization Code for Google Access Tokens
app.post("/api/oauth/exchange", async (req, res) => {
  try {
    const { code, redirectUri } = req.body;
    if (!code) {
      return res.status(400).json({ error: "Authorization code is required" });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return res.status(500).json({ 
        error: "Google OAuth credentials are not fully configured on the server." 
      });
    }

    // Exchange code for token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }).toString(),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("[OAUTH EXCHANGE ERROR]", tokenData);
      return res.status(tokenResponse.status).json({ 
        error: tokenData.error_description || "Failed to exchange authorization code" 
      });
    }

    // Use access token to fetch user profile info
    const profileResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const profileData = await profileResponse.json();

    return res.json({
      accessToken: tokenData.access_token,
      expiresIn: tokenData.expires_in,
      user: {
        email: profileData.email,
        name: profileData.name || profileData.email.split("@")[0],
        picture: profileData.picture || "",
      }
    });

  } catch (error: any) {
    console.error("[OAUTH CONTROLLER ERROR]", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

// Helper to base64url encode strings for Gmail raw payload
function base64urlEncode(str: string): string {
  return Buffer.from(str, "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// 3. Send confirmation email via Gmail API
app.post("/api/send-email", async (req, res) => {
  try {
    const { accessToken, toEmail, order, deliveryKey } = req.body;

    if (!accessToken) {
      return res.status(400).json({ error: "Google Access Token is required" });
    }
    if (!toEmail) {
      return res.status(400).json({ error: "Recipient email is required" });
    }
    if (!order) {
      return res.status(400).json({ error: "Order details are required" });
    }

    // Create a beautiful cyber-styled receipt email
    const productsHtml = order.products.map((item: any) => `
      <tr style="border-bottom: 1px solid #1e293b;">
        <td style="padding: 12px; font-weight: bold; color: #ffffff;">
          ${item.name}
          ${item.customName ? `
            <div style="font-size: 11px; color: #f43f5e; font-family: monospace; margin-top: 4px;">
              ⚡ LASER ENGRAVED ID: "${item.customName}"
            </div>
          ` : ""}
        </td>
        <td style="padding: 12px; color: #00f0ff; font-family: monospace; text-align: center;">
          x${item.quantity}
        </td>
        <td style="padding: 12px; color: #cbd5e1; text-align: right; font-family: monospace;">
          $${(item.price * item.quantity).toFixed(2)}
        </td>
      </tr>
    `).join("");

    const emailSubject = `⚡ NIKE CYBERPORT Order Confirmed: #${order.id}`;

    const emailBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Nike Cyberport Receipt</title>
</head>
<body style="margin: 0; padding: 0; background-color: #020617; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #f1f5f9;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #020617; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" style="max-width: 600px; background-color: #0f172a; border: 1px solid #334155; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #1e1b4b; padding: 24px; border-bottom: 2px solid #ec4899; text-align: center;">
              <span style="font-size: 10px; font-weight: 900; letter-spacing: 0.2em; color: #ec4899; font-family: monospace; display: block; margin-bottom: 8px;">AUTOMATED INSTANT DISPATCH</span>
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #ffffff; text-transform: uppercase; letter-spacing: -0.025em;">NIKE CYBERPORT</h1>
            </td>
          </tr>
          
          <!-- Content Panel -->
          <tr>
            <td style="padding: 30px;">
              <p style="margin-top: 0; font-size: 15px; line-height: 1.6; color: #cbd5e1;">
                Athlete <strong>${order.address.name}</strong>,
              </p>
              <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1;">
                Your order is confirmed and has bypassed standard processing lanes. Our automated digital delivery daemon has successfully dispatched your hardware metrics.
              </p>

              <!-- Digital Delivery Keys Panel -->
              ${deliveryKey ? `
              <div style="background-color: #020617; border: 1px solid #1e1b4b; border-left: 4px solid #00f0ff; padding: 18px; border-radius: 8px; margin: 24px 0;">
                <span style="font-size: 9px; font-weight: bold; color: #00f0ff; font-family: monospace; letter-spacing: 0.1em; text-transform: uppercase; display: block; margin-bottom: 6px;">
                  🔒 SECURE DIGITAL KEY DISPATCH
                </span>
                <code style="font-size: 16px; font-weight: bold; color: #ffffff; font-family: monospace; letter-spacing: 0.05em; display: block;">
                  ${deliveryKey}
                </code>
                <span style="font-size: 10px; color: #64748b; font-family: monospace; display: block; margin-top: 8px;">
                  Ready for activation. Store this license key safely.
                </span>
              </div>
              ` : ""}

              <!-- Order Summary Details -->
              <h3 style="color: #ffffff; font-size: 16px; font-weight: 700; margin-top: 30px; margin-bottom: 12px; border-bottom: 1px solid #334155; padding-bottom: 6px;">
                Order Summary (ID: #${order.id})
              </h3>
              
              <table width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                <thead>
                  <tr style="color: #94a3b8; font-size: 11px; text-transform: uppercase; font-family: monospace;">
                    <th align="left" style="padding-bottom: 8px;">Product</th>
                    <th align="center" style="padding-bottom: 8px; width: 60px;">Qty</th>
                    <th align="right" style="padding-bottom: 8px; width: 100px;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${productsHtml}
                </tbody>
              </table>

              <!-- Total Calculations -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top: 2px solid #334155; padding-top: 15px;">
                <tr>
                  <td align="left" style="color: #94a3b8; font-size: 14px;">Payment Method:</td>
                  <td align="right" style="color: #ffffff; font-size: 14px; font-weight: bold; font-family: monospace;">
                    ${order.total <= 500 ? "Cyber Wallet Balance" : "Credit Card (Captured)"}
                  </td>
                </tr>
                <tr>
                  <td align="left" style="color: #ffffff; font-size: 16px; font-weight: bold; padding-top: 10px;">Total Charged:</td>
                  <td align="right" style="color: #00f0ff; font-size: 18px; font-weight: 900; padding-top: 10px; font-family: monospace;">
                    $${order.total.toFixed(2)}
                  </td>
                </tr>
              </table>

              <div style="margin-top: 35px; padding-top: 20px; border-top: 1px solid #334155; text-align: center;">
                <p style="font-size: 12px; color: #64748b; margin: 0;">
                  Thank you for shopping at Nike Cyberport!
                </p>
                <p style="font-size: 10px; color: #475569; margin-top: 8px; font-family: monospace;">
                  GATEWAY TRACE CODE: CP-GTW-${Math.floor(Math.random() * 89999) + 10000}
                </p>
              </div>

            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const rawMessage = [
      `To: ${toEmail}`,
      "Content-Type: text/html; charset=utf-8",
      "MIME-Version: 1.0",
      `Subject: ${emailSubject}`,
      "",
      emailBody
    ].join("\r\n");

    const encodedMessage = base64urlEncode(rawMessage);

    // Call Google Gmail API to send the email
    const gmailResponse = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        raw: encodedMessage,
      }),
    });

    const gmailResult = await gmailResponse.json();

    if (!gmailResponse.ok) {
      console.error("[GMAIL API ERROR]", gmailResult);
      return res.status(gmailResponse.status).json({
        error: gmailResult.error?.message || "Failed to dispatch email via Gmail API."
      });
    }

    console.log(`[SUCCESS] Email successfully dispatched to ${toEmail}! Message ID: ${gmailResult.id}`);
    return res.json({ success: true, messageId: gmailResult.id });

  } catch (error: any) {
    console.error("[SEND EMAIL CONTROLLER ERROR]", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

// Setup Vite & Static Files middlewares
async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[NIKE CYBERPORT SERVER] Running on port ${PORT}`);
  });
}

startServer();
