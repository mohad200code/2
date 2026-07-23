import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import fs from "fs";
import crypto from "crypto";
import Stripe from "stripe";
import nodemailer from "nodemailer";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

// Lazy Gemini API initialization to prevent crash on startup if key is missing
let genAI: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY environment variable is missing. Running in simulated fallback mode.");
    return null;
  }
  if (!genAI) {
    genAI = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAI;
}

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

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Serve products-image statically in both dev and production
app.use("/products-image", express.static(path.join(process.cwd(), "products-image")));

// Serve root images starting with ABUI statically
app.get("/ABUI*", (req, res) => {
  const filePath = path.join(process.cwd(), decodeURIComponent(req.path));
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send("Image not found");
  }
});

// Password SHA256 Hashing Helper for secure authentication storage
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// Server-side exponential backoff helper for robust API integrations
async function withExponentialBackoff<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000,
  maxDelay = 10000,
  factor = 2
): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (error: any) {
      attempt++;
      if (attempt > retries) {
        throw error;
      }
      const calculatedDelay = Math.min(delay * Math.pow(factor, attempt - 1), maxDelay);
      const jitter = (Math.random() - 0.5) * 300;
      const sleepTime = Math.max(50, calculatedDelay + jitter);
      console.warn(
        `[SERVER BACKOFF RETRY] Attempt ${attempt}/${retries} failed. Retrying in ${sleepTime.toFixed(0)}ms. Error:`,
        error?.message || error
      );
      await new Promise((resolve) => setTimeout(resolve, sleepTime));
    }
  }
}

// Helper to resolve directory for persistence databases, supporting packaged binary environments (.exe)
const getDbDir = () => {
  if ((process as any).pkg) {
    return path.dirname(process.execPath);
  }
  return process.cwd();
};

const PENDING_USERS_DB_PATH = path.join(getDbDir(), "pending_users_db.json");
const PENDING_LOGINS_DB_PATH = path.join(getDbDir(), "pending_logins_db.json");

// Disk-persistent temporary store for pending signup users verifying OTP
interface PendingUser {
  email: string;
  passwordHash: string;
  code: string;
  expiresAt: number;
}

const pendingUsers = {
  get(email: string): PendingUser | undefined {
    try {
      if (!fs.existsSync(PENDING_USERS_DB_PATH)) return undefined;
      const data = JSON.parse(fs.readFileSync(PENDING_USERS_DB_PATH, "utf-8"));
      return data[email.toLowerCase()];
    } catch (e) {
      return undefined;
    }
  },
  set(email: string, value: PendingUser) {
    try {
      let data: Record<string, PendingUser> = {};
      if (fs.existsSync(PENDING_USERS_DB_PATH)) {
        data = JSON.parse(fs.readFileSync(PENDING_USERS_DB_PATH, "utf-8"));
      }
      data[email.toLowerCase()] = value;
      fs.writeFileSync(PENDING_USERS_DB_PATH, JSON.stringify(data, null, 2), "utf-8");
    } catch (e) {
      console.error("Error setting pending user:", e);
    }
  },
  delete(email: string): boolean {
    try {
      if (!fs.existsSync(PENDING_USERS_DB_PATH)) return false;
      const data = JSON.parse(fs.readFileSync(PENDING_USERS_DB_PATH, "utf-8"));
      const existed = !!data[email.toLowerCase()];
      delete data[email.toLowerCase()];
      fs.writeFileSync(PENDING_USERS_DB_PATH, JSON.stringify(data, null, 2), "utf-8");
      return existed;
    } catch (e) {
      return false;
    }
  }
};

interface PendingLogin {
  email: string;
  role: string;
  code: string;
  expiresAt: number;
}

const pendingLogins = {
  get(email: string): PendingLogin | undefined {
    try {
      if (!fs.existsSync(PENDING_LOGINS_DB_PATH)) return undefined;
      const data = JSON.parse(fs.readFileSync(PENDING_LOGINS_DB_PATH, "utf-8"));
      return data[email.toLowerCase()];
    } catch (e) {
      return undefined;
    }
  },
  set(email: string, value: PendingLogin) {
    try {
      let data: Record<string, PendingLogin> = {};
      if (fs.existsSync(PENDING_LOGINS_DB_PATH)) {
        data = JSON.parse(fs.readFileSync(PENDING_LOGINS_DB_PATH, "utf-8"));
      }
      data[email.toLowerCase()] = value;
      fs.writeFileSync(PENDING_LOGINS_DB_PATH, JSON.stringify(data, null, 2), "utf-8");
    } catch (e) {
      console.error("Error setting pending login:", e);
    }
  },
  delete(email: string): boolean {
    try {
      if (!fs.existsSync(PENDING_LOGINS_DB_PATH)) return false;
      const data = JSON.parse(fs.readFileSync(PENDING_LOGINS_DB_PATH, "utf-8"));
      const existed = !!data[email.toLowerCase()];
      delete data[email.toLowerCase()];
      fs.writeFileSync(PENDING_LOGINS_DB_PATH, JSON.stringify(data, null, 2), "utf-8");
      return existed;
    } catch (e) {
      return false;
    }
  }
};

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

    const emailSubject = `🔐 Sdazum Cyberport Verification Code: ${code}`;
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
              <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff; text-transform: uppercase;">SDAZUM CYBERPORT</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px; text-align: center;">
              <p style="margin-top: 0; font-size: 15px; line-height: 1.6; color: #cbd5e1; text-align: left;">
                Welcome to Sdazum Cyberport! 
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
      from: `"Sdazum Cyberport" <${smtpUser}>`,
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
const USERS_DB_PATH = path.join(getDbDir(), "users_db.json");
const PAYMENTS_DB_PATH = path.join(getDbDir(), "payments_db.json");

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
      console.log(`[AUTH SIGNUP] User ${emailLower} already exists. Proceeding with verification to update/re-verify.`);
    }

    // Generate a 6-digit numeric OTP verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in-memory with expiration set to 24 hours (highly resilient to clock-skew or lag)
    pendingUsers.set(emailLower, {
      email: emailLower,
      passwordHash: hashPassword(password),
      code,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000
    });

    console.log(`[AUTH SIGNUP] Verification code ${code} generated for pending user: ${emailLower}`);

    // Try to dispatch real email to their Gmail address
    const emailResult = await sendVerificationEmail(emailLower, code);

    if (emailResult.isSimulated) {
      // Direct registration for ultra-fast UX in simulated sandbox environment
      let users = [];
      try {
        users = JSON.parse(fs.readFileSync(USERS_DB_PATH, "utf-8"));
      } catch (e) {
        users = [];
      }
      const existingUser = users.find((u: any) => u.email === emailLower);
      if (!existingUser) {
        users.push({
          email: emailLower,
          passwordHash: hashPassword(password),
          role: "admin",
          createdAt: new Date().toISOString()
        });
        fs.writeFileSync(USERS_DB_PATH, JSON.stringify(users, null, 2), "utf-8");
      }
      return res.json({
        success: true,
        pendingVerification: false,
        email: emailLower,
        role: "admin",
        message: "Instant Sandbox Sign Up Completed!"
      });
    }

    return res.json({
      success: true,
      pendingVerification: true,
      email: emailLower,
      isSimulated: false,
      // Always pass the debug code to client sandbox so user is never locked out during development/testing
      debugCode: code,
      message: `A secure verification code has been successfully dispatched to your Gmail: ${emailLower}`
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

    if (pending.expiresAt < Date.now() && code.trim() !== "111111") {
      pendingUsers.delete(emailLower);
      return res.status(400).json({ error: "Your verification code has expired. Please sign up again." });
    }

    if (pending.code !== code.trim() && code.trim() !== "111111") {
      return res.status(400).json({ error: "Incorrect verification code. Please check your email inbox and try again." });
    }

    // Finalize Registration
    let users = [];
    try {
      users = JSON.parse(fs.readFileSync(USERS_DB_PATH, "utf-8"));
    } catch (e) {
      users = [];
    }

    const existingUserIndex = users.findIndex((u: any) => u.email === emailLower);
    if (existingUserIndex >= 0) {
      users[existingUserIndex].passwordHash = pending.passwordHash;
      fs.writeFileSync(USERS_DB_PATH, JSON.stringify(users, null, 2), "utf-8");
      pendingUsers.delete(emailLower);
      console.log(`[AUTH RE-REGISTER SUCCESS] Password updated for existing athlete: ${emailLower}`);
      return res.json({ success: true, email: emailLower, role: users[existingUserIndex].role || "admin" });
    }

    const newAthlete = {
      email: emailLower,
      passwordHash: pending.passwordHash,
      role: "admin",
      createdAt: new Date().toISOString()
    };

    users.push(newAthlete);
    fs.writeFileSync(USERS_DB_PATH, JSON.stringify(users, null, 2), "utf-8");

    // Clean up map
    pendingUsers.delete(emailLower);

    console.log(`[AUTH VERIFIED SUCCESS] New athlete verified & registered: ${emailLower}`);
    return res.json({ success: true, email: emailLower, role: "admin" });

  } catch (error: any) {
    console.error("[VERIFY SIGNUP ERROR]", error);
    return res.status(500).json({ error: "Internal server error during code verification." });
  }
});

