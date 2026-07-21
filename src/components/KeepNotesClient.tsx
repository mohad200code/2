import React, { useState, useEffect } from 'react';
import { Pin, Trash2, Plus, Check, Square, CheckSquare, Palette, Edit, FileText, Sparkles } from 'lucide-react';

interface KeepNote {
  id: string;
  title: string;
  text: string;
  color: string;
  isPinned: boolean;
  listItems?: { id: string; text: string; checked: boolean }[];
  updatedAt: string;
}

interface KeepNotesClientProps {
  googleToken?: string | null;
  theme?: 'day' | 'night' | 'cyberpunk' | 'cyberpunk-light';
  triggerToast?: (msg: string, type?: 'success' | 'error') => void;
}

export const KeepNotesClient: React.FC<KeepNotesClientProps> = ({
  googleToken = null,
  theme = 'cyberpunk',
  triggerToast = (msg, type) => {}
}) => {
  const [notes, setNotes] = useState<KeepNote[]>(() => {
    const saved = localStorage.getItem('azum_keep_notes');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: '1',
        title: '💡 Heavy Machinery Restock Criteria',
        text: 'All helical gears and machine shafts below 15 units of stock should be restocked immediately. Verify with Altayeb.',
        color: '#1e1b4b',
        isPinned: true,
        updatedAt: new Date().toLocaleDateString()
      },
      {
        id: '2',
        title: '📋 Logistics Shipments Checklist',
        text: '',
        color: '#311042',
        isPinned: true,
        listItems: [
          { id: 'li-1', text: 'Approve custom laser cutters specs', checked: true },
          { id: 'li-2', text: 'Verify direct satellite uplink status', checked: false },
          { id: 'li-3', text: 'Coordinate container shipment to Egypt', checked: false }
        ],
        updatedAt: new Date().toLocaleDateString()
      },
      {
        id: '3',
        title: '📞 Altayeb Yousif Dafalla Meeting Notes',
        text: 'Discuss regional operator credentials and review custom industrial classifications for Shandong Azum Import & Export Co.',
        color: '#1c1917',
        isPinned: false,
        updatedAt: new Date().toLocaleDateString()
      }
    ];
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newText, setNewText] = useState('');
  const [newColor, setNewColor] = useState('#0f111a');
  const [newIsPinned, setNewIsPinned] = useState(false);
  const [newListItems, setNewListItems] = useState<{ text: string; checked: boolean }[]>([]);
  const [newItemText, setNewItemText] = useState('');
  const [isChecklistMode, setIsChecklistMode] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('azum_keep_notes', JSON.stringify(notes));
  }, [notes]);

  const keepColors = [
    { name: 'Dark Slate', value: '#0f111a' },
    { name: 'Indigo Deep', value: '#1e1b4b' },
    { name: 'Sunset Bronze', value: '#3c1010' },
    { name: 'Moss Amber', value: '#143015' },
    { name: 'Cyber Purple', value: '#2e104e' },
    { name: 'Ocean Abyssal', value: '#06303d' },
    { name: 'Charcoal Industrial', value: '#1c1917' },
    { name: 'Gunmetal Grey', value: '#27272a' },
  ];

  const handleCreateNote = () => {
    if (!newTitle.trim() && !newText.trim() && newListItems.length === 0) {
      setIsExpanded(false);
      return;
    }

    const newNote: KeepNote = {
      id: `note-${Date.now()}`,
      title: newTitle.trim() || 'Untitled Note',
      text: newText.trim(),
      color: newColor,
      isPinned: newIsPinned,
      listItems: isChecklistMode ? newListItems.map((item, index) => ({ id: `li-${Date.now()}-${index}`, ...item })) : undefined,
      updatedAt: new Date().toLocaleDateString()
    };

    setNotes(prev => [newNote, ...prev]);
    triggerToast(`Keep note "${newNote.title}" created!`, 'success');

    // Reset inputs
    setNewTitle('');
    setNewText('');
    setNewColor('#0f111a');
    setNewIsPinned(false);
    setNewListItems([]);
    setNewItemText('');
    setIsChecklistMode(false);
    setIsExpanded(false);
  };

  const handleDeleteNote = (id: string, title: string) => {
    if (!window.confirm(`Delete the note "${title}"?`)) return;
    setNotes(prev => prev.filter(n => n.id !== id));
    triggerToast('Note deleted successfully', 'success');
  };

  const handleTogglePin = (id: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n));
  };

  const handleToggleListItem = (noteId: string, itemId: string) => {
    setNotes(prev => prev.map(n => {
      if (n.id === noteId && n.listItems) {
        return {
          ...n,
          listItems: n.listItems.map(item => item.id === itemId ? { ...item, checked: !item.checked } : item)
        };
      }
      return n;
    }));
  };

  const handleAddChecklistItem = () => {
    if (!newItemText.trim()) return;
    setNewListItems(prev => [...prev, { text: newItemText.trim(), checked: false }]);
    setNewItemText('');
  };

  const handleRemoveChecklistItem = (index: number) => {
    setNewListItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleNoteColorChange = (id: string, color: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, color } : n));
  };

  const pinnedNotes = notes.filter(n => n.isPinned);
  const otherNotes = notes.filter(n => !n.isPinned);

  return (
    <div className="space-y-6">
      <div className={`p-4 rounded-xl border flex items-center justify-between ${
        theme === 'day' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-slate-800'
      }`}>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            🤖 Google Keep Notes Integration
          </h4>
        </div>
        <div className="flex items-center gap-1.5">
          {googleToken ? (
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-2.5 py-0.5 font-mono">
              ● API Authorized
            </span>
          ) : (
            <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full px-2.5 py-0.5 font-mono">
              ⚠️ Local Mode
            </span>
          )}
        </div>
      </div>

      {/* Note Creator Input */}
      <div className="max-w-xl mx-auto">
        <div 
          className={`rounded-2xl border transition-all duration-300 overflow-hidden shadow-xl ${
            theme === 'day' 
              ? 'bg-white border-slate-200 shadow-slate-200/50' 
              : 'bg-[#0e111a] border-slate-800'
          }`}
          style={{ backgroundColor: isExpanded ? newColor : undefined }}
        >
          {isExpanded ? (
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <input
                  type="text"
                  placeholder="Title"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-transparent font-bold text-xs text-slate-200 placeholder-slate-500 outline-none"
                />
                <button 
                  onClick={() => setNewIsPinned(!newIsPinned)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    newIsPinned ? 'text-yellow-400 bg-yellow-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Pin className="w-4 h-4" />
                </button>
              </div>

              {isChecklistMode ? (
                <div className="space-y-2">
                  <div className="space-y-1">
                    {newListItems.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-slate-950/40 px-2 py-1 rounded">
                        <span className="text-[11px] text-slate-300 font-mono">{item.text}</span>
                        <button onClick={() => handleRemoveChecklistItem(idx)} className="text-rose-400 text-xs hover:underline">✕</button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Add checklist item..."
                      value={newItemText}
                      onChange={e => setNewItemText(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAddChecklistItem()}
                      className="flex-1 bg-slate-950/80 border border-slate-850 px-2.5 py-1.5 rounded text-[10px] text-slate-200 font-mono outline-none focus:border-indigo-500"
                    />
                    <button 
                      onClick={handleAddChecklistItem}
                      className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-mono text-[10px]"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ) : (
                <textarea
                  placeholder="Take a note..."
                  value={newText}
                  onChange={e => setNewText(e.target.value)}
                  className="w-full h-24 bg-transparent text-[11px] text-slate-300 placeholder-slate-500 outline-none resize-none font-mono"
                />
              )}

              <div className="flex justify-between items-center pt-2 border-t border-slate-800/40">
                <div className="flex gap-1">
                  {/* Checklist toggle button */}
                  <button
                    onClick={() => setIsChecklistMode(!isChecklistMode)}
                    className={`p-1.5 rounded-lg transition-colors text-slate-400 hover:text-slate-200 hover:bg-slate-800 ${
                      isChecklistMode ? 'text-teal-400 bg-teal-500/10' : ''
                    }`}
                    title="Toggle Checklist"
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                  </button>

                  {/* Palette Selector */}
                  <div className="relative group">
                    <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800">
                      <Palette className="w-3.5 h-3.5" />
                    </button>
                    <div className="absolute left-0 bottom-full mb-2 bg-slate-950 border border-slate-800 p-1.5 rounded-lg hidden group-hover:flex gap-1 z-50 shadow-2xl">
                      {keepColors.map(c => (
                        <button
                          key={c.value}
                          onClick={() => setNewColor(c.value)}
                          className="w-4 h-4 rounded-full border border-slate-700 hover:scale-110 transition-transform"
                          style={{ backgroundColor: c.value }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsExpanded(false);
                      setNewTitle('');
                      setNewText('');
                      setNewColor('#0f111a');
                      setNewIsPinned(false);
                      setNewListItems([]);
                      setIsChecklistMode(false);
                    }}
                    className="px-3 py-1.5 text-[10px] text-slate-400 hover:text-slate-200 font-bold uppercase"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleCreateNote}
                    className="px-3.5 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-[10px] uppercase rounded-lg shadow-[0_0_10px_rgba(234,179,8,0.2)] transition-all"
                  >
                    Save Note
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div 
              onClick={() => setIsExpanded(true)}
              className="p-3.5 text-slate-500 text-[11px] font-mono cursor-pointer flex items-center justify-between"
            >
              <span>Take a note...</span>
              <Plus className="w-4 h-4 text-slate-400" />
            </div>
          )}
        </div>
      </div>

      {/* Note Grid Sections */}
      <div className="space-y-6">
        {pinnedNotes.length > 0 && (
          <div className="space-y-3">
            <h5 className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-black">
              📌 Pinned Notes
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pinnedNotes.map(n => (
                <div
                  key={n.id}
                  className="rounded-2xl border border-slate-800/80 p-4 shadow-xl transition-all hover:scale-[1.01] hover:border-yellow-500/30 flex flex-col justify-between group"
                  style={{ backgroundColor: n.color }}
                >
                  <div>
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <h6 className="text-xs font-black text-slate-200 font-mono tracking-tight">{n.title}</h6>
                      <button 
                        onClick={() => handleTogglePin(n.id)}
                        className="text-yellow-400 hover:text-slate-300"
                        title="Unpin Note"
                      >
                        <Pin className="w-3.5 h-3.5 fill-yellow-400" />
                      </button>
                    </div>

                    {n.listItems ? (
                      <div className="space-y-1.5 my-3">
                        {n.listItems.map(item => (
                          <div 
                            key={item.id} 
                            onClick={() => handleToggleListItem(n.id, item.id)}
                            className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1 rounded"
                          >
                            {item.checked ? (
                              <CheckSquare className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                            ) : (
                              <Square className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            )}
                            <span className={`text-[10px] font-mono ${item.checked ? 'line-through text-slate-500' : 'text-slate-300'}`}>
                              {item.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-300 leading-relaxed font-mono whitespace-pre-wrap my-3">
                        {n.text}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-slate-800/40 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[9px] text-slate-500 font-mono">{n.updatedAt}</span>
                    <div className="flex gap-1.5">
                      {/* Color Palette dropdown inside grid card */}
                      <div className="relative inline-block group/palette">
                        <button className="p-1 rounded bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-white">
                          <Palette className="w-3 h-3" />
                        </button>
                        <div className="absolute right-0 bottom-full mb-1 bg-slate-950 border border-slate-800 p-1 rounded hidden group-hover/palette:flex gap-1 z-50">
                          {keepColors.map(c => (
                            <button
                              key={c.value}
                              onClick={() => handleNoteColorChange(n.id, c.value)}
                              className="w-3 h-3 rounded-full border border-slate-700"
                              style={{ backgroundColor: c.value }}
                              title={c.name}
                            />
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteNote(n.id, n.title)}
                        className="p-1 rounded bg-slate-950/60 border border-slate-800 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                        title="Delete Note"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {otherNotes.length > 0 && (
          <div className="space-y-3">
            <h5 className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-black">
              📂 Other Notes
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherNotes.map(n => (
                <div
                  key={n.id}
                  className="rounded-2xl border border-slate-800/80 p-4 shadow-xl transition-all hover:scale-[1.01] hover:border-yellow-500/30 flex flex-col justify-between group"
                  style={{ backgroundColor: n.color }}
                >
                  <div>
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <h6 className="text-xs font-black text-slate-200 font-mono tracking-tight">{n.title}</h6>
                      <button 
                        onClick={() => handleTogglePin(n.id)}
                        className="text-slate-400 hover:text-yellow-400"
                        title="Pin Note"
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {n.listItems ? (
                      <div className="space-y-1.5 my-3">
                        {n.listItems.map(item => (
                          <div 
                            key={item.id} 
                            onClick={() => handleToggleListItem(n.id, item.id)}
                            className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1 rounded"
                          >
                            {item.checked ? (
                              <CheckSquare className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                            ) : (
                              <Square className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            )}
                            <span className={`text-[10px] font-mono ${item.checked ? 'line-through text-slate-500' : 'text-slate-300'}`}>
                              {item.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-300 leading-relaxed font-mono whitespace-pre-wrap my-3">
                        {n.text}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-slate-800/40 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[9px] text-slate-500 font-mono">{n.updatedAt}</span>
                    <div className="flex gap-1.5">
                      {/* Color Palette dropdown inside grid card */}
                      <div className="relative inline-block group/palette">
                        <button className="p-1 rounded bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-white">
                          <Palette className="w-3 h-3" />
                        </button>
                        <div className="absolute right-0 bottom-full mb-1 bg-slate-950 border border-slate-800 p-1 rounded hidden group-hover/palette:flex gap-1 z-50">
                          {keepColors.map(c => (
                            <button
                              key={c.value}
                              onClick={() => handleNoteColorChange(n.id, c.value)}
                              className="w-3 h-3 rounded-full border border-slate-700"
                              style={{ backgroundColor: c.value }}
                              title={c.name}
                            />
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteNote(n.id, n.title)}
                        className="p-1 rounded bg-slate-950/60 border border-slate-800 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                        title="Delete Note"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
