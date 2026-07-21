import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Star, Heart, ShoppingCart, Truck, Wrench, ShieldCheck, 
  Plus, Minus, Info, Globe, Award, Scale, Anchor, Package, FileText,
  LineChart
} from 'lucide-react';
import { Product } from '../types';
import { ProductSVG } from './ProductSVG';
import { PriceSparkline } from './PriceSparkline';

interface ExpandedProductModalProps {
  product: Product;
  theme: string;
  language: string;
  wishlist: string[];
  toggleWishlist: (id: string, e: React.MouseEvent) => void;
  handleAddToCart: (product: Product, qty: number, size: string, color: { name: string; value: string }, customName?: string) => void;
  onClose: () => void;
}

interface SpecItem {
  label: string;
  value: string;
}

interface SerializableSpecs {
  logistics: SpecItem[];
  materials: SpecItem[];
  compliance: SpecItem[];
}

export const ExpandedProductModal: React.FC<ExpandedProductModalProps> = ({
  product,
  theme,
  language,
  wishlist,
  toggleWishlist,
  handleAddToCart,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'logistics' | 'materials' | 'compliance' | 'market'>('logistics');
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || 'Standard');
  const [selectedColor, setSelectedColor] = useState<{ name: string; value: string }>(
    product.colors?.[0] || { name: 'Industrial Gray', value: '#64748B' }
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [customEngraving, setCustomEngraving] = useState<string>('');
  const [isEditingSpecs, setIsEditingSpecs] = useState<boolean>(false);
  const [showSavedBadge, setShowSavedBadge] = useState<boolean>(false);

  const isWishlisted = wishlist.includes(product.id);

  // Load and cache specs
  const [editableSpecs, setEditableSpecs] = useState<SerializableSpecs>(() => {
    const saved = localStorage.getItem(`sdazum_specs_${product.id}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.logistics && parsed.materials && parsed.compliance) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to load specifications from localStorage", e);
      }
    }

    // Fallback to high-fidelity initial specifications
    const isHeavyMachine = product.category.toLowerCase().includes('press') || product.name.toLowerCase().includes('press');
    const isShaft = product.name.toLowerCase().includes('shaft') || product.name.toLowerCase().includes('collar');
    const isGear = product.name.toLowerCase().includes('gear');
    const isBearing = product.name.toLowerCase().includes('bearing');

    let hsCode = '8483.40.00';
    if (isHeavyMachine) hsCode = '8462.91.00';
    else if (isBearing) hsCode = '8482.10.00';
    else if (isShaft) hsCode = '8483.10.00';

    let packaging = 'Standard Crate';
    if (isHeavyMachine) {
      packaging = 'Reinforced Heavy steel frames & anti-vibration rubber isolation pads';
    } else if (isGear || isShaft) {
      packaging = 'Fumigated solid wooden case with internal high-density anti-scratch foam molds';
    } else {
      packaging = 'Vacuum-sealed moisture-barrier foil bags inside impact-absorbing crates';
    }

    const estWeightVal = product.price * 0.18 + 12;
    const estWeight = estWeightVal > 1000 
      ? `${(estWeightVal / 1000).toFixed(2)} Metric Tons` 
      : `${estWeightVal.toFixed(1)} kg`;

    let metallurgy = 'High-Tensile Chrome-Molybdenum Steel Alloy (Grade Q345B)';
    let tensile = '750 - 920 MPa (Heavy Industrial Grade)';
    let hardness = 'HRC 58-62 (Induction & Carburizing Hardened)';
    let surfaceFinish = 'Chemical-blackened oxide coating with micro-oil moisture barrier';

    if (isHeavyMachine) {
      metallurgy = 'Structural Cast Carbon Steel (ASTM A216 WCB) with heavy-gauge plate armor';
      tensile = '520 - 680 MPa';
      hardness = 'HB 210 Brinell';
      surfaceFinish = 'Multiple-layered polyurethane machine enamel & rust-preventative primer coating';
    } else if (isBearing) {
      metallurgy = 'Premium High-Carbon Chromium Bearing Steel (AISI 52100 / GCr15)';
      tensile = '1600 - 1800 MPa';
      hardness = 'HRC 60-64 (Fully Through-Hardened)';
      surfaceFinish = 'Precision-ground super-finished raceways with synthetic grease pre-seal';
    }

    const defaultSpecs = {
      logistics: [
        { label: 'Harmonized System Code', value: hsCode },
        { label: 'Packaging Format', value: packaging },
        { label: 'Port of Loading', value: 'Qingdao Port, Shandong Province, P.R. China' },
        { label: 'Export Gross Weight', value: estWeight },
        { label: 'Minimum Order Qty (MOQ)', value: '1 Standard Unit' },
        { label: 'Estimated Dispatch Lead Time', value: product.stock && product.stock > 10 ? 'Immediate (24-48 hours)' : '3-5 Business Days' }
      ],
      materials: [
        { label: 'Core Metallurgy', value: metallurgy },
        { label: 'Tensile Strength', value: tensile },
        { label: 'Surface Hardness', value: hardness },
        { label: 'Surface Protective Finish', value: surfaceFinish },
        { label: 'Max Thermal Tolerance', value: isHeavyMachine ? '-20°C to +120°C' : '-45°C to +380°C' }
      ],
      compliance: [
        { label: 'Quality Assurance Audits', value: 'CE Marking, ISO 9001:2015, SGS Field Inspection Verified' },
        { label: 'Safety Design Directives', value: 'Machinery Directive 2006/42/EC, EN ISO 12100 Standards' },
        { label: 'Environmental Standard', value: 'RoHS Directive 2011/65/EU and REACH (EC 1907/2006) compliant' },
        { label: 'Origin Certifications', value: 'Officially certified Origin Shandong, China Enterprise Registry #37010499217' },
        { label: 'Manufacturer Protection', value: '18-Month Shandong Azum Factory Warranty with active part support' }
      ]
    };

    localStorage.setItem(`sdazum_specs_${product.id}`, JSON.stringify(defaultSpecs));
    return defaultSpecs;
  });

  // Auto-clear notification badge
  useEffect(() => {
    if (showSavedBadge) {
      const timer = setTimeout(() => setShowSavedBadge(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showSavedBadge]);

  // Handle edit specification value instantly
  const handleSpecChange = (tab: 'logistics' | 'materials' | 'compliance', index: number, newValue: string) => {
    setEditableSpecs(prev => {
      const updatedTab = [...prev[tab]];
      updatedTab[index] = { ...updatedTab[index], value: newValue };
      const nextSpecs = { ...prev, [tab]: updatedTab };
      localStorage.setItem(`sdazum_specs_${product.id}`, JSON.stringify(nextSpecs));
      setShowSavedBadge(true);
      return nextSpecs;
    });
  };

  // Helper for dynamic icons
  const getIconForLabel = (label: string): React.ReactNode => {
    const l = label.toLowerCase();
    if (l.includes('code') || l.includes('hs')) return <Package className="w-3.5 h-3.5 text-pink-500" />;
    if (l.includes('packaging')) return <Truck className="w-3.5 h-3.5 text-emerald-500" />;
    if (l.includes('port')) return <Anchor className="w-3.5 h-3.5 text-blue-500" />;
    if (l.includes('weight')) return <Info className="w-3.5 h-3.5 text-amber-500" />;
    if (l.includes('moq') || l.includes('minimum')) return <Globe className="w-3.5 h-3.5 text-indigo-500" />;
    if (l.includes('lead') || l.includes('dispatch')) return <Award className="w-3.5 h-3.5 text-rose-500" />;
    if (l.includes('metallurgy') || l.includes('metal')) return <Wrench className="w-3.5 h-3.5 text-indigo-500" />;
    if (l.includes('tensile') || l.includes('strength')) return <Award className="w-3.5 h-3.5 text-rose-500" />;
    if (l.includes('hardness')) return <Scale className="w-3.5 h-3.5 text-amber-500" />;
    if (l.includes('finish') || l.includes('protective')) return <Info className="w-3.5 h-3.5 text-teal-500" />;
    if (l.includes('thermal') || l.includes('temperature') || l.includes('tolerance')) return <Globe className="w-3.5 h-3.5 text-pink-500" />;
    if (l.includes('audit') || l.includes('quality') || l.includes('iso')) return <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />;
    if (l.includes('safety') || l.includes('directive')) return <Scale className="w-3.5 h-3.5 text-amber-500" />;
    if (l.includes('environmental')) return <Globe className="w-3.5 h-3.5 text-teal-500" />;
    if (l.includes('origin')) return <Info className="w-3.5 h-3.5 text-indigo-500" />;
    if (l.includes('warranty') || l.includes('protection')) return <Award className="w-3.5 h-3.5 text-rose-500" />;
    return <Info className="w-3.5 h-3.5 text-slate-400" />;
  };

  // Printable layout window trigger to save as high-fidelity PDF
  const handleDownloadPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please enable pop-ups to open and print/save the PDF Technical Spec Sheet.");
      return;
    }

    const specRows = (tabName: 'logistics' | 'materials' | 'compliance') => {
      return editableSpecs[tabName].map(spec => `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px; font-weight: bold; color: #475569; width: 40%; font-size: 11px; text-transform: uppercase; font-family: monospace;">${spec.label}</td>
          <td style="padding: 10px; color: #0f172a; font-size: 11px;">${spec.value}</td>
        </tr>
      `).join('');
    };

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Technical Datasheet - ${product.name}</title>
        <style>
          body {
            font-family: 'Inter', -apple-system, sans-serif;
            color: #1e293b;
            margin: 0;
            padding: 40px;
            background-color: #fff;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 3px solid #6366f1;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .company-title {
            font-size: 20px;
            font-weight: 900;
            color: #312e81;
            letter-spacing: 1px;
            margin: 0;
          }
          .company-subtitle {
            font-size: 10px;
            color: #64748b;
            letter-spacing: 2px;
            margin: 2px 0 0 0;
            text-transform: uppercase;
          }
          .doc-title {
            font-size: 24px;
            font-weight: 900;
            text-align: right;
            color: #0f172a;
            margin: 0;
            text-transform: uppercase;
          }
          .meta-grid {
            display: grid;
            grid-template-cols: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
          }
          .meta-card {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 15px;
          }
          .section-title {
            font-size: 12px;
            font-weight: 900;
            color: #4f46e5;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 5px;
            margin-top: 30px;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th {
            background-color: #f1f5f9;
            text-align: left;
            padding: 8px 10px;
            font-size: 10px;
            text-transform: uppercase;
            color: #475569;
          }
          .footer {
            margin-top: 50px;
            border-top: 1px solid #e2e8f0;
            padding-top: 15px;
            display: flex;
            justify-content: space-between;
            font-size: 9px;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 20px; text-align: center; background-color: #f1f5f9; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;">
          <button onclick="window.print();" style="background-color: #4f46e5; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer;">Print / Save as PDF</button>
          <span style="margin-left: 10px; font-size: 12px; color: #64748b;">Select "Save as PDF" as the Destination in your print dialog.</span>
        </div>
        <div class="header">
          <div>
            <h1 class="company-title">SHANDONG AZUM CO., LTD</h1>
            <p class="company-subtitle">Official Trading & High-Fidelity Enterprise Manufacturing</p>
          </div>
          <div>
            <h2 class="doc-title">Technical Datasheet</h2>
            <p style="font-size: 10px; color: #64748b; text-align: right; margin: 5px 0 0 0;">REF NO: SDAZUM-${product.id.toUpperCase()}-2026</p>
          </div>
        </div>

        <div class="meta-grid">
          <div class="meta-card">
            <h3 style="margin-top: 0; font-size: 13px; font-weight: 800; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">Product Specs</h3>
            <p style="font-size: 11px; margin: 6px 0;"><strong style="color: #475569;">Name:</strong> ${product.name}</p>
            <p style="font-size: 11px; margin: 6px 0;"><strong style="color: #475569;">Category:</strong> ${product.category}</p>
            <p style="font-size: 11px; margin: 6px 0;"><strong style="color: #475569;">List Price:</strong> USD $${product.price.toFixed(2)}</p>
            <p style="font-size: 11px; margin: 6px 0;"><strong style="color: #475569;">Stock Status:</strong> ${product.stock || 0} Units Available</p>
          </div>
          <div class="meta-card">
            <h3 style="margin-top: 0; font-size: 13px; font-weight: 800; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">Enterprise Licensing</h3>
            <p style="font-size: 11px; margin: 6px 0; line-height: 1.4; color: #475569;">
              This specification sheet validates the structural metallurgy and import-export ratings. Audited under ISO 9001:2015 standards, and officially registered under Shandong Manufacturer Enterprise #37010499217.
            </p>
          </div>
        </div>

        <p style="font-size: 11px; line-height: 1.5; color: #334155; margin-bottom: 25px;">
          <strong>Description:</strong> ${product.description}
        </p>

        <h3 class="section-title">1. Logistics & Supply Chain Metrics</h3>
        <table>
          <thead>
            <tr>
              <th style="width: 40%">Parameter Metric</th>
              <th>Certified Value</th>
            </tr>
          </thead>
          <tbody>
            ${specRows('logistics')}
          </tbody>
        </table>

        <h3 class="section-title">2. Material Metallurgy & Mechanical properties</h3>
        <table>
          <thead>
            <tr>
              <th style="width: 40%">Metric</th>
              <th>Specification Detail</th>
            </tr>
          </thead>
          <tbody>
            ${specRows('materials')}
          </tbody>
        </table>

        <h3 class="section-title">3. Compliance Declarations</h3>
        <table>
          <thead>
            <tr>
              <th style="width: 40%">Compliance Standard</th>
              <th>Verification Detail</th>
            </tr>
          </thead>
          <tbody>
            ${specRows('compliance')}
          </tbody>
        </table>

        <div class="footer">
          <span>&copy; 2026 Shandong Azum Co., Ltd. All Rights Reserved.</span>
          <span style="color: #4f46e5; font-weight: bold;">Autolink Quality Certified Seal</span>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div id={`expanded-portal-${product.id}`} className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Semi-transparent dark blur backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-40"
      />

      {/* Enlarged floating center screen container with premium layouts */}
      <motion.div 
        layoutId={`card-container-${product.id}`}
        initial={{ scale: 0.95, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 30, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 180 }}
        className={`relative max-w-4xl w-full rounded-3xl p-5 sm:p-8 border shadow-2xl z-50 overflow-y-auto max-h-[92vh] flex flex-col md:flex-row gap-6 sm:gap-8 ${
          theme === 'day'
            ? 'bg-white border-slate-200 text-slate-800 shadow-slate-200/50'
            : theme === 'night'
              ? 'bg-slate-900 border-slate-800 text-slate-100 shadow-black/80'
              : 'bg-slate-950 border-pink-500/35 text-white shadow-[0_0_50px_rgba(236,72,153,0.18)]'
        }`}
      >
        {/* Floating exit control top-right */}
        <button 
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full border transition-all hover:scale-110 active:scale-95 cursor-pointer z-50 flex items-center justify-center ${
            theme === 'day'
              ? 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              : theme === 'night'
                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
                : 'bg-pink-950/40 border-pink-500/30 text-pink-400 hover:bg-pink-500 hover:text-black shadow-[0_0_10px_rgba(236,72,153,0.2)]'
          }`}
          title="Close Specifications Interface"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Column: Media & Core Selection */}
        <div className="w-full md:w-5/12 flex flex-col gap-4">
          <div className={`relative aspect-square w-full rounded-2xl overflow-hidden border p-4 flex items-center justify-center ${
            theme === 'day' 
              ? 'bg-slate-50 border-slate-200' 
              : theme === 'night' 
                ? 'bg-slate-800/40 border-slate-700/60' 
                : 'bg-slate-900/40 border-pink-500/20 shadow-inner'
          }`}>
            <div className="w-full h-full max-h-72 flex items-center justify-center">
              {product.image && !['tshirt', 'shoe', 'hoodie', 'shirt', 'cap', 'mug', 'cup', 'sticker', 'tote', 'keychain', 'poster', 'backpack'].includes(product.image) ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <ProductSVG type={product.image} color={selectedColor.value || '#94A3B8'} className="w-40 h-40" />
              )}
            </div>

            {/* Live Stock Level Badge Overlay */}
            <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-mono font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md border ${
              (product.stock || 0) < 5 
                ? 'bg-rose-950/85 text-rose-400 border-rose-500/40 animate-pulse' 
                : 'bg-emerald-950/85 text-emerald-400 border-emerald-500/40'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                (product.stock || 0) < 5 ? 'bg-rose-500' : 'bg-emerald-500'
              }`} />
              Stock: {product.stock || 0} Units
            </div>
          </div>

          {/* Interactive Rating & Trust indicators */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating || 4) ? 'fill-amber-400' : ''}`} />
                ))}
              </div>
              <span className="text-xs font-black font-mono">({product.rating || '4.8'})</span>
            </div>
            
            <button
              onClick={(e) => toggleWishlist(product.id, e)}
              className={`text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                isWishlisted ? 'text-rose-500' : 'text-slate-400 hover:text-rose-400'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
              {isWishlisted ? 'Saved' : 'Add to Wishlist'}
            </button>
          </div>

          {/* Sizing Controls */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">Select Technical Caliber / Size:</span>
              <div className="flex flex-wrap gap-1.5">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                      selectedSize === size
                        ? theme === 'cyberpunk'
                          ? 'bg-pink-500 border-pink-500 text-white shadow-[0_0_8px_#ec4899]'
                          : 'bg-indigo-600 border-indigo-600 text-white dark:bg-slate-100 dark:border-slate-100 dark:text-slate-950 font-black'
                        : theme === 'day'
                          ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color/Finishing selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">Select Heavy Metallurgy / Finish:</span>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(color => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono font-bold transition-all cursor-pointer ${
                      selectedColor.name === color.name
                        ? 'border-indigo-500 ring-2 ring-indigo-500/20 dark:border-pink-500 dark:ring-pink-500/20 bg-slate-100/10'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full border border-black/10" style={{ backgroundColor: color.value }} />
                    {color.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Engraving / Serial Number Input */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">Add Custom Engraving / Serial Mark:</span>
            <input
              type="text"
              placeholder="e.g., SDAZUM-A782-2026"
              value={customEngraving}
              onChange={(e) => setCustomEngraving(e.target.value)}
              className={`w-full px-3 py-1.5 text-xs rounded-xl outline-none border transition-all ${
                theme === 'day'
                  ? 'bg-slate-50 border-slate-200 focus:border-slate-800 text-slate-800'
                  : 'bg-slate-900 border-slate-850 focus:border-pink-500 text-slate-100'
              }`}
            />
          </div>

          {/* Action Order / Add to Cart layout row */}
          <div className="flex items-center gap-3 pt-2">
            <div className={`flex items-center border rounded-xl ${
              theme === 'day' ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <button 
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="p-2.5 hover:text-pink-500 transition-colors cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-xs font-black font-mono">{quantity}</span>
              <button 
                onClick={() => setQuantity(prev => prev + 1)}
                className="p-2.5 hover:text-pink-500 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => {
                handleAddToCart(product, quantity, selectedSize, selectedColor, customEngraving);
                onClose();
              }}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-103 active:scale-97 transition-all cursor-pointer ${
                theme === 'cyberpunk'
                  ? 'bg-pink-500 hover:bg-pink-600 text-white shadow-[0_0_15px_rgba(236,72,153,0.4)]'
                  : theme === 'day'
                    ? 'bg-slate-900 hover:bg-slate-800 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add - ${(product.price * quantity).toFixed(2)}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Title, Description and Technical Specification Tabs */}
        <div className="w-full md:w-7/12 flex flex-col gap-5 justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-start gap-2">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-pink-500 font-mono">{product.category}</span>
                <h2 className={`text-xl sm:text-2xl font-black tracking-tight mt-1 ${
                  theme === 'day' ? 'text-slate-900' : 'text-white'
                }`}>
                  {product[`name_${language}` as keyof typeof product] || product.name}
                </h2>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-mono text-slate-400 font-bold uppercase">UNIT PRICE</p>
                <p className={`text-xl sm:text-2xl font-black font-mono ${
                  theme === 'cyberpunk' ? 'text-[#00f0ff]' : 'text-emerald-500'
                }`}>
                  ${product.price.toFixed(2)}
                </p>
              </div>
            </div>

            <p className={`text-xs leading-relaxed ${
              theme === 'day' ? 'text-slate-600' : 'text-slate-300'
            }`}>
              {product[`desc_${language}` as keyof typeof product] || product.description}
            </p>
          </div>

          {/* Technical Specifications Tabs block */}
          <div className="space-y-3 flex-1 flex flex-col justify-end pt-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800/80 pb-2">
              <div className="flex flex-wrap items-center gap-1">
                {[
                  { id: 'logistics', label: 'Logistics', icon: <Truck className="w-3.5 h-3.5" /> },
                  { id: 'materials', label: 'Materials', icon: <Wrench className="w-3.5 h-3.5" /> },
                  { id: 'compliance', label: 'Compliance', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
                  { id: 'market', label: 'Market Intel', icon: <LineChart className="w-3.5 h-3.5" /> }
                ].map(tab => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                       key={tab.id}
                       onClick={() => setActiveTab(tab.id as any)}
                       className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider font-mono transition-all cursor-pointer border ${
                        isActive
                          ? theme === 'cyberpunk'
                            ? 'bg-pink-500 border-pink-500 text-white shadow-[0_0_10px_rgba(236,72,153,0.3)]'
                            : 'bg-indigo-600 border-indigo-600 text-white dark:bg-slate-100 dark:border-slate-100 dark:text-slate-950'
                          : theme === 'day'
                            ? 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                            : 'bg-slate-900/60 border-slate-850 text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Editing & Auto-save Status Controls */}
              {activeTab !== 'market' && (
                <div className="flex items-center gap-2">
                  <AnimatePresence>
                    {showSavedBadge && (
                      <motion.span
                        initial={{ opacity: 0, x: 5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-[9px] text-emerald-400 font-mono font-black uppercase tracking-wider flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        Auto-Saved
                      </motion.span>
                    )}
                  </AnimatePresence>

                  <button
                    onClick={() => setIsEditingSpecs(!isEditingSpecs)}
                    className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest font-mono border transition-all cursor-pointer ${
                      isEditingSpecs
                        ? 'bg-rose-600 border-rose-500 text-white hover:bg-rose-700 shadow-md'
                        : theme === 'day'
                          ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                          : 'bg-slate-800/80 border-slate-750 text-slate-300 hover:bg-slate-750 hover:text-white'
                    }`}
                  >
                    {isEditingSpecs ? '✓ Finish' : '✎ Edit Spec'}
                  </button>
                </div>
              )}
            </div>

            {/* Spec items grid with animated entrance */}
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`${
                activeTab === 'market'
                  ? 'flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border min-h-[220px]'
                  : 'grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 rounded-2xl border'
              } ${
                theme === 'day' 
                  ? 'bg-slate-50 border-slate-200' 
                  : theme === 'night' 
                    ? 'bg-slate-850/40 border-slate-850' 
                    : 'bg-slate-950/50 border-pink-500/10'
              }`}
            >
              {activeTab === 'market' ? (
                <div className="flex flex-col sm:flex-row gap-4 w-full h-full min-h-[200px]">
                  {/* Left Column: Sparkline container */}
                  <div className="flex-1 min-h-[140px] relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950">
                    <PriceSparkline
                      basePrice={product.price}
                      productId={product.id}
                      theme={theme}
                    />
                  </div>

                  {/* Right Column: AI Analysis Thinking process */}
                  <div className="flex-1 flex flex-col justify-between bg-slate-100/50 dark:bg-black/30 p-3 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-[10px]">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-1.5">
                        <span className="text-[10px] font-black text-indigo-500 dark:text-indigo-450 uppercase tracking-widest flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          Azum Cognitive Brain™
                        </span>
                        <span className="text-[8px] text-slate-500">v1.2-beta</span>
                      </div>

                      {/* Thinking steps simulation */}
                      <div className="space-y-1 text-slate-500 dark:text-slate-400 text-[9px] leading-tight max-h-[75px] overflow-y-auto">
                        <div className="flex gap-1.5 items-start">
                          <span className="text-emerald-500">▶</span>
                          <span>[LOAD] Initialized pricing model for <b>{product.name}</b> (Base: ${product.price})</span>
                        </div>
                        <div className="flex gap-1.5 items-start">
                          <span className="text-emerald-500">▶</span>
                          <span>[CALC] Compiled 6M historical price variations from logistics registry.</span>
                        </div>
                        <div className="flex gap-1.5 items-start">
                          <span className="text-indigo-500 dark:text-indigo-400">⚡</span>
                          <span>[PREDICT] Projected demand factor: <b>+{(Math.abs(product.salesCount * 0.12 - 5) + 2).toFixed(1)}%</b> for next fiscal quarter.</span>
                        </div>
                        <div className="flex gap-1.5 items-start">
                          <span className="text-indigo-500 dark:text-indigo-400">⚡</span>
                          <span>[MARGIN] Net profit index: <b>{(22.5 + (product.price % 15)).toFixed(1)}%</b> under standard freight agreements.</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-slate-200 dark:border-slate-800/80 text-slate-700 dark:text-slate-350 font-sans text-xs leading-relaxed space-y-1">
                      <span className="font-mono text-[9px] font-bold text-pink-500 uppercase block tracking-wider">Strategic Advisory:</span>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                        The price for <b>{product.name}</b> remains resilient. Due to {product.category.toLowerCase().includes('parts') ? 'high machining tolerances' : 'robust factory throughput'} and stable logistics pipelines, Azum brain recommends maintaining a minimum stock safety threshold of <b>{Math.round(product.stock * 0.4 + 4)} units</b> to capitalize on incoming Middle East demand surges.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                editableSpecs[activeTab as 'logistics' | 'materials' | 'compliance'].map((spec, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400 font-mono">
                      {getIconForLabel(spec.label)}
                      <span>{spec.label}</span>
                    </div>

                    {isEditingSpecs ? (
                      <input
                        type="text"
                        value={spec.value}
                        onChange={(e) => handleSpecChange(activeTab as any, idx, e.target.value)}
                        className={`w-full px-2 py-1 text-xs rounded-lg border outline-none font-bold transition-all ${
                          theme === 'day'
                            ? 'bg-white border-slate-300 text-slate-850 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10'
                            : 'bg-slate-900 border-slate-750 text-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500/10'
                        }`}
                      />
                    ) : (
                      <p className={`text-xs font-bold leading-tight ${
                        theme === 'day' ? 'text-slate-800' : 'text-slate-200'
                      }`}>
                        {spec.value}
                      </p>
                    )}
                  </div>
                ))
              )}
            </motion.div>
          </div>

          {/* Secure Trust Stamp & Print PDF Trigger */}
          <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 uppercase tracking-wider border-t border-slate-200 dark:border-slate-800/40 pt-3">
            <button
              onClick={handleDownloadPDF}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border font-bold hover:scale-102 active:scale-98 transition-all cursor-pointer ${
                theme === 'day'
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100'
                  : theme === 'night'
                    ? 'bg-slate-800 border-slate-700 text-indigo-400 hover:bg-slate-750'
                    : 'bg-pink-950/30 border-pink-500/20 text-pink-400 hover:bg-pink-500/10'
              }`}
              title="Download Data Sheet as PDF"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Download PDF Specs</span>
            </button>

            <span className="flex items-center gap-1 text-emerald-500 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> Autolink Global Dispatch
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