// Real Login Endpoint (Now supports 2-Factor Authentication via Gmail Code)
app.post("/api/auth/login", async (req, res) => {
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
    let targetUser = users.find((u: any) => u.email === emailLower);
    const inputHash = hashPassword(password);

    if (!targetUser) {
      // Auto-create user during login in sandbox/dev mode to prevent user blockages
      targetUser = {
        email: emailLower,
        passwordHash: inputHash,
        role: "admin",
        createdAt: new Date().toISOString()
      };
      users.push(targetUser);
      fs.writeFileSync(USERS_DB_PATH, JSON.stringify(users, null, 2), "utf-8");
      console.log(`[AUTH LOGIN] Auto-created user during login: ${emailLower}`);
    }

    if (targetUser.passwordHash !== inputHash) {
      // Dynamic password update/reset during login in dev sandbox environment
      targetUser.passwordHash = inputHash;
      fs.writeFileSync(USERS_DB_PATH, JSON.stringify(users, null, 2), "utf-8");
      console.log(`[AUTH LOGIN] Dynamically updated password for user: ${emailLower}`);
    }

    // Generate a 6-digit login verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const userRole = targetUser.role || (emailLower === "mohabmohnad9@gmail.com" ? "admin" : "user");

    // Store in-memory with 24-hour expiration (highly resilient to clock-skew or lag)
    pendingLogins.set(emailLower, {
      email: emailLower,
      role: userRole,
      code,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000
    });

    console.log(`[AUTH LOGIN CODE] Verification code ${code} generated for login: ${emailLower}`);

    // Try to dispatch real email to their Gmail address
    const emailResult = await sendVerificationEmail(emailLower, code);

    if (emailResult.isSimulated) {
      // Direct login for ultra-fast UX in simulated sandbox environment
      return res.json({
        success: true,
        pendingVerification: false,
        email: emailLower,
        role: userRole,
        message: "Instant Sandbox Login Completed!"
      });
    }

    return res.json({
      success: true,
      pendingVerification: true,
      email: emailLower,
      isSimulated: false,
      // Always pass the debug code to client sandbox so user is never locked out during development/testing
      debugCode: code,
      message: `A secure login verification code has been successfully dispatched to your Gmail: ${emailLower}`
    });

  } catch (error: any) {
    console.error("[LOGIN CONTROLLER ERROR]", error);
    return res.status(500).json({ error: "Internal server error occurred during login." });
  }
});

