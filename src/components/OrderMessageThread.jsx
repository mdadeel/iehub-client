import React, { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import {
  HiPaperAirplane,
  HiChatAlt2,
  HiDocumentText,
  HiDownload,
  HiRefresh,
  HiUser,
  HiShieldCheck,
} from 'react-icons/hi';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

export default function OrderMessageThread({ orderId, poNumber, className = '' }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [vaultDocs, setVaultDocs] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState('');
  const messagesEndRef = useRef(null);

  const fetchMessages = useCallback(async () => {
    if (!orderId) return;
    try {
      const res = await api.get(`/imports/${orderId}/messages`);
      setMessages(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to load order messages', err);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  const fetchVaultDocs = useCallback(async () => {
    try {
      const res = await api.get('/documents');
      setVaultDocs(Array.isArray(res.data) ? res.data : []);
    } catch {
      setVaultDocs([]);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
    fetchVaultDocs();
  }, [fetchMessages, fetchVaultDocs]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setSending(true);
    try {
      const payload = {
        message: inputText.trim(),
        documentId: selectedDocId || undefined,
      };

      const res = await api.post(`/imports/${orderId}/messages`, payload);
      setMessages((prev) => [...prev, res.data]);
      setInputText('');
      setSelectedDocId('');
      toast.success('Message posted to trade ledger');
    } catch (err) {
      console.error('Failed to send message', err);
      toast.error(err.response?.data?.message || 'Failed to transmit message');
    } finally {
      setSending(false);
    }
  };

  const handleDownloadAttachment = async (docId, fallbackName = 'document.pdf') => {
    try {
      const res = await api.get(`/documents/${docId}/download-url`);
      const link = document.createElement('a');
      link.href = res.data.presignedGetUrl;
      link.download = res.data.fileName || fallbackName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      toast.error('Failed to download attached document');
    }
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'Buyer':
        return 'accent';
      case 'Supplier':
        return 'warning';
      case 'Admin':
        return 'success';
      default:
        return 'neutral';
    }
  };

  return (
    <div className={`flex flex-col border border-border-default rounded-xl bg-surface overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-default bg-surface-subtle/50">
        <div className="flex items-center gap-2">
          <HiChatAlt2 className="w-4 h-4 text-accent-primary" />
          <span className="text-xs font-semibold text-foreground">
            Bilateral Trade Thread
          </span>
          {poNumber && (
            <span className="text-[11px] font-mono text-foreground-muted">
              ({poNumber})
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchMessages}
          disabled={loading}
          className="h-6 w-6 p-0 text-foreground-muted hover:text-foreground"
          title="Refresh messages"
        >
          <HiRefresh className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Message Feed */}
      <div className="p-4 space-y-3 min-h-[160px] max-h-[260px] overflow-y-auto">
        {loading ? (
          <div className="py-6 text-center text-xs text-foreground-muted animate-pulse">
            Loading order communication thread...
          </div>
        ) : messages.length === 0 ? (
          <div className="py-8 text-center text-xs text-foreground-muted">
            <HiChatAlt2 className="w-8 h-8 mx-auto text-foreground-muted/40 mb-1" />
            No messages posted yet. Exchange delivery queries, inspection notes, or customs remarks below.
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.senderEmail === user?.email;
            return (
              <div
                key={msg._id || idx}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 mb-0.5 text-[10px] text-foreground-muted">
                  <Badge variant={getRoleBadgeVariant(msg.senderRole)} size="sm">
                    {msg.senderRole}
                  </Badge>
                  <span className="font-medium text-foreground-secondary">{msg.senderEmail}</span>
                  <span>&bull;</span>
                  <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                <div
                  className={`rounded-lg px-3 py-2 text-xs max-w-[85%] break-words ${
                    isMe
                      ? 'bg-accent-primary text-white rounded-br-xs'
                      : 'bg-surface-subtle text-foreground border border-border-subtle rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.message}</p>

                  {/* Attached Document Chip */}
                  {msg.documentId && (
                    <div
                      onClick={() => handleDownloadAttachment(msg.documentId._id || msg.documentId, msg.documentId.fileName)}
                      className={`mt-2 flex items-center gap-1.5 px-2 py-1 rounded text-[11px] cursor-pointer transition-colors ${
                        isMe
                          ? 'bg-white/15 hover:bg-white/25 text-white'
                          : 'bg-surface hover:bg-surface-hover border border-border-default text-accent-primary'
                      }`}
                    >
                      <HiDocumentText className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate max-w-[160px]">
                        {msg.documentId.fileName || 'Attached Document'}
                      </span>
                      <HiDownload className="w-3 h-3 shrink-0 ml-auto" />
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-border-default bg-surface space-y-2">
        {/* Optional Document Attachment Selector */}
        {vaultDocs.length > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[10px] font-semibold text-foreground-muted uppercase tracking-wider">
              Attach Vault Doc:
            </span>
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="text-[11px] rounded border border-border-default bg-surface px-2 py-0.5 text-foreground focus:outline-none focus:ring-1 focus:ring-accent-primary max-w-xs truncate"
            >
              <option value="">None (Text only)</option>
              {vaultDocs.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.documentType}: {doc.fileName}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a trade update, dispatch notice, or operational note..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={sending}
            className="flex-1 text-xs rounded-md border border-border-default bg-surface px-3 py-1.5 text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-1 focus:ring-accent-primary"
          />
          <Button
            type="submit"
            size="sm"
            disabled={!inputText.trim() || sending}
            className="shrink-0 gap-1 h-8"
          >
            <HiPaperAirplane className="w-3 h-3 rotate-90" />
            <span>{sending ? 'Sending...' : 'Send'}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
