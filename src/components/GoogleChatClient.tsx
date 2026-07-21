import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  Users,
  RefreshCw,
  LogOut,
  Lock,
  Shield,
  Search,
  Trash2,
  Plus,
  X,
  Sparkles,
  User,
  AlertOctagon,
  FileText,
  AlertTriangle,
  Radio,
  Sliders,
  CheckCircle,
  Clock,
  Terminal
} from 'lucide-react';

interface GoogleChatClientProps {
  googleToken: string | null;
  googleUser: { email: string; name: string; picture: string } | null;
  onConnect: () => void;
  onDisconnect: () => void;
  theme: 'day' | 'night' | 'cyberpunk';
  triggerToast: (message: string, type?: 'success' | 'error') => void;
}

interface ChatSpace {
  name: string;
  displayName: string;
  type: string;
  singleUserBotMentionDetails?: boolean;
}

interface ChatMessage {
  name: string;
  sender: {
    name: string;
    displayName: string;
    avatarUrl?: string;
    type: string;
  };
  createTime: string;
  text: string;
}

export const GoogleChatClient: React.FC<GoogleChatClientProps> = ({
  googleToken,
  googleUser,
  onConnect,
  onDisconnect,
  theme,
  triggerToast,
}) => {
  const [activeTab, setActiveTab] = useState<'live' | 'simulated'>('simulated');
  const [spaces, setSpaces] = useState<ChatSpace[]>([]);
  const [loadingSpaces, setLoadingSpaces] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<ChatSpace | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessageText, setNewMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [ignoreVirtualEntities, setIgnoreVirtualEntities] = useState(true);

  // Simulated Chat Room State
  const [simulatedChannels, setSimulatedChannels] = useState([
    { id: 'general', name: '📢 General Dispatch', unread: 2 },
    { id: 'alerts', name: '⚠️ Machinery Alerts', unread: 5 },
    { id: 'logistics', name: '📦 Logistics Dispatch', unread: 0 },
  ]);
  const [selectedChannelId, setSelectedChannelId] = useState('general');
  const [simulatedMessages, setSimulatedMessages] = useState<Record<string, Array<{
    id: string;
    sender: string;
    avatar: string;
    text: string;
    time: string;
    isSystem?: boolean;
    isAi?: boolean;
  }>>>({
    general: [
      { id: 'g1', sender: 'Systems Monitor', avatar: '🤖', text: 'Shandong Azum Terminal v2.5 Online.', time: '08:30 AM', isSystem: true },
      { id: 'g2', sender: 'Director Mohab', avatar: '👨‍💼', text: 'We need to coordinate the delivery of the CNC milling machine and hydraulic shear next week.', time: '08:45 AM' },
      { id: 'g3', sender: 'Sales Assistant', avatar: '👩‍💼', text: 'Alexandria client confirmed they completed payment for the heavy lathe!', time: '09:12 AM' },
    ],
    alerts: [
      { id: 'a1', sender: 'Sensor Hub', avatar: '🚨', text: 'Hydraulic Shear Alpha pressure reading: 320 Bar (Normal max is 300 Bar). Maintenance suggested.', time: '09:00 AM', isSystem: true },
      { id: 'a2', sender: 'Altayeb Operator', avatar: '🔧', text: 'I completed the physical visual inspection on Shandong shear. Indeed, slight seal wearing. Created critical maintenance protocol.', time: '09:05 AM' },
    ],
    logistics: [
      { id: 'l1', sender: 'Logistics Robot', avatar: '🚢', text: 'Vessel "Shandong Pioneer" docked at Qingdao Port. Shipping container AZUM-4029 loading completed.', time: '07:15 AM', isSystem: true },
    ],
  });

  const [newSimulatedText, setNewSimulatedText] = useState('');
  const [aiResponding, setAiResponding] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, simulatedMessages, selectedChannelId, activeTab]);

  // Fetch real Google Chat Spaces
  const fetchSpaces = async () => {
    if (!googleToken) return;
    setLoadingSpaces(true);
    try {
      const res = await fetch('https://chat.googleapis.com/v1/spaces', {
        headers: { Authorization: `Bearer ${googleToken}` },
      });
      if (!res.ok) {
        throw new Error(`Google Chat API returned status ${res.status}`);
      }
      const data = await res.json();
      const fetchedSpaces = data.spaces || [];
      setSpaces(fetchedSpaces);
      if (fetchedSpaces.length > 0 && !selectedSpace) {
        setSelectedSpace(fetchedSpaces[0]);
      }
    } catch (err: any) {
      console.error('Fetch Spaces error:', err);
      triggerToast(`Could not fetch Google Chat Spaces: ${err.message}`, 'error');
    } finally {
      setLoadingSpaces(false);
    }
  };

  // Fetch messages of selected space
  const fetchMessages = async () => {
    if (!googleToken || !selectedSpace) return;
    setLoadingMessages(true);
    try {
      const res = await fetch(`https://chat.googleapis.com/v1/${selectedSpace.name}/messages`, {
        headers: { Authorization: `Bearer ${googleToken}` },
      });
      if (!res.ok) {
        throw new Error(`Google Chat API returned status ${res.status}`);
      }
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err: any) {
      console.error('Fetch Messages error:', err);
      triggerToast(`Could not load messages: ${err.message}`, 'error');
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (googleToken && activeTab === 'live') {
      fetchSpaces();
    }
  }, [googleToken, activeTab]);

  useEffect(() => {
    if (googleToken && selectedSpace && activeTab === 'live') {
      fetchMessages();
    }
  }, [googleToken, selectedSpace, activeTab]);

  // Handle Send Real Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleToken || !selectedSpace || !newMessageText.trim()) return;
    setIsSending(true);
    try {
      const res = await fetch(`https://chat.googleapis.com/v1/${selectedSpace.name}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${googleToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: newMessageText,
        }),
      });

      if (!res.ok) {
        throw new Error(`Google Chat API returned status ${res.status}`);
      }

      setNewMessageText('');
      fetchMessages();
      triggerToast('Message posted successfully to Google Chat space!', 'success');
    } catch (err: any) {
      console.error('Send message error:', err);
      triggerToast(`Failed to send message: ${err.message}`, 'error');
    } finally {
      setIsSending(false);
    }
  };

  // Handle Delete Real Message (with required confirmation)
  const handleDeleteMessage = async (messageName: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this message from the Google Chat Space? This action is permanent.'
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`https://chat.googleapis.com/v1/${messageName}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${googleToken}` },
      });

      if (!res.ok) {
        throw new Error(`Failed to delete message: status ${res.status}`);
      }

      fetchMessages();
      triggerToast('Message deleted successfully.', 'success');
    } catch (err: any) {
      console.error('Delete message error:', err);
      triggerToast(`Could not delete message: ${err.message}`, 'error');
    }
  };

  // Simulated send message
  const handleSendSimulatedMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSimulatedText.trim()) return;

    const userMsg = {
      id: `sim-${Date.now()}`,
      sender: googleUser?.name || 'Administrator',
      avatar: '👑',
      text: newSimulatedText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setSimulatedMessages((prev) => ({
      ...prev,
      [selectedChannelId]: [...prev[selectedChannelId], userMsg],
    }));

    setNewSimulatedText('');
    setAiResponding(false);
  };

  return (
    <div className={`p-6 rounded-2xl border ${
      theme === 'day' 
        ? 'bg-white border-slate-200 text-slate-800' 
        : theme === 'cyberpunk'
          ? 'bg-slate-950 border-cyan-500/30 text-white'
          : 'bg-[#0f172a] border-slate-800/80 text-white'
    } shadow-xl flex flex-col h-[650px]`}>
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-800/40 pb-5 mb-5 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-indigo-500 to-cyan-500 rounded-2xl text-white shadow-md shadow-indigo-500/20">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black uppercase tracking-wider font-mono flex items-center gap-2">
              <span>Google Chat Room Controller</span>
              {googleToken && activeTab === 'live' && (
                <span className="text-[9px] px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono font-bold rounded-full animate-pulse uppercase tracking-widest">
                  Live Sync
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500 font-mono">Real-time industrial channel coordination & instant staging</p>
          </div>
        </div>

        {/* User Connector Controls */}
        <div className="flex items-center gap-3">
          {googleUser ? (
            <div className="flex items-center gap-3 bg-slate-900/60 p-2 pl-3 pr-4 rounded-xl border border-slate-800">
              <img
                src={googleUser.picture || `https://api.dicebear.com/7.x/identicon/svg?seed=${googleUser.email}`}
                alt="Avatar"
                className="w-7 h-7 rounded-full border border-pink-500/40"
              />
              <div className="text-left">
                <p className="text-[9px] font-bold text-slate-400 font-mono leading-none">Active User</p>
                <p className="text-xs text-[#00f0ff] font-mono font-semibold truncate max-w-[150px]">{googleUser.email}</p>
              </div>
              <button
                onClick={onDisconnect}
                title="Disconnect Account"
                className="p-1 hover:bg-rose-500/10 hover:text-rose-400 text-slate-500 rounded transition-colors ml-1"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onConnect}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold font-mono tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-300" />
              <span>CONNECT CHAT SERVICES</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs list selector and controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800/40 gap-4 mb-4 shrink-0">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('simulated')}
            className={`pb-2.5 px-4 text-xs font-bold font-mono uppercase tracking-widest border-b-2 transition-all ${
              activeTab === 'simulated'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            🛰️ STAGING CHANNELS
          </button>
          <button
            onClick={() => setActiveTab('live')}
            className={`pb-2.5 px-4 text-xs font-bold font-mono uppercase tracking-widest border-b-2 transition-all ${
              activeTab === 'live'
                ? 'border-[#00f0ff] text-[#00f0ff]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            💬 GOOGLE CHAT SPACES
          </button>
        </div>

        {/* Configuration toggle */}
        <div className="flex items-center gap-2 pb-2 sm:pb-0">
          <button
            type="button"
            onClick={() => {
              setIgnoreVirtualEntities(!ignoreVirtualEntities);
              triggerToast(
                !ignoreVirtualEntities 
                  ? "Virtual/Bot entities are now ignored in chat interfaces." 
                  : "Virtual/Bot entities are now visible in chat interfaces.",
                "success"
              );
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[10px] font-bold font-mono transition-all cursor-pointer ${
              ignoreVirtualEntities
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 hover:bg-amber-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>IGNORE VIRTUAL ENTITIES: {ignoreVirtualEntities ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Main chat layout */}
      <div className="flex-1 min-h-0 flex gap-4">
        
        {/* Sidebar Space List / Channel List */}
        <div className="w-64 border-r border-slate-800/40 pr-4 flex flex-col gap-3 shrink-0">
          <div className="text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wider flex items-center justify-between">
            <span>{activeTab === 'live' ? 'Spaces on Google' : 'Interactive Channels'}</span>
            {activeTab === 'live' && googleToken && (
              <button onClick={fetchSpaces} className="p-1 hover:text-white transition-colors" title="Reload Spaces">
                <RefreshCw className={`w-3 h-3 ${loadingSpaces ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            {activeTab === 'simulated' ? (
              simulatedChannels.map((chan) => (
                <button
                  key={chan.id}
                  onClick={() => setSelectedChannelId(chan.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono font-bold flex items-center justify-between transition-colors ${
                    selectedChannelId === chan.id
                      ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                      : 'hover:bg-slate-900/40 text-slate-400'
                  }`}
                >
                  <span>{chan.name}</span>
                  {chan.unread > 0 && (
                    <span className="text-[9px] bg-rose-500 text-white font-black px-1.5 py-0.5 rounded-full leading-none">
                      {chan.unread}
                    </span>
                  )}
                </button>
              ))
            ) : !googleToken ? (
              <div className="p-3 bg-slate-900/30 border border-slate-800/60 rounded-xl text-center">
                <Lock className="w-5 h-5 text-slate-500 mx-auto mb-1.5" />
                <p className="text-[10px] text-slate-400 font-mono">Connect Account to query Google Spaces</p>
              </div>
            ) : loadingSpaces ? (
              <div className="flex justify-center py-10">
                <RefreshCw className="w-5 h-5 animate-spin text-indigo-500" />
              </div>
            ) : spaces.length === 0 ? (
              <p className="text-[11px] text-slate-500 italic font-mono text-center py-6">No chat spaces detected.</p>
            ) : (
              spaces.map((space) => (
                <button
                  key={space.name}
                  onClick={() => setSelectedSpace(space)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono font-bold flex flex-col gap-0.5 transition-colors border ${
                    selectedSpace?.name === space.name
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'border-transparent hover:bg-slate-900/40 text-slate-400'
                  }`}
                >
                  <span className="truncate">{space.displayName || space.name}</span>
                  <span className="text-[8px] text-slate-500 uppercase">{space.type}</span>
                </button>
              ))
            )}
          </div>

          <div className="p-2.5 bg-slate-900/40 border border-slate-850/60 rounded-xl">
            <div className="flex items-center gap-1.5 text-[9px] text-[#00f0ff] font-mono uppercase font-bold mb-1">
              <Terminal className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span>Telemetry Node</span>
            </div>
            <p className="text-[9px] text-slate-500 font-mono leading-snug">
              Encrypted room link. Transmitting operations feed directly.
            </p>
          </div>
        </div>

        {/* Chat Window Area */}
        <div className="flex-1 flex flex-col bg-slate-900/10 border border-slate-800/40 rounded-2xl min-w-0 overflow-hidden">
          {activeTab === 'live' && !googleToken ? (
            /* locked live state screen */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-full">
                <Lock className="w-10 h-10 text-[#00f0ff]" />
              </div>
              <div className="max-w-xs space-y-1">
                <h4 className="text-sm font-bold font-mono text-slate-300">Workspace Chat Locked</h4>
                <p className="text-xs text-slate-500 font-mono">
                  Sign in with your Google account to participate in live spaces and coordinate directly inside Shandong Azum teams.
                </p>
              </div>
              <button
                onClick={onConnect}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold uppercase text-[10px] tracking-wider rounded-xl shadow-lg transition-all"
              >
                Authenticate Google Chat API
              </button>
            </div>
          ) : (
            <>
              {/* Chat Window Header */}
              <div className="px-4 py-3 bg-slate-900/30 border-b border-slate-800/40 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-xs font-mono font-bold">
                    {activeTab === 'simulated'
                      ? simulatedChannels.find(c => c.id === selectedChannelId)?.name
                      : selectedSpace?.displayName || 'Loading chat space...'}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {activeTab === 'simulated' ? 'Local Sandbox mode' : 'Direct Workspace Feed'}
                </div>
              </div>

              {/* Message Feed list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                {activeTab === 'simulated' ? (
                  simulatedMessages[selectedChannelId]?.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 max-w-[85%] ${
                        msg.isSystem ? 'mx-auto w-full text-center max-w-full justify-center' : ''
                      }`}
                    >
                      {!msg.isSystem && (
                        <div className="w-7 h-7 rounded-lg bg-slate-850 border border-slate-800/80 flex items-center justify-center text-sm shrink-0">
                          {msg.avatar}
                        </div>
                      )}
                      
                      <div className={msg.isSystem ? 'w-full' : 'flex-1'}>
                        {msg.isSystem ? (
                          <div className="bg-slate-900/40 border border-slate-800/60 rounded-lg px-3 py-1.5 inline-block text-[10px] text-slate-500 font-mono">
                            <span className="text-indigo-400 mr-1.5">[SYSTEM FEED]</span>
                            {msg.text}
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex items-baseline gap-2">
                              <span className={`text-[10px] font-mono font-black ${
                                msg.isAi ? 'text-[#00f0ff]' : 'text-slate-300'
                              }`}>
                                {msg.sender}
                              </span>
                              <span className="text-[8px] text-slate-500 font-mono">{msg.time}</span>
                            </div>
                            <div className={`p-2.5 rounded-xl text-xs font-mono border leading-relaxed ${
                              msg.isAi 
                                ? 'bg-cyan-950/20 border-cyan-500/25 text-slate-100' 
                                : 'bg-slate-900/40 border-slate-800/50 text-slate-300'
                            }`}>
                              {msg.text}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : loadingMessages ? (
                  <div className="flex flex-col items-center justify-center py-16 space-y-2">
                    <RefreshCw className="w-6 h-6 animate-spin text-[#00f0ff]" />
                    <p className="text-xs text-slate-500 font-mono">Fetching Google Chat messages...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-16 space-y-1">
                    <MessageSquare className="w-8 h-8 text-slate-600 mx-auto opacity-30" />
                    <p className="text-xs text-slate-500 italic font-mono">This chat space has no messages yet.</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.name} className="flex gap-3 max-w-[85%]">
                      <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xs text-indigo-400 font-mono shrink-0">
                        {msg.sender?.displayName?.charAt(0) || 'U'}
                      </div>
                      <div className="flex-1">
                        <div className="space-y-1">
                          <div className="flex items-baseline justify-between gap-2">
                            <div className="flex items-baseline gap-2">
                              <span className="text-[10px] font-mono font-black text-slate-300">
                                {msg.sender?.displayName || 'User'}
                              </span>
                              <span className="text-[8px] text-slate-500 font-mono">
                                {new Date(msg.createTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            {/* Option to delete own/managed messages */}
                            <button
                              onClick={() => handleDeleteMessage(msg.name)}
                              className="text-slate-500 hover:text-rose-500 transition-colors p-0.5"
                              title="Delete message from room"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="p-2.5 rounded-xl text-xs font-mono bg-slate-900/40 border border-slate-800/50 text-slate-300 leading-relaxed">
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {aiResponding && (
                  <div className="flex gap-3 max-w-[80%]">
                    <div className="w-7 h-7 rounded-lg bg-cyan-950/40 border border-cyan-800 flex items-center justify-center text-sm shrink-0">
                      ⚡
                    </div>
                    <div className="space-y-1 flex-1">
                      <span className="text-[10px] font-mono font-black text-[#00f0ff]">Azum AI Operator</span>
                      <div className="p-2.5 rounded-xl text-xs font-mono bg-cyan-950/10 border border-cyan-950/40 text-slate-400">
                        <span className="inline-flex gap-1">
                          <span className="w-1.5 h-1.5 bg-[#00f0ff] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 bg-[#00f0ff] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 bg-[#00f0ff] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Message Form bar */}
              <form
                onSubmit={activeTab === 'simulated' ? handleSendSimulatedMessage : handleSendMessage}
                className="p-3 bg-slate-900/40 border-t border-slate-800/40 flex gap-2 shrink-0"
              >
                <input
                  type="text"
                  placeholder={
                    activeTab === 'simulated' 
                      ? "Type a staging message (e.g. Is Hydraulic Shear fixed?)..." 
                      : "Type a secure message to Google Space..."
                  }
                  value={activeTab === 'simulated' ? newSimulatedText : newMessageText}
                  onChange={(e) => activeTab === 'simulated' ? setNewSimulatedText(e.target.value) : setNewMessageText(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800/60 rounded-xl text-xs text-slate-200 outline-none focus:border-indigo-500 font-mono placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  disabled={isSending || (activeTab === 'live' && !newMessageText.trim()) || (activeTab === 'simulated' && !newSimulatedText.trim())}
                  className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
