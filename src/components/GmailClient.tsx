import React, { useState, useEffect, useCallback } from 'react';
import {
  Mail,
  Send,
  RefreshCw,
  LogOut,
  Lock,
  Shield,
  Search,
  Trash2,
  Plus,
  X,
  ChevronRight,
  Inbox,
  Sparkles,
  AlertTriangle,
  FileText,
  User,
  Star,
  Check
} from 'lucide-react';

import { withExponentialBackoff } from '../utils/backoff';

interface GmailClientProps {
  googleToken: string | null;
  googleUser: { email: string; name: string; picture: string } | null;
  onConnect: () => void;
  onDisconnect: () => void;
  theme: 'day' | 'night' | 'cyberpunk' | 'cyberpunk-light';
  triggerToast: (message: string, type?: 'success' | 'error') => void;
  adminInbox: any[];
}

interface GmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  labels: string[];
}

function base64urlEncode(str: string): string {
  // Unicode-safe base64 encoding
  const base64 = btoa(unescape(encodeURIComponent(str)));
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function decodeBase64(str: string): string {
  if (!str) return '';
  try {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder('utf-8').decode(bytes);
  } catch (e) {
    console.error('Decoding error:', e);
    // Secondary fallback
    try {
      return atob(str.replace(/-/g, '+').replace(/_/g, '/'));
    } catch (err) {
      return 'Error decoding email content.';
    }
  }
}

function getHeader(headers: { name: string; value: string }[] | undefined, name: string): string {
  if (!headers) return 'Unknown';
  const header = headers.find((h) => h.name.toLowerCase() === name.toLowerCase());
  return header ? header.value : 'Unknown';
}

function getMessageBody(payload: any): { html: string; text: string } {
  let html = '';
  let text = '';

  const extract = (part: any) => {
    if (!part) return;
    const mimeType = part.mimeType;
    const bodyData = part.body?.data;

    if (bodyData) {
      if (mimeType === 'text/html') {
        html = decodeBase64(bodyData);
      } else if (mimeType === 'text/plain') {
        text = decodeBase64(bodyData);
      }
    }

    if (part.parts) {
      part.parts.forEach(extract);
    }
  };

  extract(payload);

  // If no body found in parts, check root body
  if (!html && !text && payload?.body?.data) {
    const mimeType = payload.mimeType;
    const bodyData = payload.body.data;
    if (mimeType === 'text/html') {
      html = decodeBase64(bodyData);
    } else if (mimeType === 'text/plain' || mimeType?.startsWith('text/')) {
      text = decodeBase64(bodyData);
    }
  }

  return { html, text };
}

export const GmailClient: React.FC<GmailClientProps> = ({
  googleToken,
  googleUser,
  onConnect,
  onDisconnect,
  theme,
  triggerToast,
  adminInbox
}) => {
  const [activeTab, setActiveTab] = useState<'received' | 'simulated' | 'compose'>('received');
  const [messages, setMessages] = useState<GmailMessage[]>([]);
  const [loadingList, setLoadingList] = useState<boolean>(false);
  const [selectedMsgId, setSelectedMsgId] = useState<string | null>(null);
  const [activeLabel, setActiveLabel] = useState<string>('INBOX');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Selected Message Full Detail State
  const [fullMessage, setFullMessage] = useState<{ html: string; text: string; raw: any } | null>(null);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);

  // Compose Fields
  const [composeTo, setComposeTo] = useState<string>('');
  const [composeSubject, setComposeSubject] = useState<string>('');
  const [composeBody, setComposeBody] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);

  // Modals & Confirmations
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showSendConfirm, setShowSendConfirm] = useState<boolean>(false);

  const isCyberpunk = theme === 'cyberpunk';
  const isLight = theme === 'day';

  // Fetch Gmail List
  const fetchGmailList = useCallback(async (label = activeLabel, search = searchQuery) => {
    if (!googleToken) return;
    setLoadingList(true);
    try {
      let url = 'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=15';
      
      const queryParts: string[] = [];
      if (label && label !== 'ALL') {
        url += `&labelIds=${label}`;
      }
      if (search) {
        url += `&q=${encodeURIComponent(search)}`;
      }

      const res = await withExponentialBackoff(() => fetch(url, {
        headers: { Authorization: `Bearer ${googleToken}` }
      }).then(r => {
        if (!r.ok) throw new Error(`Gmail API returned code ${r.status}`);
        return r;
      }));

      const listData = await res.json();
      if (!listData.messages || listData.messages.length === 0) {
        setMessages([]);
        setLoadingList(false);
        return;
      }

      // Fetch metadata headers for listing in parallel
      const detailsPromises = listData.messages.map(async (msg: any) => {
        try {
          const detailRes = await withExponentialBackoff(() => fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Date`,
            {
              headers: { Authorization: `Bearer ${googleToken}` }
            }
          ).then(r => {
            if (!r.ok) throw new Error(`Metadata fetch failed ${r.status}`);
            return r;
          }));
          const detailData = await detailRes.json();
          
          const headers = detailData.payload?.headers;
          return {
            id: detailData.id,
            threadId: detailData.threadId,
            snippet: detailData.snippet || '',
            subject: getHeader(headers, 'Subject'),
            from: getHeader(headers, 'From'),
            to: getHeader(headers, 'To'),
            date: getHeader(headers, 'Date'),
            labels: detailData.labelIds || []
          };
        } catch (e) {
          console.error(`Failed to fetch metadata for ${msg.id}:`, e);
          return null;
        }
      });

      const results = await Promise.all(detailsPromises);
      const filteredResults = results.filter((m): m is GmailMessage => m !== null);
      setMessages(filteredResults);

      // Auto-select first message if none is selected
      if (filteredResults.length > 0 && !selectedMsgId) {
        setSelectedMsgId(filteredResults[0].id);
      }
    } catch (err: any) {
      console.error('Fetch Gmail error:', err);
      triggerToast(`Failed to load Gmail messages: ${err.message}`, 'error');
    } finally {
      setLoadingList(false);
    }
  }, [googleToken, activeLabel, searchQuery, selectedMsgId, triggerToast]);

  // Fetch Message Detail
  useEffect(() => {
    const fetchMessageDetail = async () => {
      if (!googleToken || !selectedMsgId || activeTab === 'simulated') {
        setFullMessage(null);
        return;
      }
      setLoadingDetail(true);
      try {
        const res = await withExponentialBackoff(() => fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${selectedMsgId}?format=full`, {
          headers: { Authorization: `Bearer ${googleToken}` }
        }).then(r => {
          if (!r.ok) throw new Error(`Gmail API returned ${r.status} for detail`);
          return r;
        }));
        const data = await res.json();
        const bodyContent = getMessageBody(data.payload);
        setFullMessage({
          html: bodyContent.html,
          text: bodyContent.text,
          raw: data
        });
      } catch (err: any) {
        console.error('Fetch details error:', err);
        triggerToast(`Failed to load email details: ${err.message}`, 'error');
      } finally {
        setLoadingDetail(false);
      }
    };

    fetchMessageDetail();
  }, [googleToken, selectedMsgId, activeTab, triggerToast]);

  // Load list on Token presence or label change
  useEffect(() => {
    if (googleToken && activeTab === 'received') {
      fetchGmailList();
    }
  }, [googleToken, activeLabel, activeTab, fetchGmailList]);

  // Handle Send Real Email
  const handleSendEmail = async () => {
    if (!googleToken) return;
    if (!composeTo.trim()) {
      triggerToast('Please specify a recipient email address.', 'error');
      return;
    }
    if (!composeSubject.trim()) {
      triggerToast('Please provide a subject line.', 'error');
      return;
    }

    setIsSending(true);
    try {
      // Craft a clean, cyber-styled email wrapper
      const styledBody = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #020617; color: #f1f5f9; padding: 40px 20px; border-radius: 16px; border: 1px solid #334155; max-width: 650px; margin: auto;">
          <div style="background-color: #1e1b4b; padding: 24px; border-bottom: 2px solid #ec4899; text-align: center; border-radius: 12px 12px 0 0;">
            <span style="font-size: 9px; font-weight: 900; letter-spacing: 0.2em; color: #ec4899; font-family: monospace; display: block; margin-bottom: 8px;">SECURE DIGITAL DESPATCH</span>
            <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #ffffff; text-transform: uppercase; letter-spacing: -0.025em;">SDAZUM COMMUNICATIONS</h1>
          </div>
          <div style="padding: 30px 20px; background-color: #0f172a; border-radius: 0 0 12px 12px; border: 1px solid #1e293b; border-top: 0;">
            <div style="color: #cbd5e1; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${composeBody}</div>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #334155; text-align: center;">
              <p style="font-size: 12px; color: #64748b; margin: 0;">Sent via Shandong Azum Cyberport automated logistics terminal.</p>
              <p style="font-size: 10px; color: #475569; margin-top: 6px; font-family: monospace;">TRANSMISSION-ID: CP-TXM-${Math.floor(Math.random() * 899999) + 100000}</p>
            </div>
          </div>
        </div>
      `;

      const rawMessage = [
        `To: ${composeTo.trim()}`,
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        `Subject: ${composeSubject.trim()}`,
        '',
        styledBody
      ].join('\r\n');

      const encodedMessage = base64urlEncode(rawMessage);

      const response = await withExponentialBackoff(() => fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${googleToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          raw: encodedMessage
        })
      }).then(async r => {
        if (!r.ok) {
          const errData = await r.json();
          throw new Error(errData.error?.message || 'Gmail transmission failed');
        }
        return r;
      }));

      triggerToast('🚀 Email dispatched successfully from your Gmail account!', 'success');
      
      // Reset compose
      setComposeTo('');
      setComposeSubject('');
      setComposeBody('');
      setShowSendConfirm(false);
      
      // Refresh list
      setActiveTab('received');
      fetchGmailList();
    } catch (err: any) {
      console.error('Send real email error:', err);
      triggerToast(`Email dispatch failed: ${err.message}`, 'error');
    } finally {
      setIsSending(false);
    }
  };

  // Handle Trash/Delete message
  const handleDeleteMessage = async (msgId: string) => {
    if (!googleToken) return;
    try {
      const response = await withExponentialBackoff(() => fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msgId}/trash`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${googleToken}`
        }
      }).then(r => {
        if (!r.ok) throw new Error(`Gmail API returned code ${r.status}`);
        return r;
      }));

      triggerToast('Message moved to Gmail Trash.', 'success');
      setShowDeleteConfirm(null);
      setSelectedMsgId(null);
      setFullMessage(null);
      fetchGmailList();
    } catch (err: any) {
      console.error('Trash email error:', err);
      triggerToast(`Could not delete email: ${err.message}`, 'error');
    }
  };

  // Select pre-filled template
  const applyTemplate = (type: 'receipt' | 'logistic' | 'followup') => {
    if (type === 'receipt') {
      setComposeSubject('⚡ Shandong Azum Machinery Purchase Order Confirmation');
      setComposeBody(
        `Dear Purchaser,\n\nWe hereby confirm receipt of your order and payment verification for high-capacity industrial automation components. Your shipment is cleared for packaging.\n\nWarm regards,\nAltayeb Yousif Dafalla\nShandong Azum Import & Export`
      );
    } else if (type === 'logistic') {
      setComposeSubject('🚚 Shandong Azum Industrial Logistics & Trace Report');
      setComposeBody(
        `Operator,\n\nAutomatic trace report triggered.\nYour container ship shipment containing multi-phase heavy machinery has completed initial seaport clearance. Ready for final site arrival.\n\nTerminal Status: SECURE\nDispatch Operations Desk`
      );
    } else if (type === 'followup') {
      setComposeSubject('⚙️ Shandong Azum Customer Support Trace-Back');
      setComposeBody(
        `Hello,\n\nThis is a custom follow-up from Shandong Azum technical operations. Let us know if you require power-grid voltage calibration guidelines (220V/380V/440V) or auxiliary machinery specs.\n\nSupport Desk Team`
      );
    }
    triggerToast('Template pre-loaded!', 'success');
  };

  const handleReply = (fromHeader: string, subjectHeader: string) => {
    // Extract clean email from "Name <email@domain.com>" or "email@domain.com"
    let cleanEmail = fromHeader;
    const match = fromHeader.match(/<([^>]+)>/);
    if (match) {
      cleanEmail = match[1];
    }
    setComposeTo(cleanEmail);
    setComposeSubject(subjectHeader.toLowerCase().startsWith('re:') ? subjectHeader : `Re: ${subjectHeader}`);
    setComposeBody(`\n\nOn ${new Date().toLocaleDateString()}, wrote:\n> `);
    setActiveTab('compose');
  };

  return (
    <div className={`rounded-3xl border shadow-2xl p-6 overflow-hidden transition-all duration-300 ${
      isLight 
        ? 'bg-white border-slate-200 text-slate-800' 
        : (isCyberpunk ? 'bg-slate-950/90 border-pink-500/30 text-slate-100' : 'bg-slate-900/90 border-slate-800 text-slate-100')
    }`}>
      {/* Top Banner Status Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-5 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-2xl shadow-lg shadow-indigo-500/10">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-black uppercase tracking-wider font-mono flex items-center gap-2">
              <span>Gmail Terminal Service</span>
              {googleToken && (
                <span className="text-[9px] px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono font-bold rounded-full animate-pulse uppercase tracking-widest">
                  Live Sync
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500 font-mono">Read and dispatch industrial purchase telemetry logs securely</p>
          </div>
        </div>

        {/* User Connector Controls */}
        <div className="flex items-center gap-3">
          {googleUser ? (
            <div className="flex items-center gap-3 bg-slate-950/50 p-2 pl-3 pr-4 rounded-2xl border border-slate-800">
              <img
                src={googleUser.picture || 'https://api.dicebear.com/7.x/identicon/svg?seed=' + googleUser.email}
                alt="Avatar"
                className="w-8 h-8 rounded-full border border-pink-500/40"
              />
              <div className="text-left">
                <p className="text-[10px] font-bold text-slate-400 font-mono leading-none">Active Operator</p>
                <p className="text-xs text-[#00f0ff] font-mono font-semibold truncate max-w-[150px]">{googleUser.email}</p>
              </div>
              <button
                onClick={onDisconnect}
                title="Disconnect Account"
                className="p-1.5 hover:bg-rose-500/10 hover:text-rose-400 text-slate-500 rounded-lg transition-colors ml-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onConnect}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-[#00f0ff] hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold font-mono tracking-wider rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center gap-2"
            >
              <Shield className="w-4 h-4 text-emerald-300" />
              <span>CONNECT REAL GMAIL</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs list selector */}
      <div className="flex border-b border-slate-800/40 gap-2 mb-6">
        <button
          onClick={() => setActiveTab('received')}
          className={`pb-3 px-4 text-xs font-bold font-mono uppercase tracking-widest border-b-2 transition-all ${
            activeTab === 'received'
              ? 'border-[#00f0ff] text-[#00f0ff]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          📬 Live Gmail Inbox
        </button>
        <button
          onClick={() => setActiveTab('simulated')}
          className={`pb-3 px-4 text-xs font-bold font-mono uppercase tracking-widest border-b-2 transition-all ${
            activeTab === 'simulated'
              ? 'border-pink-500 text-pink-500'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          📡 Simulated Receipts ({adminInbox.length})
        </button>
        <button
          onClick={() => setActiveTab('compose')}
          className={`pb-3 px-4 text-xs font-bold font-mono uppercase tracking-widest border-b-2 transition-all ${
            activeTab === 'compose'
              ? 'border-indigo-500 text-indigo-500'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          ✏️ Compose Outbox
        </button>
      </div>

      {/* Content Rendering Block */}
      {activeTab === 'received' && (
        <div>
          {!googleToken ? (
            /* Locked state explanation card */
            <div className="py-16 text-center max-w-xl mx-auto space-y-6">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                <div className="relative p-6 bg-slate-900/80 border border-slate-800 rounded-full">
                  <Lock className="w-12 h-12 text-[#00f0ff] animate-bounce" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold font-mono uppercase tracking-widest text-slate-200">Gmail Sync Service Locked</h3>
                <p className="text-xs text-slate-400 font-mono leading-relaxed max-w-sm mx-auto">
                  To view real emails, trace purchase transcripts, and dispatch real receipts from your authenticated Gmail address, connect your Google account.
                </p>
              </div>
              <button
                onClick={onConnect}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 via-[#00f0ff] to-cyan-500 text-slate-950 font-black font-mono tracking-widest uppercase text-xs rounded-xl shadow-lg hover:brightness-110 transition-all flex items-center gap-2 mx-auto"
              >
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Sync with Google Workspace</span>
              </button>
            </div>
          ) : (
            /* Live Gmail Client Interface */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Folders and message list pane */}
              <div className="lg:col-span-5 space-y-4">
                
                {/* Search Bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    fetchGmailList();
                  }}
                  className="flex gap-2"
                >
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search mail: from, subject, to..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl py-2 pl-9 pr-4 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#00f0ff]/40"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          fetchGmailList(activeLabel, '');
                        }}
                        className="absolute right-3 top-2.5 hover:text-white text-slate-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-[#00f0ff] rounded-xl text-xs font-mono"
                  >
                    Go
                  </button>
                </form>

                {/* Folder Labels Filter Bar */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'INBOX', label: 'Inbox' },
                    { id: 'SENT', label: 'Sent' },
                    { id: 'STARRED', label: 'Starred' },
                    { id: 'UNREAD', label: 'Unread' },
                    { id: 'ALL', label: 'All Mail' }
                  ].map((folder) => (
                    <button
                      key={folder.id}
                      onClick={() => {
                        setActiveLabel(folder.id);
                        setSelectedMsgId(null);
                        setFullMessage(null);
                        // fetch gets triggered by useEffect on activeLabel change
                      }}
                      className={`text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-md border transition-all ${
                        activeLabel === folder.id
                          ? 'bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/30 shadow'
                          : 'bg-slate-950/25 border-slate-800/60 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {folder.label}
                    </button>
                  ))}
                  <button
                    onClick={() => fetchGmailList()}
                    title="Refresh List"
                    disabled={loadingList}
                    className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-all ml-auto"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingList ? 'animate-spin text-[#00f0ff]' : ''}`} />
                  </button>
                </div>

                {/* Messages scroll list */}
                <div className="space-y-2 overflow-y-auto max-h-[400px] pr-1 scrollbar-thin">
                  {loadingList ? (
                    <div className="text-center py-16 space-y-3">
                      <RefreshCw className="w-8 h-8 text-[#00f0ff] animate-spin mx-auto" />
                      <p className="text-xs font-mono text-slate-500 animate-pulse">Syncing heavy mail payload...</p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl">
                      <Inbox className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                      <p className="text-xs font-mono text-slate-500">No transmissions found in {activeLabel}</p>
                    </div>
                  ) : (
                    messages.map((mail) => (
                      <div
                        key={mail.id}
                        onClick={() => setSelectedMsgId(mail.id)}
                        className={`p-3 rounded-xl border cursor-pointer text-left transition-all relative overflow-hidden ${
                          selectedMsgId === mail.id
                            ? 'bg-slate-900 border-[#00f0ff]/40 shadow-md shadow-[#00f0ff]/5'
                            : 'bg-slate-950/40 border-slate-900 hover:bg-slate-950/80 hover:border-slate-800'
                        }`}
                      >
                        {mail.labels.includes('UNREAD') && (
                          <div className="absolute right-2 top-2 w-1.5 h-1.5 bg-[#00f0ff] rounded-full"></div>
                        )}
                        <div className="flex justify-between items-center text-[9px] font-mono text-slate-500">
                          <span className="truncate max-w-[130px] font-bold text-slate-400">{mail.from}</span>
                          <span className="flex-shrink-0">{mail.date}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-200 mt-1 truncate">{mail.subject || '(No Subject)'}</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{mail.snippet}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Message detail reader pane */}
              <div className="lg:col-span-7 pl-2 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-800/50 pt-6 lg:pt-0">
                {loadingDetail ? (
                  <div className="text-center py-24 space-y-3 h-full flex flex-col justify-center">
                    <RefreshCw className="w-10 h-10 text-indigo-400 animate-spin mx-auto" />
                    <p className="text-xs font-mono text-slate-400">De-compressing email payloads securely...</p>
                  </div>
                ) : !selectedMsgId ? (
                  <div className="text-center py-24 text-slate-500 h-full flex flex-col justify-center items-center space-y-2">
                    <Mail className="w-12 h-12 text-slate-800 animate-pulse" />
                    <p className="text-xs font-mono">Select an email to view full content decrypted.</p>
                  </div>
                ) : (
                  messages.find((m) => m.id === selectedMsgId) && (() => {
                    const mailMeta = messages.find((m) => m.id === selectedMsgId)!;
                    return (
                      <div className="space-y-4 text-left">
                        
                        {/* Header metadata details */}
                        <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-widest">REAL GMAIL INBOUND HEADER</span>
                            <h3 className="text-sm font-black text-white">{mailMeta.subject || '(No Subject)'}</h3>
                            <div className="text-[11px] text-slate-400 space-y-0.5 font-mono">
                              <p>From: <strong className="text-slate-200">{mailMeta.from}</strong></p>
                              <p>To: <strong className="text-slate-200">{mailMeta.to}</strong></p>
                            </div>
                          </div>
                          
                          {/* Reply / Trash Button strip */}
                          <div className="flex gap-2 self-start sm:self-center">
                            <button
                              onClick={() => handleReply(mailMeta.from, mailMeta.subject)}
                              className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5"
                            >
                              <Send className="w-3 h-3 rotate-45 -translate-y-0.5" />
                              <span>Reply</span>
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(mailMeta.id)}
                              className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg transition-all"
                              title="Move to Trash"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Decrypted HTML / text view wrapper */}
                        <div className="relative">
                          {fullMessage ? (
                            <iframe
                              srcDoc={
                                fullMessage.html ||
                                `<html>
                                  <body style="font-family: monospace; background-color: #05060b; color: #cbd5e1; padding: 20px; font-size: 13px; line-height: 1.6; white-space: pre-wrap; margin:0;">
                                    ${fullMessage.text}
                                  </body>
                                </html>`
                              }
                              title="Decrypted Mail Payload"
                              className="w-full h-[360px] border border-slate-800/80 rounded-2xl bg-slate-950/40 p-2"
                              sandbox="allow-same-origin"
                            />
                          ) : (
                            <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl text-xs font-mono text-slate-400">
                              Payload decrypted but contains no display content.
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono pt-1">
                          <span>Labels: {mailMeta.labels.filter(l => !l.startsWith('CATEGORY_')).join(', ')}</span>
                          <span>ID: {mailMeta.id.substring(0, 10)}...</span>
                        </div>

                      </div>
                    );
                  })()
                )}
              </div>

            </div>
          )}
        </div>
      )}

      {/* Simulated dispatch view */}
      {activeTab === 'simulated' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-slate-950/40 p-5 rounded-2xl border border-slate-900/60 shadow-xl min-h-[400px]">
          {/* List pane */}
          <div className="lg:col-span-1 border-r border-slate-900 pr-4 space-y-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-800/40 flex justify-between items-center">
              <span>Dispatched Inboxes</span>
              <span className="px-2 py-0.5 bg-pink-500/10 text-pink-400 rounded-full font-mono text-[9px]">
                {adminInbox.length} Logs
              </span>
            </h3>
            <div className="space-y-2 overflow-y-auto max-h-[350px]">
              {adminInbox.map((mail, idx) => (
                <div
                  key={mail.id}
                  onClick={() => {
                    (window as any).selectedMail = mail;
                    setActiveTab('simulated'); // re-render trick
                  }}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    (window as any).selectedMail?.id === mail.id || (!(window as any).selectedMail && idx === 0)
                      ? 'bg-slate-900 border-pink-500/40 shadow-sm'
                      : 'bg-slate-950/40 border-slate-900/60 hover:bg-slate-900/50'
                  }`}
                >
                  <div className="flex justify-between items-start text-[9px] text-slate-500 font-mono">
                    <span>To: {mail.to}</span>
                    <span>{mail.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-200 mt-1 truncate">{mail.subject}</h4>
                  <p className="text-[10px] text-slate-400 mt-1 truncate">Sender: {mail.from}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Detail pane */}
          <div className="lg:col-span-2 pl-2 flex flex-col justify-between">
            {(() => {
              const mail = (window as any).selectedMail || adminInbox[0];
              if (!mail) {
                return (
                  <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 py-16">
                    <Mail className="w-12 h-12 text-slate-800 animate-pulse" />
                    <p className="text-xs font-mono mt-3">No email receipts logs. Checkout machinery items to record dispatch loops.</p>
                  </div>
                );
              }
              return (
                <div className="space-y-4 text-left">
                  <div className="border-b border-slate-800 pb-3">
                    <span className="text-[9px] font-mono text-pink-500 block">AUTOMATED RECEIPT INTERCEPT DESK</span>
                    <h3 className="text-sm font-black text-white mt-1">{mail.subject}</h3>
                    <div className="flex justify-between items-center text-xs text-slate-400 mt-2">
                      <span>From: <strong className="text-slate-200">{mail.from}</strong></span>
                      <span>To: <strong className="text-slate-200">{mail.to}</strong></span>
                    </div>
                  </div>
                  <div 
                    className="p-4 bg-slate-950/40 rounded-2xl border border-slate-900/80 max-h-[300px] overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: mail.body }}
                  />
                  <div className="text-[9px] font-mono text-slate-600">
                    *Note: Intercepted telemetry represents the structured simulated body queued in cache database.
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Compose Form */}
      {activeTab === 'compose' && (
        <div className="max-w-3xl mx-auto">
          {!googleToken ? (
            /* Compose Locked state card */
            <div className="py-16 text-center max-w-xl mx-auto space-y-6">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                <div className="relative p-6 bg-slate-900/80 border border-slate-800 rounded-full">
                  <Lock className="w-12 h-12 text-indigo-400 animate-bounce" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold font-mono uppercase tracking-widest text-slate-200">Compose Real Outbox Locked</h3>
                <p className="text-xs text-slate-400 font-mono leading-relaxed max-w-sm mx-auto">
                  Connecting your real Gmail account allows you to compose and transmit real HTML emails to client addresses globally.
                </p>
              </div>
              <button
                onClick={onConnect}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-black font-mono tracking-widest uppercase text-xs rounded-xl shadow-lg hover:brightness-110 transition-all flex items-center gap-2 mx-auto"
              >
                <span>Connect Google Account</span>
              </button>
            </div>
          ) : (
            /* Compose Editor Form layout */
            <div className="space-y-5 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/50 p-3 rounded-2xl border border-slate-900/60">
                <span className="text-xs font-black font-mono text-slate-400 uppercase tracking-widest">
                  Quick Load Corporate Templates:
                </span>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => applyTemplate('receipt')}
                    className="px-3 py-1 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white text-slate-300 rounded-lg text-[10px] font-mono transition-all"
                  >
                    ⚙️ Purchase Receipt
                  </button>
                  <button
                    onClick={() => applyTemplate('logistic')}
                    className="px-3 py-1 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white text-slate-300 rounded-lg text-[10px] font-mono transition-all"
                  >
                    🚚 Logistic Trace
                  </button>
                  <button
                    onClick={() => applyTemplate('followup')}
                    className="px-3 py-1 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white text-slate-300 rounded-lg text-[10px] font-mono transition-all"
                  >
                    ✉️ Support Trace
                  </button>
                </div>
              </div>

              {/* Compose Inputs */}
              <div className="space-y-3 font-mono">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Recipient Address (To):</label>
                  <input
                    type="email"
                    placeholder="recipient@domain.com"
                    value={composeTo}
                    onChange={(e) => setComposeTo(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#00f0ff]/40"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Subject Heading:</label>
                  <input
                    type="text"
                    placeholder="Subject of the corporate transmission..."
                    value={composeSubject}
                    onChange={(e) => setComposeSubject(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#00f0ff]/40"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Message Body (HTML wrap applied):</label>
                    <span className="text-[8px] text-indigo-400 font-bold tracking-widest">REAL GMAIL TRANSMIT CLIENT</span>
                  </div>
                  <textarea
                    rows={8}
                    placeholder="Write your email here. Standard plain text formatting is converted into beautiful styled templates on send."
                    value={composeBody}
                    onChange={(e) => setComposeBody(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#00f0ff]/40 leading-relaxed font-sans"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setComposeTo('');
                    setComposeSubject('');
                    setComposeBody('');
                    triggerToast('Cleared outbox workspace.', 'success');
                  }}
                  className="px-4 py-2.5 bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-slate-200 text-xs font-bold font-mono rounded-xl transition-all"
                >
                  Clear Fields
                </button>
                <button
                  type="button"
                  onClick={() => setShowSendConfirm(true)}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-[#00f0ff] text-white text-xs font-black font-mono tracking-widest uppercase rounded-xl shadow-lg hover:brightness-110 transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4 rotate-45 -translate-y-0.5" />
                  <span>Transmit Email</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal: Delete email */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-950 border border-rose-500/30 p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-sm font-black uppercase tracking-wider font-mono">Delete Transmission?</h3>
            </div>
            <p className="text-xs font-mono text-slate-400 leading-relaxed">
              Are you sure you want to move this email transaction ID <span className="text-slate-200 font-bold">{showDeleteConfirm.substring(0, 10)}...</span> to your Gmail account's Trash bin?
            </p>
            <div className="flex justify-end gap-3 pt-2 font-mono">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-[10px] uppercase font-black text-slate-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteMessage(showDeleteConfirm)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[10px] uppercase font-black"
              >
                Move to Trash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Send Outbound Real Email */}
      {showSendConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-950 border border-[#00f0ff]/30 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 text-[#00f0ff]">
              <Shield className="w-6 h-6 shrink-0" />
              <h3 className="text-sm font-black uppercase tracking-wider font-mono">Verify Real Transmission</h3>
            </div>
            <div className="space-y-3 font-mono text-xs">
              <p className="text-slate-400 leading-relaxed">
                As a secure, high-integrity action, you are about to transmit a real email via the Google Gmail API to the specified address:
              </p>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5 text-slate-300">
                <p><span className="text-slate-500">From Account:</span> <span className="text-indigo-400">{googleUser?.email}</span></p>
                <p><span className="text-slate-500">Recipient (To):</span> <span className="text-[#00f0ff] font-bold">{composeTo}</span></p>
                <p><span className="text-slate-500">Subject:</span> <span className="text-slate-100">{composeSubject}</span></p>
              </div>
              <p className="text-[10px] text-amber-500 leading-relaxed font-bold">
                *Notice: This will use your real authenticated email credit and send an official HTML formatted transmission.
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-2 font-mono">
              <button
                onClick={() => setShowSendConfirm(false)}
                disabled={isSending}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-[10px] uppercase font-black text-slate-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                disabled={isSending}
                className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-[#00f0ff] text-slate-950 font-black rounded-lg text-[10px] uppercase tracking-widest flex items-center gap-1.5"
              >
                {isSending ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Transmitting...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5 text-slate-950" />
                    <span>Confirm & Send</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
