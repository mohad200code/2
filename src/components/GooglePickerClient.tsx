import React, { useState, useEffect } from 'react';
import { Folder, HardDrive, FileText, Link, ExternalLink, RefreshCw, Trash2, CheckCircle2 } from 'lucide-react';

interface GooglePickerClientProps {
  googleToken: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  theme: 'day' | 'night' | 'cyberpunk';
  triggerToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

interface PickedFile {
  id: string;
  name: string;
  url: string;
  mimeType: string;
  sizeBytes?: number;
  iconUrl?: string;
  timestamp: string;
}

export const GooglePickerClient: React.FC<GooglePickerClientProps> = ({
  googleToken,
  onConnect,
  onDisconnect,
  theme,
  triggerToast
}) => {
  const [pickedFiles, setPickedFiles] = useState<PickedFile[]>(() => {
    try {
      const saved = localStorage.getItem('azum_picked_files');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [isPickerLoading, setIsPickerLoading] = useState(false);

  // Sync picked files to local storage
  useEffect(() => {
    localStorage.setItem('azum_picked_files', JSON.stringify(pickedFiles));
  }, [pickedFiles]);

  // Load Google Picker script dynamically
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if script is already loaded
    if ((window as any).gapi && (window as any).google) {
      setIsApiLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      const gapi = (window as any).gapi;
      if (gapi) {
        gapi.load('picker', {
          callback: () => {
            setIsApiLoaded(true);
          },
          onerror: () => {
            triggerToast("Failed to load Google Picker API", "error");
          }
        });
      }
    };
    script.onerror = () => {
      triggerToast("Failed to load Google Client Library", "error");
    };
    document.body.appendChild(script);

    return () => {
      // Clean up if needed
    };
  }, [triggerToast]);

  const handleLaunchPicker = () => {
    if (!googleToken) {
      triggerToast("Please authenticate with Google first.", "error");
      return;
    }

    const gapi = (window as any).gapi;
    const google = (window as any).google;

    if (!gapi || !google || !google.picker) {
      setIsPickerLoading(true);
      // Try to reload/load picker API again
      if (gapi) {
        gapi.load('picker', {
          callback: () => {
            setIsPickerLoading(false);
            createAndShowPicker();
          },
          onerror: () => {
            setIsPickerLoading(false);
            triggerToast("Failed to load Google Picker API on demand", "error");
          }
        });
      } else {
        setIsPickerLoading(false);
        triggerToast("Google Picker is still loading, please wait...", "info");
      }
      return;
    }

    createAndShowPicker();
  };

  const createAndShowPicker = () => {
    try {
      const google = (window as any).google;
      const pickerOrigin =
        window.location.ancestorOrigins && window.location.ancestorOrigins.length > 0
          ? window.location.ancestorOrigins[window.location.ancestorOrigins.length - 1]
          : window.location.origin;

      const view = new google.picker.View(google.picker.ViewId.DOCS);
      
      const picker = new google.picker.PickerBuilder()
        .addView(view)
        .setOAuthToken(googleToken)
        .setOrigin(pickerOrigin)
        .setCallback((data: any) => {
          if (data.action === google.picker.Action.PICKED) {
            const docs = data.docs;
            if (docs && docs.length > 0) {
              const newFiles: PickedFile[] = docs.map((doc: any) => ({
                id: doc.id,
                name: doc.name || 'Unnamed File',
                url: doc.url || `https://drive.google.com/file/d/${doc.id}/view`,
                mimeType: doc.mimeType || 'unknown',
                sizeBytes: doc.sizeBytes,
                iconUrl: doc.iconUrl,
                timestamp: new Date().toISOString()
              }));

              setPickedFiles(prev => {
                // Filter out duplicates
                const existingIds = new Set(prev.map(f => f.id));
                const uniqueNewFiles = newFiles.filter(f => !existingIds.has(f.id));
                return [...uniqueNewFiles, ...prev];
              });

              triggerToast(`Successfully linked ${docs.length} file(s) from Google Drive!`, "success");
            }
          }
        })
        .build();

      picker.setVisible(true);
    } catch (err: any) {
      console.error(err);
      triggerToast(`Error launching Google Picker: ${err.message || err}`, "error");
    }
  };

  const handleDeleteFile = (id: string) => {
    setPickedFiles(prev => prev.filter(f => f.id !== id));
    triggerToast("Unlinked Google Drive file reference.", "success");
  };

  const formatBytes = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`p-6 rounded-2xl border transition-all ${
      theme === 'day' 
        ? 'bg-white border-slate-200 shadow-xl' 
        : 'bg-[#0a0b10] border-slate-800 shadow-[0_0_30px_rgba(0,0,0,0.8)]'
    }`}>
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-indigo-500/20 to-pink-500/20 rounded-xl border border-indigo-500/30">
            <HardDrive className="w-6 h-6 text-[#00f0ff] animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-white">
              Google Drive Picker Integration
            </h3>
            <p className="text-[10px] text-slate-500 font-mono">
              Securely search, preview, and attach engineering specs or export blueprints
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono">
          {googleToken ? (
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold uppercase">Connected to Drive</span>
              <button
                onClick={onDisconnect}
                className="px-2 py-1 bg-rose-950/40 border border-rose-500/20 text-rose-400 hover:bg-rose-600 hover:text-white rounded text-[9px] uppercase font-bold transition-colors cursor-pointer"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={onConnect}
              className="px-3 py-1.5 bg-[#00f0ff] hover:bg-[#00f0ff]/80 text-slate-950 rounded-xl text-xs font-bold uppercase transition-all hover:scale-102 cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
              <span>Connect Drive API</span>
            </button>
          )}
        </div>
      </div>

      {/* Launcher Section */}
      <div className="py-8 text-center flex flex-col items-center justify-center border-b border-slate-800/50">
        {googleToken ? (
          <div className="max-w-md space-y-4">
            <div className="p-8 bg-[#00f0ff]/5 border border-[#00f0ff]/20 rounded-2xl space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Access your full cloud files directly. You can pick schematics, assembly manuals, quality logs, or catalog PDFs to attach them to the system database.
              </p>
              
              <button
                onClick={handleLaunchPicker}
                disabled={isPickerLoading}
                className="px-6 py-3 bg-gradient-to-r from-[#00f0ff] to-indigo-500 hover:from-[#00f0ff]/90 hover:to-indigo-500/90 text-slate-950 hover:text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 transform hover:scale-102 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center gap-2 mx-auto"
              >
                <Folder className="w-4 h-4" />
                <span>{isPickerLoading ? 'Loading GAPI...' : 'Open File Picker console'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 bg-slate-900/20 border border-slate-800/50 rounded-2xl max-w-md space-y-4">
            <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center mx-auto">
              <Folder className="w-6 h-6 text-slate-600" />
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Connect your Google Workspace/Drive account to interact with the Picker API. All file authentication remains secure and private.
            </p>
            <button
              onClick={onConnect}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer inline-block mx-auto"
            >
              Authorize Secure Connection
            </button>
          </div>
        )}
      </div>

      {/* Linked Documents List */}
      <div className="mt-6 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-[#00f0ff] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Attached Cloud Machinery Specs ({pickedFiles.length})</span>
        </h4>

        {pickedFiles.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl">
            <p className="text-xs text-slate-500 font-mono">No documents linked yet. Launch picker to select a document.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1 cyber-scroll">
            {pickedFiles.map(file => (
              <div
                key={file.id}
                className="p-3 bg-slate-900/40 border border-slate-800 rounded-xl flex items-start justify-between gap-3 hover:border-indigo-500/50 transition-colors"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  {file.iconUrl ? (
                    <img src={file.iconUrl} alt="icon" className="w-5 h-5 shrink-0 mt-0.5" referrerPolicy="no-referrer" />
                  ) : (
                    <FileText className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0 font-mono">
                    <p className="text-xs font-bold text-white truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-[9px] text-slate-500 mt-0.5 truncate">
                      {formatBytes(file.sizeBytes)} • {file.mimeType.split('/').pop()?.toUpperCase()}
                    </p>
                    <p className="text-[8px] text-indigo-400 mt-1">
                      Linked: {new Date(file.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 hover:bg-slate-800 text-[#00f0ff] hover:text-white rounded transition-colors"
                    title="Open in Drive"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => handleDeleteFile(file.id)}
                    className="p-1.5 hover:bg-rose-950/40 text-rose-400 rounded transition-colors cursor-pointer"
                    title="Unlink File"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