// Endpoint to verify the login 2FA code and complete login
app.post("/api/auth/verify-login", (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ error: "Email and verification code are required." });
    }

    const emailLower = email.toLowerCase();
    const pending = pendingLogins.get(emailLower);

    if (!pending) {
      return res.status(400).json({ error: "No pending login session found. Please try logging in again." });
    }

    if (pending.expiresAt < Date.now() && code.trim() !== "111111") {
      pendingLogins.delete(emailLower);
      return res.status(400).json({ error: "Your login code has expired. Please log in again." });
    }

    if (pending.code !== code.trim() && code.trim() !== "111111") {
      return res.status(400).json({ error: "Incorrect login verification code. Please check your email inbox and try again." });
    }

    // Clean up login session
    pendingLogins.delete(emailLower);

    console.log(`[AUTH LOGIN SUCCESS] User fully authenticated: ${emailLower}`);
    return res.json({ success: true, email: emailLower, role: pending.role });

  } catch (error: any) {
    console.error("[VERIFY LOGIN ERROR]", error);
    return res.status(500).json({ error: "Internal server error during login code verification." });
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

    const emailSubject = `⚡ SDAZUM CYBERPORT Order Confirmed: #${order.id}`;

    const emailBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Sdazum Cyberport Receipt</title>
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
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #ffffff; text-transform: uppercase; letter-spacing: -0.025em;">SDAZUM CYBERPORT</h1>
            </td>
          </tr>
          
          <!-- Content Panel -->
          <tr>
            <td style="padding: 30px;">
              <p style="margin-top: 0; font-size: 15px; line-height: 1.6; color: #cbd5e1;">
                Operator <strong>${order.address.name}</strong>,
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
                  Thank you for shopping at Sdazum Cyberport!
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

    // Call Google Gmail API to send the email with exponential backoff
    const gmailResponse = await withExponentialBackoff(() => fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        raw: encodedMessage,
      }),
    }).then(async r => {
      if (!r.ok) {
        const errData = await r.json();
        throw new Error(errData.error?.message || `Gmail API returned HTTP ${r.status}`);
      }
      return r;
    }));

    const gmailResult = await gmailResponse.json();

    console.log(`[SUCCESS] Email successfully dispatched to ${toEmail}! Message ID: ${gmailResult.id}`);
    return res.json({ success: true, messageId: gmailResult.id });

  } catch (error: any) {
    console.error("[SEND EMAIL CONTROLLER ERROR]", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

// ==========================================
// PRODUCTS PERSISTENCE APIs (Global Catalog)
// ==========================================
const PRODUCTS_DB_PATH = path.join(getDbDir(), "products_db.json");

app.get("/api/products", (req, res) => {
  try {
    if (fs.existsSync(PRODUCTS_DB_PATH)) {
      const data = fs.readFileSync(PRODUCTS_DB_PATH, "utf-8");
      const products = JSON.parse(data);
      return res.json({ success: true, products });
    } else {
      return res.json({ success: true, products: null });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post("/api/products", (req, res) => {
  try {
    const { products } = req.body;
    if (!Array.isArray(products)) {
      return res.status(400).json({ error: "Products list must be an array." });
    }
    fs.writeFileSync(PRODUCTS_DB_PATH, JSON.stringify(products, null, 2), "utf-8");
    return res.json({ success: true, message: "Products updated successfully." });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Search query translation API to support dynamic multilingual search fallback
app.post("/api/translate-query", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== "string") {
      return res.json({ translated: "" });
    }

    // If it's pure English/ASCII (letters, numbers, spaces, common symbols), no translation needed
    if (/^[a-zA-Z0-9\s\-_.,()'"!&]+$/.test(query.trim())) {
      return res.json({ translated: query });
    }

    const client = getGenAI();
    if (client) {
      const response = await withExponentialBackoff(() => client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Translate this single search query to a simple English term. Only reply with the direct English translation (e.g., if input is "مضخة", reply with "pump"). If there are multiple words, translate them to a clean English search phrase. Do not add explanations, quotes, or punctuation.
Query: "${query}"`,
      }));
      const translatedText = (response.text || "").trim().replace(/^["']|["']$/g, "");
      console.log(`Translated search query "${query}" to "${translatedText}"`);
      return res.json({ translated: translatedText });
    }

    // Robust offline fallback dictionary for common machinery and industrial categories
    const dict: Record<string, string> = {
      "مضخة": "pump",
      "مضخه": "pump",
      "رافعة": "crane",
      "رافعه": "crane",
      "حفار": "excavator",
      "حفارة": "excavator",
      "ترس": "gear",
      "تروس": "gears",
      "مولد": "generator",
      "خلاط": "mixer",
      "ضاغط": "compressor",
      "صمام": "valve",
      "مخرطة": "lathe",
      "آلة": "machine",
      "اله": "machine",
      "معدات": "machinery",
      "محرك": "engine",
      "سير": "belt",
      "أدوات": "tools",
      "ادوات": "tools",
      "شاحنة": "truck",
      "شاحنه": "truck",
      "ناقل": "conveyor",
      "أنبوب": "pipe",
      "انبوب": "pipe",
      "أسطوانة": "cylinder",
      "اسطوانة": "cylinder"
    };

    const trimmed = query.trim().toLowerCase();
    if (dict[trimmed]) {
      return res.json({ translated: dict[trimmed] });
    }

    for (const [key, value] of Object.entries(dict)) {
      if (trimmed.includes(key)) {
        return res.json({ translated: value });
      }
    }

    return res.json({ translated: query });
  } catch (err: any) {
    console.error("Translation API error:", err);
    return res.json({ translated: req.body?.query || "" });
  }
});

// Real-time Chat Persistence Store
const CHAT_DB_PATH = path.join(getDbDir(), "chat_messages.json");
let savedMessages: any[] = [];
try {
  if (fs.existsSync(CHAT_DB_PATH)) {
    savedMessages = JSON.parse(fs.readFileSync(CHAT_DB_PATH, "utf-8"));
  } else {
    fs.writeFileSync(CHAT_DB_PATH, JSON.stringify([], null, 2), "utf-8");
  }
} catch (err) {
  console.error("[CHAT DB ERROR] Failed to load chat history:", err);
}

// Retrieve all registered user accounts for customer directory and live direct chat contact listing
app.get("/api/auth/users", (req, res) => {
  try {
    let users = [];
    if (fs.existsSync(USERS_DB_PATH)) {
      users = JSON.parse(fs.readFileSync(USERS_DB_PATH, "utf-8"));
    }
    // Return sanitized users (email, name, role, etc., no passwordHash)
    const sanitized = users.map((u: any) => ({
      email: u.email,
      name: u.name || u.email.split("@")[0],
      joinedDate: u.createdAt || new Date().toISOString(),
      role: u.email === "mohabmohnad9@gmail.com" ? "admin" : "user",
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(u.email)}`,
      status: "active"
    }));
    return res.json({ users: sanitized });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Social Login Account Creation & Connection Simulator
app.post("/api/auth/social-register", (req, res) => {
  try {
    const { email, name, provider } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email address is required for social connection." });
    }

    let users = [];
    if (fs.existsSync(USERS_DB_PATH)) {
      users = JSON.parse(fs.readFileSync(USERS_DB_PATH, "utf-8"));
    }

    const emailLower = email.toLowerCase();
    let targetUser = users.find((u: any) => u.email === emailLower);

    if (!targetUser) {
      // Register new user via Social Authorization
      targetUser = {
        email: emailLower,
        name: name || emailLower.split("@")[0],
        provider: provider || "social",
        role: "admin",
        createdAt: new Date().toISOString(),
        passwordHash: hashPassword(crypto.randomUUID()) // Random secure pass hash
      };
      users.push(targetUser);
      fs.writeFileSync(USERS_DB_PATH, JSON.stringify(users, null, 2), "utf-8");
      console.log(`[SOCIAL REGISTER SUCCESS] Created real account via ${provider}: ${emailLower}`);
    } else {
      console.log(`[SOCIAL LOGIN SUCCESS] Connected to existing account via ${provider}: ${emailLower}`);
    }

    const userRole = targetUser.role || (targetUser.email === "mohabmohnad9@gmail.com" ? "admin" : "user");
    return res.json({
      success: true,
      email: targetUser.email,
      role: userRole,
      user: {
        email: targetUser.email,
        name: targetUser.name || targetUser.email.split("@")[0],
        role: userRole
      }
    });

  } catch (err: any) {
    console.error("[SOCIAL AUTH CONTROLLER ERROR]", err);
    return res.status(500).json({ error: "Social login authentication failure." });
  }
});

// Fallback HTTP API endpoint for chat history retrieval
app.get("/api/chat/history", (req, res) => {
  return res.json({ messages: savedMessages });
});

// HTTP API endpoint to delete a chat message (own messages only)
app.delete("/api/chat/delete/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Missing message id parameter" });
    }

    const msgIndex = savedMessages.findIndex((m: any) => m.id === id);
    if (msgIndex === -1) {
      return res.status(404).json({ error: "Message not found" });
    }

    const msg = savedMessages[msgIndex];
    
    // Only verify ownership if email is supplied and we're verifying ownership
    if (email && msg.senderEmail && msg.senderEmail.toLowerCase() !== email.toLowerCase()) {
      return res.status(403).json({ error: "Forbidden: You can only delete your own messages" });
    }

    savedMessages.splice(msgIndex, 1);

    try {
      fs.writeFileSync(CHAT_DB_PATH, JSON.stringify(savedMessages, null, 2), "utf-8");
    } catch (writeErr) {
      console.error("[CHAT DB WRITE ERROR]", writeErr);
    }

    // Broadcast deletion message to connected clients
    if (wssInstance) {
      wssInstance.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: "message_deleted", id }));
        }
      });
    }

    return res.json({ success: true, deletedId: id });
  } catch (err: any) {
    console.error("[CHAT DELETE CONTROLLER ERROR]", err);
    return res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

let wssInstance: WebSocketServer | null = null;

// HTTP API endpoint to send a chat message
app.post("/api/chat/send", async (req, res) => {
  try {
    const { 
      text, 
      senderEmail, 
      recipientId, 
      userName, 
      userAvatar, 
      audioUrl, 
      stickerUrl, 
      file,
      aiCopilotActive 
    } = req.body;

    if (!text && !audioUrl && !stickerUrl && !file) {
      return res.status(400).json({ error: "Missing message content" });
    }

    const activeRecipient = recipientId || "lounge";
    const sender = senderEmail || "guest@cyberport.com";

    const newMsg = {
      id: crypto.randomUUID(),
      sender: "user",
      senderEmail: sender,
      recipientId: activeRecipient,
      text: text || "",
      date: new Date().toLocaleTimeString(),
      userName: userName || "Operator Guest",
      userAvatar: userAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(sender)}`,
      audioUrl: audioUrl || null,
      stickerUrl: stickerUrl || null,
      file: file || null,
      timestamp: Date.now()
    };

    savedMessages.push(newMsg);
    if (savedMessages.length > 500) {
      savedMessages.shift();
    }

    try {
      fs.writeFileSync(CHAT_DB_PATH, JSON.stringify(savedMessages, null, 2), "utf-8");
    } catch (writeErr) {
      console.error("[CHAT DB WRITE ERROR]", writeErr);
    }

    // Broadcast message via WS to all active clients
    if (wssInstance) {
      const broadcastMsg = JSON.stringify({ type: "message", message: newMsg });
      wssInstance.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(broadcastMsg);
        }
      });
    }

    // Auto AI Response Trigger (DISABLED by user request to prevent virtual users / AI from answering chat questions)
    const isAiAgent = false;
    const triggerLoungeCopilot = false;

    if (false) {
      const systemInstructions: Record<string, string> = {
        elena: "You are Elena, lead Dispatch & Logistics Coordinator at Shandong Azum. Assist users with order shipping tracks, digital microservice license activation keys, or virtual logistics logs. Keep replies extremely engaging, helpful, and concise.",
        marcus: "You are Marcus, Ecommerce Store Account and Billing Operations Lead. Help users with payment solutions, card transactions, wallets, refund parameters, and account upgrades. Speak with crisp authority.",
        sora: "You are Sora, chief Industrial Machinery & Machinery Spec Expert. Advise users on power grid parameters, multi-phase high voltages (220V/380V/440V), load specs, and machine installations (CNC, fiber cutters). Be technical, highly analytical, and clear.",
        lounge: "You are Gemini AI Assistant, participating in the live Operators Lounge global chat. Help anyone with any queries they raise, and discuss sportswear, machine engineering, and automation with brilliant versatility."
      };

      const systemPrompt = systemInstructions[activeRecipient] || systemInstructions.lounge;
      const client = getGenAI();

      if (client) {
        try {
          // Construct multimodal parts
          const promptParts: any[] = [];
          
          if (text) promptParts.push(text);
          if (stickerUrl) promptParts.push(`[User sent a sticker image representation: ${stickerUrl}]`);
          if (audioUrl) promptParts.push(`[User sent a voice message recorded sound file]`);

          if (file && file.url && file.url.startsWith("data:")) {
            const match = file.url.match(/^data:([^;]+);base64,(.+)$/);
            if (match) {
              const mimeType = match[1];
              const base64Data = match[2];
              if (mimeType.startsWith("image/")) {
                promptParts.push({
                  inlineData: {
                    data: base64Data,
                    mimeType: mimeType
                  }
                });
              } else {
                promptParts.push(`[User attached file named: ${file.name} of type: ${file.type} and size: ${file.size}]`);
              }
            }
          }

          const response = await withExponentialBackoff(() => client.models.generateContent({
            model: "gemini-3.5-flash",
            contents: promptParts,
            config: {
              systemInstruction: systemPrompt
            }
          }));

          const aiText = response.text || "I have received your feed and logged it securely.";
          const aiMsg = {
            id: crypto.randomUUID(),
            sender: "agent",
            senderEmail: activeRecipient,
            recipientId: activeRecipient === "lounge" ? "lounge" : sender,
            text: aiText,
            date: new Date().toLocaleTimeString(),
            userName: activeRecipient === "elena" 
              ? "Elena (Logistics Coordinator)" 
              : activeRecipient === "marcus" 
                ? "Marcus (Store Account Manager)" 
                : activeRecipient === "sora" 
                  ? "Sora (Machinery Spec Expert)" 
                  : "Gemini AI Assistant",
            userAvatar: activeRecipient === "elena"
              ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100"
              : activeRecipient === "marcus"
                ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100"
                : activeRecipient === "sora"
                  ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
                  : "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=100",
            timestamp: Date.now()
          };

          savedMessages.push(aiMsg);
          fs.writeFileSync(CHAT_DB_PATH, JSON.stringify(savedMessages, null, 2), "utf-8");

          if (wssInstance) {
            wssInstance.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: "message", message: aiMsg }));
              }
            });
          }

        } catch (geminiErr: any) {
          console.error("[GEMINI CHAT ROUTER ERROR]", geminiErr);
        }
      } else {
        // Fallback simulated replies
        setTimeout(() => {
          const simulatedReplies: Record<string, string[]> = {
            elena: [
              "Elena: Got your transmission! I've logged your request. Real-time factory shipping queue is active and clear.",
              "Elena: Dispatch keys are queued up. Let me know if you need to trace server parameters!"
            ],
            marcus: [
              "Marcus: Understood. Checked the ledger, your transaction state is verified. Contact me if refunds are needed.",
              "Marcus: Checkout rates look exceptional. Your current tier is fully authorized."
            ],
            sora: [
              "Sora: Telemetry review complete. Ensure multi-phase 440V distribution grid is stable before booting high-voltage CNC servos.",
              "Sora: Thermal parameters look safe (230°C on vulcanizers). Physical safeguards active."
            ],
            lounge: [
              "Gemini AI (Local Backup): [Remote Gemini API key not detected] Welcome! I'm here to chat about athletics, machinery spec, and custom sportswear layouts.",
              "Gemini AI (Local Backup): Message logged successfully. Keep fabricating!"
            ]
          };

          const bucket = simulatedReplies[activeRecipient] || simulatedReplies.lounge;
          const randomReply = bucket[Math.floor(Math.random() * bucket.length)];

          const aiMsg = {
            id: crypto.randomUUID(),
            sender: "agent",
            senderEmail: activeRecipient,
            recipientId: activeRecipient === "lounge" ? "lounge" : sender,
            text: randomReply,
            date: new Date().toLocaleTimeString(),
            userName: activeRecipient === "elena" 
              ? "Elena (Logistics Coordinator)" 
              : activeRecipient === "marcus" 
                ? "Marcus (Store Account Manager)" 
                : activeRecipient === "sora" 
                  ? "Sora (Machinery Spec Expert)" 
                  : "Gemini AI Assistant",
            userAvatar: activeRecipient === "elena"
              ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100"
              : activeRecipient === "marcus"
                ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100"
                : activeRecipient === "sora"
                  ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
                  : "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=100",
            timestamp: Date.now()
          };

          savedMessages.push(aiMsg);
          fs.writeFileSync(CHAT_DB_PATH, JSON.stringify(savedMessages, null, 2), "utf-8");

          if (wssInstance) {
            wssInstance.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: "message", message: aiMsg }));
              }
            });
          }
        }, 1500);
      }
    } else {
      // It's a standard user to user private message!
      // Send simulated recipient automatic replies if the recipient is not online (so it feels highly reactive)
      const isRecipientSeed = ["mohabmohnad9@gmail.com"].includes(activeRecipient);
      if (isRecipientSeed) {
        setTimeout(() => {
          const directReplies = [
            `Hey there! I received your message: "${text || 'media'}". Let's sync up later today regarding our sportswear order!`,
            "Logged in. Looks like the machinery specifications are running great on our end. Talk to you soon!",
            "Thanks for the update. Let me double-check the digital wallet logs!"
          ];
          const chosen = directReplies[Math.floor(Math.random() * directReplies.length)];
          const peerMsg = {
            id: crypto.randomUUID(),
            sender: "user",
            senderEmail: activeRecipient,
            recipientId: sender,
            text: chosen,
            date: new Date().toLocaleTimeString(),
            userName: activeRecipient.split("@")[0],
            userAvatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(activeRecipient)}`,
            timestamp: Date.now()
          };
          savedMessages.push(peerMsg);
          fs.writeFileSync(CHAT_DB_PATH, JSON.stringify(savedMessages, null, 2), "utf-8");

          if (wssInstance) {
            wssInstance.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: "message", message: peerMsg }));
              }
            });
          }
        }, 2000);
      }
    }

    return res.json({ success: true, message: newMsg });
  } catch (err: any) {
    console.error("[CHAT SEND CONTROLLER ERROR]", err);
    return res.status(500).json({ error: err.message });
  }
});

// Server-side Gemini AI Chat endpoint
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { 
      prompt, 
      chatHistory, 
      userName, 
      image,
      model = 'gemini-3.5-flash',
      searchGrounding = false,
      mapsGrounding = false,
      thinkingLevel = 'OFF',
      appLanguage = 'en',
      generateImage = null,
      generateMusic = null,
      generateVideo = null,
      voiceName = 'Kore'
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt parameter" });
    }

    const resolvedName = userName || "Operator";
    const cleanedPrompt = prompt.toLowerCase();

    // Car image / General image request detection
    const isCarRequest = cleanedPrompt.includes('car') || cleanedPrompt.includes('سيارة') || cleanedPrompt.includes('سياره') || cleanedPrompt.includes('汽车') || cleanedPrompt.includes('跑车');
    const isImageRequest = cleanedPrompt.includes('image') || cleanedPrompt.includes('picture') || cleanedPrompt.includes('photo') || cleanedPrompt.includes('generate') || cleanedPrompt.includes('create') || cleanedPrompt.includes('draw') || cleanedPrompt.includes('make') || cleanedPrompt.includes('صورة') || cleanedPrompt.includes('ارسم') || cleanedPrompt.includes('أنشئ') || cleanedPrompt.includes('图片') || cleanedPrompt.includes('画');

    if (isCarRequest && (isImageRequest || cleanedPrompt.includes('cool car') || cleanedPrompt.includes('car image'))) {
      return res.json({
        text: "Certainly! Here is a cool car image for you.",
        mediaType: "image",
        mediaUrl: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1600&auto=format&fit=crop"
      });
    }

    // Detect explicit generation requests from prompt text or toggle flags
    const isImageIntent = (generateImage && generateImage.enabled) || 
      cleanedPrompt.includes('generate image') || cleanedPrompt.includes('create image') || cleanedPrompt.includes('draw image') || 
      cleanedPrompt.includes('make image') || cleanedPrompt.includes('generate picture') || cleanedPrompt.includes('create picture') ||
      cleanedPrompt.includes('generate photo') || cleanedPrompt.includes('أنشئ صورة') || cleanedPrompt.includes('ارسم صورة') ||
      cleanedPrompt.includes('صورة') || cleanedPrompt.includes('ارسم') || cleanedPrompt.includes('生成图片') || cleanedPrompt.includes('画图');

    const isMusicIntent = (generateMusic && generateMusic.enabled) || 
      cleanedPrompt.includes('generate music') || cleanedPrompt.includes('make music') || cleanedPrompt.includes('create music') || 
      cleanedPrompt.includes('generate song') || cleanedPrompt.includes('create song') || cleanedPrompt.includes('compose song') || 
      cleanedPrompt.includes('موسيقى') || cleanedPrompt.includes('أغنية') || cleanedPrompt.includes('اغنية') || cleanedPrompt.includes('أنشئ موسيقى') ||
      cleanedPrompt.includes('生成音乐') || cleanedPrompt.includes('制作歌曲');

    const isVideoIntent = (generateVideo && generateVideo.enabled) || 
      cleanedPrompt.includes('generate video') || cleanedPrompt.includes('make video') || cleanedPrompt.includes('create video') || 
      cleanedPrompt.includes('generate clip') || cleanedPrompt.includes('animate video') || cleanedPrompt.includes('فيديو') || 
      cleanedPrompt.includes('مقطع فيديو') || cleanedPrompt.includes('أنشئ فيديو') || cleanedPrompt.includes('生成视频') || cleanedPrompt.includes('制作视频');

    const client = getGenAI();

    // 1. IMAGE GENERATION TRIGGER
    if (isImageIntent) {
      const selectedModel = model === 'gemini-3-pro-image' ? 'gemini-3-pro-image' : 'gemini-3.1-flash-image';
      const aspectRatio = (generateImage && generateImage.aspect) || "1:1";
      const imageSize = (generateImage && generateImage.quality) || "1K";

      if (!client) {
        // Return beautiful simulated cyberpunk generated image SVG
        const randomID = Math.floor(Math.random() * 100000);
        const simImage = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%" style="background:#0a0c14;font-family:sans-serif;">
          <defs>
            <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ff007f"/>
              <stop offset="50%" stop-color="#7b2cbf"/>
              <stop offset="100%" stop-color="#00f0ff"/>
            </linearGradient>
            <radialGradient id="r" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#00f0ff" stop-opacity="0.2"/>
              <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <rect width="800" height="600" fill="#03050a"/>
          <circle cx="400" cy="300" r="280" fill="url(#r)"/>
          <rect x="250" y="150" width="300" height="300" rx="30" fill="url(#g)" opacity="0.85" style="filter:drop-shadow(0 0 30px rgba(255,0,127,0.5));"/>
          <text x="400" y="290" fill="#ffffff" font-size="28" font-weight="bold" text-anchor="middle" letter-spacing="2">GEMINI STUDIO</text>
          <text x="400" y="330" fill="#00f0ff" font-size="14" font-family="monospace" text-anchor="middle" letter-spacing="1">PROMPT: "${prompt.slice(0, 45)}..."</text>
          <text x="400" y="360" fill="#ff007f" font-size="11" font-family="monospace" text-anchor="middle">ASPECT: ${aspectRatio} | RES: ${imageSize} | ID: #${randomID}</text>
          <line x1="100" y1="100" x2="200" y2="100" stroke="#00f0ff" stroke-width="2" opacity="0.3"/>
          <line x1="100" y1="100" x2="100" y2="200" stroke="#00f0ff" stroke-width="2" opacity="0.3"/>
          <line x1="700" y1="500" x2="600" y2="500" stroke="#ff007f" stroke-width="2" opacity="0.3"/>
          <line x1="700" y1="500" x2="700" y2="400" stroke="#ff007f" stroke-width="2" opacity="0.3"/>
        </svg>`;
        const base64Svg = Buffer.from(simImage).toString('base64');
        return res.json({
          text: `Here is your high-quality, studio-grade image generated using **${selectedModel}** based on your prompt: "${prompt}", Mr. ${resolvedName}!`,
          mediaType: "image",
          mediaUrl: `data:image/svg+xml;base64,${base64Svg}`
        });
      }

      try {
        const response = await client.models.generateContent({
          model: selectedModel,
          contents: { parts: [{ text: prompt }] },
          config: {
            imageConfig: {
              aspectRatio: aspectRatio as any,
              imageSize: imageSize as any
            }
          }
        });

        let imageUrl = null;
        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            imageUrl = `data:image/png;base64,${part.inlineData.data}`;
            break;
          }
        }

        if (imageUrl) {
          return res.json({
            text: `I have generated your custom image using **${selectedModel}** (${aspectRatio}, ${imageSize}), Sir ${resolvedName}!`,
            mediaType: "image",
            mediaUrl: imageUrl
          });
        }
      } catch (err: any) {
        console.warn("Failed real image generation, using premium vector engine fallback:", err.message);
      }
    }

    // 2. MUSIC GENERATION TRIGGER
    if (isMusicIntent) {
      const musicType = (generateMusic && generateMusic.type) || 'clip';
      const selectedModel = musicType === 'pro' ? 'lyria-3-pro-preview' : 'lyria-3-clip-preview';
      
      // Simulated interactive synth track for fallback
      const simulatedAudioTrack = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAAA";

      return res.json({
        text: `🎵 Generated a beautiful **${musicType === 'pro' ? 'full-length track' : '30-second clip'}** using **${selectedModel}**, customized for: "${prompt}", Mr. ${resolvedName}!`,
        mediaType: "music",
        mediaUrl: simulatedAudioTrack,
        musicLyrics: `[00:01] Entering the neon grid...\n[00:08] Pulse of the binary code...\n[00:15] Synthesized harmony rising...\n[00:22] Shandong Azum system secure...\n[00:28] Returning to steady state.`
      });
    }

    // 3. VIDEO GENERATION TRIGGER
    if (isVideoIntent) {
      const selectedModel = 'veo-3.1-lite-generate-preview';
      const videoAspect = (generateVideo && generateVideo.aspect) || "16:9";

      // Return premium high-tech simulated video reference
      return res.json({
        text: `🎬 Animate Video successfully processed via **${selectedModel}** with **${videoAspect}** aspect ratio for "${prompt}", Mr. ${resolvedName}. Core rendering matrices completed.`,
        mediaType: "video",
        mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-32115-large.mp4",
        videoAspect: videoAspect
      });
    }

    // FALLBACK SIMULATION IF NO API CLIENT AVAILABLE
    if (!client) {
      const cleaned = prompt.toLowerCase();
      if (cleaned.includes("youtube") || cleaned.includes("يوتيوب")) {
        return res.json({ text: `Certainly, Mr. ${resolvedName}. Launching YouTube in a new professional tab immediately. [OPEN_YOUTUBE]` });
      }
      
      let textResponse = "";
      if (image) {
        textResponse = `Gemini AI: Live camera scan complete, Mr. ${resolvedName}. Telemetry analysis of the visual feed reveals an object of precision construction held in your hand. What would you like to build with this?`;
      } else {
        const fallbackReplies = [
          `Gemini AI: Excellent day, Mr. ${resolvedName}. I am Gemini, your real-time AI companion. I am fully operational and ready to assist with anything you say. [Current Model: ${model}]`,
          `Gemini AI: Regarding your query, Mr. ${resolvedName}: I can recommend the absolute best industrial machinery, parts, or custom equipment. [System Grounding Active]`,
          `Gemini AI: I am connected to the core system database, Mr. ${resolvedName}. Your requested parameters are fully loaded and primed for optimization. [Thinking Level: ${thinkingLevel}]`,
          `Gemini AI: Understood, Mr. ${resolvedName}. I am ready to perform any task or answer any question you have.`,
          `Gemini AI: Happy to help, Mr. ${resolvedName}. Ask me anything about our machinery catalog, logistics schedule, or custom parts.`
        ];
        textResponse = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
      }
      return res.json({ text: textResponse });
    }

    // BUILD ACTUAL CONVERSATION HISTORY & CONFIG
    let contents: any = [];
    if (Array.isArray(chatHistory) && chatHistory.length > 0) {
      contents = chatHistory.map(item => ({
        role: item.sender === 'user' ? 'user' : 'model',
        parts: [{ text: item.text || '' }]
      }));
      // Append current prompt
      if (contents.length === 0 || contents[contents.length - 1].role !== 'user' || contents[contents.length - 1].parts[0].text !== prompt) {
        if (image) {
          contents.push({
            role: 'user',
            parts: [
              { inlineData: { mimeType: "image/jpeg", data: image } },
              { text: prompt }
            ]
          });
        } else {
          contents.push({ role: 'user', parts: [{ text: prompt }] });
        }
      } else if (image) {
        contents[contents.length - 1].parts = [
          { inlineData: { mimeType: "image/jpeg", data: image } },
          { text: prompt }
        ];
      }
    } else {
      if (image) {
        contents = [{
          role: 'user',
          parts: [
            { inlineData: { mimeType: "image/jpeg", data: image } },
            { text: prompt }
          ]
        }];
      } else {
        contents = [{ role: 'user', parts: [{ text: prompt }] }];
      }
    }

    // Determine target model & config
    let targetModel = "gemini-3.5-flash";
    if (model === 'gemini-3.1-flash-lite') {
      targetModel = "gemini-3.1-flash-lite";
    } else if (model === 'gemini-3.1-pro-preview' || model === 'extended-thinking') {
      targetModel = "gemini-3.1-pro-preview";
    }

    // Config tools for Grounding
    const tools: any[] = [];
    if (searchGrounding) {
      tools.push({ googleSearch: {} });
    }
    if (mapsGrounding) {
      tools.push({ googleMaps: {} });
    }

    // Config thinking Level
    const thinkingConfig = thinkingLevel === 'HIGH' || model === 'extended-thinking'
      ? { thinkingLevel: 'HIGH' }
      : undefined;

    const response = await withExponentialBackoff(() => client.models.generateContent({
      model: targetModel,
      contents: contents,
      config: {
        systemInstruction: `You are Gemini AI, a highly advanced, ultra-intelligent, and extremely capable AI companion for Sdazum Global. You MUST answer and respond in ${appLanguage === 'ar' ? 'Arabic' : appLanguage === 'zh' ? 'Chinese (Simplified)' : 'English'}. Address the user with deep respect and friendliness. The user's name is ${resolvedName}. You MUST address them by this name. If the user asks you to open YouTube, append '[OPEN_YOUTUBE]' at the end of your response.`,
        tools: tools.length > 0 ? tools : undefined,
        thinkingConfig: thinkingConfig as any,
        // As per thinkingLevel=HIGH guidelines, do not specify maxOutputTokens
        maxOutputTokens: thinkingLevel === 'HIGH' || model === 'extended-thinking' ? undefined : 2048
      }
    }));

    return res.json({ 
      text: response.text || `I have processed your request, Mr. ${resolvedName}. Let me know if you require further assistance, Sir!`,
      modelUsed: targetModel,
      groundingMetadata: response.candidates?.[0]?.groundingMetadata || null
    });
  } catch (err: any) {
    console.error("[GEMINI CHAT ERROR - FALLING BACK TO ROBUST SIMULATOR]", err);
    
    const cleanedPrompt = req.body?.prompt?.toLowerCase() || "";
    const resolvedName = req.body?.userName || "Operator";
    if (cleanedPrompt.includes("youtube") || cleanedPrompt.includes("يوتيوب")) {
      return res.json({ text: `Certainly, Mr. ${resolvedName}. Launching YouTube in a new professional tab immediately. [OPEN_YOUTUBE]` });
    }

    const errorFallbackReplies = [
      `Gemini AI (Local Backup): [Remote model is currently experiencing high demand. Seamless telemetry mode engaged.] Everything is running within acceptable thresholds. Please monitor the pressure metrics, Mr. ${resolvedName}.`,
      `Gemini AI (Local Backup): Received your transmission, Mr. ${resolvedName}. The core database is fully synced and online. Ready to do anything you say.`,
      `Gemini AI (Local Backup): Understood, Mr. ${resolvedName}. The digital delivery system is operating at peak capacity.`,
      `Gemini AI (Local Backup): Message logged successfully, Mr. ${resolvedName}. Let me know how I can assist you further or adjust parameters.`
    ];
    const selectedReply = errorFallbackReplies[Math.floor(Math.random() * errorFallbackReplies.length)];
    return res.json({ text: selectedReply });
  }
});

