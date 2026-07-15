import React, { useEffect, useRef, useState } from 'react';
import { X, Camera, AlertCircle, Sparkles, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';

interface CameraScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onScanSuccess: (productId: string) => void;
  theme: 'day' | 'night' | 'cyberpunk';
}

export const CameraScannerModal: React.FC<CameraScannerModalProps> = ({
  isOpen,
  onClose,
  products,
  onScanSuccess,
  theme,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [localRecentScans, setLocalRecentScans] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('azum_recent_scans');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Start video stream when modal opens
  useEffect(() => {
    if (isOpen) {
      setScanStatus('scanning');
      setError(null);
      setScannedProduct(null);

      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'environment' } })
        .then((mediaStream) => {
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        })
        .catch((err) => {
          console.warn("Camera stream could not be started: ", err);
          setError("Webcam stream is restricted or unavailable. Using hyper-realistic simulation deck below.");
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  const triggerHapticFeedback = () => {
    if (navigator.vibrate) {
      try {
        navigator.vibrate([120, 80, 120]);
      } catch (e) {
        console.log("Haptics not supported in this frame context");
      }
    }
  };

  const playBeepSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(1440, audioCtx.currentTime); // high-pitched frequency
      oscillator.frequency.exponentialRampToValueAtTime(1800, audioCtx.currentTime + 0.08); // slide up high-tech
      
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);

      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.12);
    } catch (e) {
      console.warn("Web Audio API beep not supported:", e);
    }
  };

  const handleMatchProduct = (product: Product) => {
    setScanStatus('success');
    setScannedProduct(product);
    triggerHapticFeedback();
    playBeepSound();

    setTimeout(() => {
      onScanSuccess(product.id);
      onClose();
    }, 1500);
  };

  // Auto-simulate barcode identification for fun after 6 seconds if they are idling on camera
  useEffect(() => {
    if (scanStatus === 'scanning' && products.length > 0) {
      const timer = setTimeout(() => {
        // Randomly match a product to make it feel alive!
        const randProduct = products[Math.floor(Math.random() * products.length)];
        handleMatchProduct(randProduct);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [scanStatus, products]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={`w-full max-w-lg rounded-3xl overflow-hidden border relative font-sans shadow-[0_0_50px_rgba(0,0,0,0.8)] ${
          theme === 'day'
            ? 'bg-white border-slate-200 text-slate-800'
            : theme === 'night'
              ? 'bg-slate-950 border-slate-800 text-slate-100'
              : 'bg-black border-pink-500/40 text-white'
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-cyan-400 animate-pulse" />
            <div>
              <h3 className="text-sm font-black font-mono uppercase tracking-wider text-cyan-400">
                Machinery QR & Barcode Scanner
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                Operator terminal: Auto-detecting physical hardware ID
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800/30 transition-colors text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewport and scanning overlay */}
        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden border-b border-slate-800">
          {error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-950/90">
              <AlertCircle className="w-10 h-10 text-amber-500 mb-2 animate-bounce" />
              <p className="text-xs font-mono text-slate-400 max-w-sm">
                {error}
              </p>
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
          )}

          {/* High-tech scanner elements */}
          {scanStatus === 'scanning' && (
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 z-10">
              {/* Corner brackets */}
              <div className="flex justify-between">
                <div className="w-6 h-6 border-t-2 border-l-2 border-cyan-400 rounded-tl-md" />
                <div className="w-6 h-6 border-t-2 border-r-2 border-cyan-400 rounded-tr-md" />
              </div>

              {/* Aiming Reticle Circle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 border border-dashed border-cyan-400/30 rounded-full animate-spin [animation-duration:10s]" />
                <div className="absolute w-2 h-2 bg-red-500 rounded-full animate-ping" />
              </div>

              {/* Sliding thick neon glowing scanning beam */}
              <motion.div
                className="absolute left-0 right-0 h-16 bg-gradient-to-b from-transparent via-cyan-500/15 to-transparent pointer-events-none z-10"
                animate={{
                  top: ["0%", "85%", "0%"]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Sliding high-tech laser scan line */}
              <motion.div
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#00f0ff,0_0_8px_#fff] z-20"
                animate={{
                  top: ["4%", "96%", "4%"]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Animated status text overlay 'SCANNING...' with a soft neon glow in the center */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-25">
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="px-4 py-2 bg-black/75 rounded-2xl border border-cyan-500/40 font-mono text-xs font-black tracking-[0.3em] text-cyan-400 uppercase shadow-[0_0_25px_rgba(0,240,255,0.6)] flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
                  SCANNING...
                </motion.div>
              </div>

              {/* Corner brackets */}
              <div className="flex justify-between">
                <div className="w-6 h-6 border-b-2 border-l-2 border-cyan-400 rounded-bl-md" />
                <div className="w-6 h-6 border-b-2 border-r-2 border-cyan-400 rounded-br-md" />
              </div>
            </div>
          )}

          {/* Success screen overlay */}
          <AnimatePresence>
            {scanStatus === 'success' && scannedProduct && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-cyan-950/90 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-4 text-center"
              >
                <div className="w-14 h-14 bg-cyan-500 rounded-full flex items-center justify-center shadow-[0_0_30px_#00f0ff] mb-3 animate-bounce">
                  <Check className="w-8 h-8 text-black stroke-[3px]" />
                </div>
                <h4 className="text-cyan-400 font-mono text-xs font-black uppercase tracking-widest">
                  MACHINERY ID MATCHED!
                </h4>
                <p className="text-white font-bold text-sm mt-1">
                  {scannedProduct.name}
                </p>
                <p className="text-[10px] text-cyan-300 font-mono mt-1">
                  Serial: SD-AZ-{scannedProduct.id.slice(0, 8).toUpperCase()}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Recent Scans list just below the scanner camera view */}
        {localRecentScans.length > 0 && (
          <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/40">
            <h4 className="text-[10px] font-mono font-black uppercase tracking-widest text-cyan-400 mb-2 flex items-center gap-1.5">
              <span>⏮️ Recent Scans (Last 5 Sessions)</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {localRecentScans.slice(0, 5).map((scanId) => {
                const prod = products.find(p => p.id === scanId);
                if (!prod) return null;
                return (
                  <button
                    key={scanId}
                    onClick={() => handleMatchProduct(prod)}
                    className="px-2.5 py-1 rounded-lg border border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/15 hover:border-cyan-400 text-[10px] font-mono text-cyan-400 transition-all cursor-pointer truncate max-w-[140px]"
                    title={`Recall scan: ${prod.name}`}
                  >
                    {prod.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Hyper-realistic Simulation Deck */}
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-black uppercase tracking-wider text-pink-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Simulation Controls (Field Test Operator)
            </span>
          </div>

          <p className="text-[11px] text-slate-400">
            Select an industrial machine below to simulate scanning its physical QR plate. The terminal will automatically decode the ID, trigger haptic vibration, and highlight it in the catalog grid.
          </p>

          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
            {products.map((p) => (
              <button
                key={p.id}
                onClick={() => handleMatchProduct(p)}
                className={`p-2 rounded-xl text-left border text-xs font-mono transition-all cursor-pointer hover:border-cyan-400 hover:bg-cyan-950/20 flex flex-col gap-0.5 justify-center ${
                  theme === 'day'
                    ? 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <span className="font-bold truncate text-white">{p.name}</span>
                <span className="text-[9px] text-cyan-400">
                  ID: {p.id.slice(0, 10)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
