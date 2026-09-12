import { useState, useEffect, useCallback } from 'react';
import {
  HiGlobeAlt,
  HiTrash,
  HiPlay,
  HiKey,
  HiPlus,
  HiInformationCircle,
  HiClipboardCopy,
} from 'react-icons/hi';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Badge } from './ui/Badge';
import { Modal, ModalHeader, ModalContent, ModalFooter } from './ui/Modal';
import { EmptyState } from './ui/EmptyState';

const AVAILABLE_EVENTS = [
  { id: '*', label: 'All Events (*)' },
  { id: 'order.created', label: 'Order Created (order.created)' },
  { id: 'order.status_updated', label: 'Order Status Updated (order.status_updated)' },
  { id: 'order.delivered', label: 'Order Delivered (order.delivered)' },
  { id: 'dispute.created', label: 'Dispute Filed (dispute.created)' },
  { id: 'dispute.resolved', label: 'Dispute Arbitrated (dispute.resolved)' },
  { id: 'document.verified', label: 'Document Verified (document.verified)' },
];

export const WebhooksManager = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [testingId, setTestingId] = useState(null);
  const [revealedSecrets, setRevealedSecrets] = useState({});

  const [formData, setFormData] = useState({
    url: '',
    description: '',
    events: ['*'],
  });

  const fetchWebhooks = useCallback(async () => {
    try {
      const res = await api.get('/webhooks');
      setSubscriptions(Array.isArray(res.data) ? res.data : []);
    } catch {
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWebhooks();
  }, [fetchWebhooks]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.url) return;

    setSubmitting(true);
    try {
      await api.post('/webhooks', formData);
      toast.success('Webhook endpoint registered successfully');
      setCreateModalOpen(false);
      setFormData({ url: '', description: '', events: ['*'] });
      fetchWebhooks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register webhook endpoint');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/webhooks/${id}`);
      toast.success('Webhook subscription removed');
      setSubscriptions((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete webhook');
    }
  };

  const handleTestPing = async (id) => {
    setTestingId(id);
    try {
      const res = await api.post(`/webhooks/${id}/test`);
      if (res.data?.result?.success) {
        toast.success(`Ping acknowledged: HTTP ${res.data.result.statusCode}`);
      } else {
        toast.error(`Ping failed: ${res.data?.result?.error || 'Target returned error'}`);
      }
      fetchWebhooks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Ping failed to transmit');
    } finally {
      setTestingId(null);
    }
  };

  const toggleRevealSecret = (id) => {
    setRevealedSecrets((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const toggleEventSelection = (eventId) => {
    if (eventId === '*') {
      setFormData({ ...formData, events: ['*'] });
      return;
    }
    const current = formData.events.filter((e) => e !== '*');
    const updated = current.includes(eventId)
      ? current.filter((e) => e !== eventId)
      : [...current, eventId];

    setFormData({
      ...formData,
      events: updated.length === 0 ? ['*'] : updated,
    });
  };

  return (
    <div className="space-y-4">
      {/* Header & Action */}
      <div className="flex items-center justify-between gap-3 p-3.5 rounded-lg border border-border-default bg-surface">
        <div>
          <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <HiGlobeAlt className="w-4 h-4 text-accent-primary" />
            Outbound Webhook Subscriptions
          </h3>
          <p className="text-[11px] text-foreground-muted mt-0.5">
            Stream cryptographically signed JSON events into your ERP, TMS, or custom backend.
          </p>
        </div>
        <Button size="sm" onClick={() => setCreateModalOpen(true)} className="h-8 text-xs">
          <HiPlus className="w-3.5 h-3.5 mr-1" />
          Add Endpoint
        </Button>
      </div>

      {/* Subscriptions List */}
      {loading ? (
        <div className="space-y-2">
          {[0, 1].map((i) => (
            <div key={i} className="h-24 rounded-lg border border-border-default bg-surface animate-pulse" />
          ))}
        </div>
      ) : subscriptions.length === 0 ? (
        <EmptyState
          icon={HiGlobeAlt}
          title="No Webhook Endpoints Configured"
          description="Register an HTTPS endpoint to automatically receive signed trade events for purchase orders, customs milestones, and dispute filings."
          action={
            <Button size="sm" onClick={() => setCreateModalOpen(true)}>
              Register Webhook
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {subscriptions.map((sub) => {
            const isRevealed = Boolean(revealedSecrets[sub._id]);
            const isTesting = testingId === sub._id;

            return (
              <div
                key={sub._id}
                className="p-4 rounded-lg border border-border-default bg-surface space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-foreground truncate">
                        {sub.url}
                      </span>
                      <Badge variant={sub.isActive ? 'success' : 'neutral'} size="sm">
                        {sub.isActive ? 'Active' : 'Disabled'}
                      </Badge>
                      {sub.lastDeliveryStatus !== null && (
                        <Badge
                          variant={sub.lastDeliveryStatus >= 200 && sub.lastDeliveryStatus < 300 ? 'success' : 'danger'}
                          size="sm"
                        >
                          Last HTTP {sub.lastDeliveryStatus}
                        </Badge>
                      )}
                    </div>
                    {sub.description && (
                      <p className="text-[11px] text-foreground-muted mt-0.5">{sub.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestPing(sub._id)}
                      disabled={isTesting}
                      className="h-7 text-xs"
                    >
                      <HiPlay className="w-3 h-3 mr-1 text-accent-primary" />
                      {isTesting ? 'Pinging...' : 'Test Ping'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(sub._id)}
                      className="h-7 text-xs text-status-danger hover:bg-status-danger-bg"
                    >
                      <HiTrash className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Subscribed Events */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] uppercase font-semibold text-foreground-muted tracking-wider mr-1">
                    Events:
                  </span>
                  {sub.events?.map((evt) => (
                    <span
                      key={evt}
                      className="px-1.5 py-0.5 rounded bg-surface-subtle border border-border-subtle text-[10px] font-mono text-foreground"
                    >
                      {evt}
                    </span>
                  ))}
                </div>

                {/* Secret Key Display */}
                <div className="flex items-center justify-between p-2 rounded bg-surface-subtle border border-border-subtle text-xs">
                  <div className="flex items-center gap-2 font-mono text-[11px] text-foreground-muted">
                    <HiKey className="w-3.5 h-3.5 text-accent-primary shrink-0" />
                    <span>Signing Secret:</span>
                    <span className="text-foreground font-semibold">
                      {isRevealed ? sub.secret : `${sub.secret.slice(0, 8)}••••••••••••••••••••`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleRevealSecret(sub._id)}
                      className="h-6 px-2 text-[10px]"
                    >
                      {isRevealed ? 'Hide' : 'Reveal'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(sub.secret, 'Webhook signing secret')}
                      className="h-6 px-2 text-[10px]"
                    >
                      <HiClipboardCopy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Last Delivery Status */}
                {sub.lastDeliveryAt && (
                  <div className="text-[10px] text-foreground-muted flex items-center gap-2">
                    <span>Last event dispatch: {new Date(sub.lastDeliveryAt).toLocaleString()}</span>
                    {sub.failureCount > 0 && (
                      <span className="text-status-danger font-medium">
                        ({sub.failureCount} failed deliveries)
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Developer Security Guidance Card */}
      <div className="p-3.5 rounded-lg border border-border-default bg-surface-subtle/40 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
          <HiInformationCircle className="w-4 h-4 text-accent-primary" />
          Enterprise HMAC-SHA256 Signature Verification
        </div>
        <p className="text-[11px] text-foreground-muted leading-relaxed">
          Every HTTP POST from IEHUB contains an <code className="text-accent-primary font-mono font-semibold">X-IEHUB-Signature</code> header.
          Compute the HMAC-SHA256 of <code className="font-mono text-foreground">{'{timestamp}.{raw_body}'}</code> using your endpoint secret and compare in constant time to prevent replay attacks and forgery.
        </p>
      </div>

      {/* Register Webhook Modal */}
      {createModalOpen && (
        <Modal open={createModalOpen} onClose={() => setCreateModalOpen(false)} maxWidth="max-w-lg">
          <ModalHeader
            title="Register Outbound Webhook"
            description="Configure an endpoint to receive automated real-time trade updates."
          />
          <form onSubmit={handleCreate}>
            <ModalContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Payload URL (HTTPS Required in Production) *
                </label>
                <Input
                  required
                  type="url"
                  placeholder="https://erp.yourdomain.com/webhooks/iehub"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Description / Destination System
                </label>
                <Input
                  placeholder="e.g. NetSuite ERP Trade Syncer"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground block">
                  Subscribed Event Topics
                </label>
                <div className="space-y-1.5 border border-border-default rounded-md p-2.5 max-h-48 overflow-y-auto bg-surface-subtle">
                  {AVAILABLE_EVENTS.map((evt) => {
                    const isChecked = formData.events.includes(evt.id);
                    return (
                      <label
                        key={evt.id}
                        className="flex items-center gap-2 text-xs text-foreground cursor-pointer hover:bg-surface p-1 rounded transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleEventSelection(evt.id)}
                          className="rounded border-border-default text-accent-primary focus:ring-accent-primary"
                        />
                        <span className="font-mono text-[11px]">{evt.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </ModalContent>
            <ModalFooter>
              <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting || !formData.url}>
                {submitting ? 'Registering...' : 'Save Webhook Endpoint'}
              </Button>
            </ModalFooter>
          </form>
        </Modal>
      )}
    </div>
  );
};
