import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { X, Layers, Star, Info, ShieldCheck, Check } from 'lucide-react';
import { Product } from '../types';
import { ProductSVG } from './ProductSVG';
import { getProductImageUrl } from '../mockData';

interface ProductCompareModalProps {
  products: Product[];
  theme: string;
  onClose: () => void;
  onRemove: (id: string) => void;
}

export const ProductCompareModal: React.FC<ProductCompareModalProps> = ({
  products,
  theme,
  onClose,
  onRemove,
}) => {
  // Identify the best price (lowest) to highlight
  const lowestPrice = useMemo(() => {
    if (products.length === 0) return 0;
    return Math.min(...products.map(p => p.price));
  }, [products]);

  // Identify the highest stock to highlight
  const highestStock = useMemo(() => {
    if (products.length === 0) return 0;
    return Math.max(...products.map(p => p.stock || 0));
  }, [products]);

  // Load custom specs for each product or fallback to generated defaults
  const productSpecs = useMemo(() => {
    return products.map(product => {
      const saved = localStorage.getItem(`sdazum_specs_${product.id}`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
      
      // Basic fallback specs if not found
      return {
        logistics: [
          { label: 'Harmonized System Code', value: '8483.40.00' },
          { label: 'Packaging Format', value: 'Standard Crate' },
          { label: 'Port of Loading', value: 'Qingdao Port, Shandong, P.R. China' },
          { label: 'Export Gross Weight', value: 'Estimated 150 kg' }
        ],
        materials: [
          { label: 'Core Metallurgy', value: 'High-Tensile Chrome-Molybdenum Steel' },
          { label: 'Tensile Strength', value: '750 - 920 MPa' },
          { label: 'Surface Hardness', value: 'HRC 58-62' }
        ],
        compliance: [
          { label: 'Quality Assurance Audits', value: 'CE Marking, ISO 9001:2015 Approved' },
          { label: 'Manufacturer Protection', value: '18-Month Shandong Azum Factory Warranty' }
        ]
      };
    });
  }, [products]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Dark blur overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-40"
      />

      {/* Enlarged center container */}
      <motion.div
        initial={{ scale: 0.95, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 30, opacity: 0 }}
        transition={{ type: 'spring', damping: 24, stiffness: 170 }}
        className={`relative w-full max-w-6xl rounded-3xl p-5 sm:p-8 border shadow-2xl z-50 overflow-y-auto max-h-[92vh] flex flex-col gap-6 ${
          theme === 'day'
            ? 'bg-white border-slate-200 text-slate-800'
            : theme === 'night'
              ? 'bg-slate-900 border-slate-800 text-slate-100'
              : 'bg-slate-950 border-pink-500/30 text-white shadow-[0_0_50px_rgba(236,72,153,0.15)]'
        }`}
      >
        {/* Top Header Row */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-850 pb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-500 dark:text-pink-500" />
            <div>
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight font-sans">
                Product Comparison Engine
              </h2>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                Analyzing key metallurgy, compliance, and commercial specifications
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className={`p-2 rounded-full border transition-all hover:scale-110 active:scale-95 cursor-pointer z-50 flex items-center justify-center ${
              theme === 'day'
                ? 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                : theme === 'night'
                  ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
                  : 'bg-pink-950/40 border-pink-500/30 text-pink-400 hover:bg-pink-500 hover:text-black'
            }`}
            title="Close Comparison"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Side-by-Side Comparison Grid */}
        <div className="flex-1 overflow-x-auto">
          <div className="min-w-[640px] grid" style={{ gridTemplateColumns: `160px repeat(${products.length}, minmax(180px, 1fr))` }}>
            
            {/* Headers row (Images & titles) */}
            <div className="border-b border-slate-200 dark:border-slate-850 p-4 font-mono text-xs font-black uppercase text-slate-400 flex items-end">
              Product Info
            </div>
            {products.map((p, idx) => (
              <div key={p.id} className="border-b border-slate-200 dark:border-slate-850 p-4 flex flex-col gap-3 relative">
                <button
                  onClick={() => onRemove(p.id)}
                  className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-500 hover:bg-rose-500 hover:text-white text-[8px] font-mono font-black uppercase cursor-pointer transition-all"
                  title="Remove from comparison"
                >
                  Remove
                </button>

                <div className="aspect-square w-24 h-24 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-950/30 p-2 flex items-center justify-center mx-auto">
                  {p.image && !['tshirt', 'shoe', 'hoodie', 'shirt', 'cap', 'mug', 'cup', 'sticker', 'tote', 'keychain', 'poster', 'backpack'].includes(p.image) ? (
                    <img src={getProductImageUrl(p.image)} alt={p.name} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <ProductSVG type={p.image} color={p.colors?.[0]?.value || '#94A3B8'} className="w-16 h-16" />
                  )}
                </div>

                <div className="text-center">
                  <span className="text-[8px] font-mono uppercase font-black text-pink-500 bg-pink-500/10 px-1.5 py-0.5 rounded-full">
                    {p.category}
                  </span>
                  <h4 className="text-xs font-black tracking-tight mt-1.5 line-clamp-2">
                    {p.name}
                  </h4>
                </div>
              </div>
            ))}

            {/* Price Row */}
            <div className="border-b border-slate-200 dark:border-slate-850 p-3 font-mono text-[10px] font-bold uppercase text-slate-400 flex items-center">
              Unit Price
            </div>
            {products.map(p => {
              const isBest = p.price === lowestPrice && products.length > 1;
              return (
                <div key={p.id} className="border-b border-slate-200 dark:border-slate-850 p-3 flex items-center justify-center">
                  <div className={`px-3 py-1 rounded-xl font-mono text-sm font-black border flex items-center gap-1 ${
                    isBest
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.25)]'
                      : theme === 'day' ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-900/60 border-slate-800 text-slate-100'
                  }`}>
                    <span>${p.price.toFixed(2)}</span>
                    {isBest && <span className="text-[8px] font-mono uppercase font-black bg-emerald-500 text-slate-950 px-1 rounded">Best Price</span>}
                  </div>
                </div>
              );
            })}

            {/* Stock Level Row */}
            <div className="border-b border-slate-200 dark:border-slate-850 p-3 font-mono text-[10px] font-bold uppercase text-slate-400 flex items-center">
              Stock Units
            </div>
            {products.map(p => {
              const currentStock = p.stock || 0;
              const isHigh = currentStock === highestStock && products.length > 1;
              return (
                <div key={p.id} className="border-b border-slate-200 dark:border-slate-850 p-3 flex items-center justify-center">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-black border flex items-center gap-1.5 ${
                    currentStock < 5
                      ? 'bg-rose-950/40 border-rose-500/30 text-rose-400'
                      : isHigh
                        ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                        : theme === 'day' ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${currentStock < 5 ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                    {currentStock} units
                  </span>
                </div>
              );
            })}

            {/* Rating Row */}
            <div className="border-b border-slate-200 dark:border-slate-850 p-3 font-mono text-[10px] font-bold uppercase text-slate-400 flex items-center">
              Trust Rating
            </div>
            {products.map(p => (
              <div key={p.id} className="border-b border-slate-200 dark:border-slate-850 p-3 flex items-center justify-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-mono font-black">({p.rating || '4.8'})</span>
              </div>
            ))}

            {/* Logistics Specs Row Header */}
            <div className="col-span-full bg-slate-100/50 dark:bg-slate-850/30 p-2 font-mono text-[10px] font-black uppercase text-indigo-400 tracking-wider">
              1. Logistics & Export
            </div>

            {/* Render logistics details row by row */}
            {['Harmonized System Code', 'Packaging Format', 'Port of Loading', 'Export Gross Weight', 'Minimum Order Qty (MOQ)'].map((label) => (
              <React.Fragment key={label}>
                <div className="border-b border-slate-200 dark:border-slate-850 p-2.5 text-[10px] font-semibold text-slate-400 uppercase font-mono flex items-center">
                  {label}
                </div>
                {products.map((p, idx) => {
                  const spec = productSpecs[idx].logistics.find((s: any) => s.label === label);
                  return (
                    <div key={p.id} className="border-b border-slate-200 dark:border-slate-850 p-2.5 text-xs text-center flex items-center justify-center">
                      <span className="font-bold line-clamp-2">{spec?.value || 'N/A'}</span>
                    </div>
                  );
                })}
              </React.Fragment>
            ))}

            {/* Materials Specs Row Header */}
            <div className="col-span-full bg-slate-100/50 dark:bg-slate-850/30 p-2 font-mono text-[10px] font-black uppercase text-indigo-400 tracking-wider">
              2. Metallurgy & Materials
            </div>

            {/* Render materials details row by row */}
            {['Core Metallurgy', 'Tensile Strength', 'Surface Hardness', 'Surface Protective Finish'].map((label) => (
              <React.Fragment key={label}>
                <div className="border-b border-slate-200 dark:border-slate-850 p-2.5 text-[10px] font-semibold text-slate-400 uppercase font-mono flex items-center">
                  {label}
                </div>
                {products.map((p, idx) => {
                  const spec = productSpecs[idx].materials.find((s: any) => s.label === label);
                  return (
                    <div key={p.id} className="border-b border-slate-200 dark:border-slate-850 p-2.5 text-xs text-center flex items-center justify-center">
                      <span className="font-bold line-clamp-2">{spec?.value || 'N/A'}</span>
                    </div>
                  );
                })}
              </React.Fragment>
            ))}

            {/* Compliance Row Header */}
            <div className="col-span-full bg-slate-100/50 dark:bg-slate-850/30 p-2 font-mono text-[10px] font-black uppercase text-indigo-400 tracking-wider">
              3. Compliance & Verification
            </div>

            {/* Render compliance details row by row */}
            {['Quality Assurance Audits', 'Safety Design Directives', 'Environmental Standard', 'Manufacturer Protection'].map((label) => (
              <React.Fragment key={label}>
                <div className="border-b border-slate-200 dark:border-slate-850 p-2.5 text-[10px] font-semibold text-slate-400 uppercase font-mono flex items-center">
                  {label}
                </div>
                {products.map((p, idx) => {
                  const spec = productSpecs[idx].compliance.find((s: any) => s.label === label);
                  return (
                    <div key={p.id} className="border-b border-slate-200 dark:border-slate-850 p-2.5 text-xs text-center flex items-center justify-center">
                      <span className="font-bold line-clamp-2">{spec?.value || 'N/A'}</span>
                    </div>
                  );
                })}
              </React.Fragment>
            ))}

          </div>
        </div>

        {/* Footer info stamp */}
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase border-t border-slate-200 dark:border-slate-850 pt-4">
          <span className="flex items-center gap-1 text-indigo-500 font-bold">
            <ShieldCheck className="w-4 h-4" /> Shandong Azum official inspection registry
          </span>
          <span>Autolink Trade Assurance Protect</span>
        </div>
      </motion.div>
    </div>
  );
};