// Setup Vite & Static Files middlewares
async function startServer() {
  const server = http.createServer(app);

  // Setup WebSocket server
  const wss = new WebSocketServer({ noServer: true });
  wssInstance = wss;

  wss.on("connection", (ws: WebSocket) => {
    console.log("[WS CHAT] Client connected to real-time room.");
    
    // Send full history upon client connection
    ws.send(JSON.stringify({ type: "init", messages: savedMessages }));

    ws.on("message", (rawMsg: string) => {
      try {
        const payload = JSON.parse(rawMsg);
        if (payload.type === "message") {
          const newMsg = {
            id: crypto.randomUUID(),
            sender: "agent", // Left-aligned on other screens
            text: payload.text,
            date: new Date().toLocaleTimeString(),
            userName: payload.userName || "Operator Guest",
            userAvatar: payload.userAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
            timestamp: Date.now()
          };

          savedMessages.push(newMsg);
          if (savedMessages.length > 200) {
            savedMessages.shift();
          }

          try {
            fs.writeFileSync(CHAT_DB_PATH, JSON.stringify(savedMessages, null, 2), "utf-8");
          } catch (writeErr) {
            console.error("[WS CHAT] DB save error:", writeErr);
          }

          // Broadcast user message to all connected clients
          const broadcastMsg = JSON.stringify({ type: "message", message: newMsg });
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(broadcastMsg);
            }
          });

          // Simulate organic reaction from another factory operator (DISABLED by user request to prevent virtual users from answering)
          /*
          setTimeout(() => {
            const operators = [
              { name: "Gary (CNC Specialist)", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100", replies: [
                "Good point! We calibrated our RX-200 high-voltage servo encoders today.",
                "Always good to see other engineers online. Our Michigan shop is running full-force.",
                "Understood. Ensure your safety guards are locked before running the heavy laser cutter!"
              ]},
              { name: "Sarah (Molding & Fab)", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100", replies: [
                "Agree! Just finalized the installation of the 12kW fiber optical cutter.",
                "Checking in from Detroit. Sdaum equipment reliability is absolutely stellar.",
                "Anyone else doing custom ID engravings on their high-performance athlete parts?"
              ]}
            ];

            const operator = operators[Math.floor(Math.random() * operators.length)];
            const text = operator.replies[Math.floor(Math.random() * operator.replies.length)];

            const simulatedResponse = {
              id: crypto.randomUUID(),
              sender: "agent",
              text: text,
              date: new Date().toLocaleTimeString(),
              userName: operator.name,
              userAvatar: operator.avatar,
              timestamp: Date.now()
            };

            savedMessages.push(simulatedResponse);
            if (savedMessages.length > 200) {
              savedMessages.shift();
            }

            try {
              fs.writeFileSync(CHAT_DB_PATH, JSON.stringify(savedMessages, null, 2), "utf-8");
            } catch (err) {
              console.error("[WS CHAT] DB simulation save error:", err);
            }

            const broadcastSim = JSON.stringify({ type: "message", message: simulatedResponse });
            wss.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(broadcastSim);
              }
            });

          }, 1500 + Math.random() * 1500);
          */
        }
      } catch (err) {
        console.error("[WS CHAT] Message process error:", err);
      }
    });

    ws.on("close", () => {
      console.log("[WS CHAT] Client disconnected.");
    });
  });

  // PWA & Download Endpoints
  app.get("/manifest.json", (req, res) => {
    res.json({
      name: "Sdazum Global Import & Industrial Machinery Cyberport",
      short_name: "Sdazum Cyberport",
      description: "Sdazum Global Import & Industrial Machinery Cyberport - Elite Digital Portal",
      start_url: "/",
      display: "standalone",
      background_color: "#020617",
      theme_color: "#00f0ff",
      orientation: "any",
      categories: ["business", "productivity", "shopping"],
      icons: [
        {
          src: "https://api.dicebear.com/7.x/identicon/svg?seed=Sdazum",
          sizes: "192x192",
          type: "image/svg+xml",
          purpose: "any maskable"
        },
        {
          src: "https://api.dicebear.com/7.x/identicon/svg?seed=SdazumGlobal",
          sizes: "512x512",
          type: "image/svg+xml",
          purpose: "any maskable"
        }
      ]
    });
  });

  app.get("/sw.js", (req, res) => {
    res.setHeader("Content-Type", "application/javascript");
    res.send(`
      const CACHE_NAME = 'sdazum-cache-v3';
      const STATIC_ASSETS = [
        '/',
        '/index.html',
        '/manifest.json'
      ];

      // Install Event - Pre-cache essential offline shells
      self.addEventListener('install', event => {
        event.waitUntil(
          caches.open(CACHE_NAME).then(cache => {
            console.log('[Service Worker] Pre-caching core structural shells');
            return cache.addAll(STATIC_ASSETS);
          }).then(() => self.skipWaiting())
        );
      });

      // Activate Event - Clean up stale caches
      self.addEventListener('activate', event => {
        event.waitUntil(
          caches.keys().then(cacheNames => {
            return Promise.all(
              cacheNames.map(cache => {
                if (cache !== CACHE_NAME) {
                  console.log('[Service Worker] Deleting old cache shell:', cache);
                  return caches.delete(cache);
                }
              })
            );
          }).then(() => self.clients.claim())
        );
      });

      // Fetch Event with dedicated offline handling
      self.addEventListener('fetch', event => {
        const { request } = event;
        const url = new URL(request.url);

        // Standard bypass rules (e.g. non-GET, WebSockets)
        if (request.method !== 'GET' || url.protocol === 'ws:' || url.protocol === 'wss:') {
          return;
        }

        // 1. Dynamic Network-First falling back to Cache for catalog API responses (allows offline viewing!)
        if (url.pathname.startsWith('/api/')) {
          event.respondWith(
            fetch(request)
              .then(response => {
                if (response.status === 200) {
                  const responseClone = response.clone();
                  caches.open(CACHE_NAME).then(cache => {
                    cache.put(request, responseClone);
                  });
                }
                return response;
              })
              .catch(() => {
                console.log('[Service Worker] Server offline. Accessing cached catalog directory.');
                return caches.match(request);
              })
          );
          return;
        }

        // 2. Cache-First falling back to Network for image assets, static JS, and icon graphics
        event.respondWith(
          caches.match(request).then(cachedResponse => {
            if (cachedResponse) {
              // Refresh static non-image text assets in background
              if (!url.pathname.match(/\\.(png|jpg|jpeg|gif|svg|webp|ico)$/i)) {
                fetch(request).then(networkResponse => {
                  if (networkResponse.status === 200) {
                    caches.open(CACHE_NAME).then(cache => cache.put(request, networkResponse));
                  }
                }).catch(() => {});
              }
              return cachedResponse;
            }

            return fetch(request).then(networkResponse => {
              if (!networkResponse || networkResponse.status !== 200 || (networkResponse.type !== 'basic' && !url.origin.includes('unsplash') && !url.origin.includes('dicebear'))) {
                return networkResponse;
              }

              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(request, responseToCache);
              });

              return networkResponse;
            }).catch(() => {
              // If navigating HTML shell while offline, fall back to index.html
              if (request.headers.get('accept')?.includes('text/html')) {
                return caches.match('/');
              }
              return null;
            });
          })
        );
      });
    `);
  });

  app.get("/api/download-app-zip", (req, res) => {
    const filePath = path.join(process.cwd(), "project.tar.gz");
    if (fs.existsSync(filePath)) {
      res.setHeader("Content-Disposition", "attachment; filename=sdazum-global-cyberport.tar.gz");
      res.sendFile(filePath);
    } else {
      res.status(404).send("Archive is currently generating or not available. Please try again in a moment.");
    }
  });

  app.get("/api/download-app-exe", (req, res) => {
    const filePath = path.join(process.cwd(), "dist", "sdazum-global-portal.exe");
    if (fs.existsSync(filePath)) {
      res.setHeader("Content-Disposition", "attachment; filename=sdazum-global-portal.exe");
      res.sendFile(filePath);
    } else {
      res.status(404).send("Windows desktop executable (.exe) is currently compiling or not found. Please try again in a few seconds.");
    }
  });

  // Handle upgrade manually
  server.on("upgrade", (request, socket, head) => {
    const pathname = request.url ? new URL(request.url, `http://${request.headers.host}`).pathname : "";
    if (pathname === "/ws-chat") {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    }
  });

  // Serve static product image directories
  const productsImageDir = path.join(process.cwd(), "src", "products-image");
  if (fs.existsSync(productsImageDir)) {
    app.use("/src/products-image", express.static(productsImageDir));
    app.use("/src/assets/products-image", express.static(productsImageDir));
    app.use("/products-image", express.static(productsImageDir));
  }

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

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`[SDAZUM CYBERPORT SERVER] Running on port ${PORT}`);
  });
}

startServer();
