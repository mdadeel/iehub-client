import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import {
  HiArrowLeft,
  HiShieldCheck,
  HiDocumentText,
  HiChevronDown,
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Sheet, SheetHeader, SheetContent, SheetFooter } from '../components/ui/Sheet';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showCertificates, setShowCertificates] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [incoterm, setIncoterm] = useState('FOB');
  const [destinationPort, setDestinationPort] = useState('SGSIN (Port of Singapore)');
  const [paymentTerms, setPaymentTerms] = useState('Confirmed Letter of Credit (LC)');
  const [laycanWindow, setLaycanWindow] = useState('15 Oct 2026 – 30 Oct 2026');
  const [contractNotes, setContractNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // RFQ state
  const [rfqDrawerOpen, setRfqDrawerOpen] = useState(false);
  const [rfqQuantity, setRfqQuantity] = useState(1);
  const [rfqTargetPrice, setRfqTargetPrice] = useState('');
  const [rfqPort, setRfqPort] = useState('SGSIN (Port of Singapore)');
  const [rfqDeliveryWindow, setRfqDeliveryWindow] = useState('Within 30 Days');
  const [rfqNotes, setRfqNotes] = useState('');
  const [rfqSubmitting, setRfqSubmitting] = useState(false);

  const fetchProduct = useCallback(async () => {
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
      const moq = Math.max(1, data?.moq || 1);
      if (data?.quantity) {
        setQuantity(Math.min(moq, data.quantity));
      }
    } catch {
      toast.error('Unable to locate commodity listing.');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleCreatePurchaseOrder = async (e) => {
    e.preventDefault();
    if (!product) return;
    if (quantity < moq || quantity > product.quantity) return;

    setSubmitting(true);
    try {
      await api.post('/imports', {
        productId: product._id,
        quantity: Number(quantity),
        userId: user.uid,
        userEmail: user.email,
        incoterm,
        destinationPort,
        paymentTerms,
        laycanWindow,
        contractNotes,
      });

      toast.success(`Purchase Order issued: ${quantity} ${product.unit || 'units'} under ${incoterm} terms.`);
      setDrawerOpen(false);
      fetchProduct();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to authorize purchase order.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateRFQ = async (e) => {
    e.preventDefault();
    if (!product) return;
    setRfqSubmitting(true);
    try {
      await api.post('/rfq', {
        productId: product._id,
        targetPrice: Number(rfqTargetPrice || product.price),
        requestedQuantity: Number(rfqQuantity),
        targetPort: rfqPort,
        requestedDeliveryWindow: rfqDeliveryWindow,
        notes: rfqNotes,
      });
      toast.success('Request for Quotation transmitted to exporter.');
      setRfqDrawerOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit RFQ.');
    } finally {
      setRfqSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas pb-20">
        <div className="container py-8 max-w-6xl">
          <div className="h-5 w-40 mb-6 rounded bg-surface-subtle animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 h-80 rounded-lg bg-surface-subtle animate-pulse" />
            <div className="lg:col-span-7 space-y-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-20 rounded-lg bg-surface-subtle animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const moq = Math.max(1, product.moq || 1);
  const unitPrice = product.price || 0;
  const totalValue = unitPrice * quantity;
  const isOutOfStock = (product.quantity || 0) < 1;
  const isVerified = product.verificationStatus === 'verified';
  const certificates = Array.isArray(product.certificates) ? product.certificates : [];

  return (
    <div className="min-h-screen bg-canvas pb-20">
      <div className="container py-8 max-w-6xl">
        {/* Navigation Breadcrumb */}
        <button
          onClick={() => navigate('/products')}
          className="inline-flex items-center gap-1.5 text-xs text-foreground-muted hover:text-foreground mb-6 transition-colors"
        >
          <HiArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Marketplace</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Visual & Seller */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="overflow-hidden border border-border-default bg-surface shadow-2xs">
              <div className="aspect-[4/3] relative bg-surface-subtle overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="neutral" size="sm">
                    {product.category}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge
                    variant={isOutOfStock ? 'danger' : 'success'}
                    size="sm"
                    hasDot
                  >
                    {isOutOfStock ? 'Out of Stock' : `${product.quantity?.toLocaleString()} ${product.unit || 'Units'} Available`}
                  </Badge>
                </div>
              </div>

              <div className="p-3 bg-surface-subtle/50 border-t border-border-subtle flex items-center justify-between text-xs">
                {isVerified ? (
                  <div className="flex items-center gap-1.5 text-foreground-secondary">
                    <HiShieldCheck className="w-4 h-4 text-status-success" />
                    <span className="font-medium">{product.verificationBadge || 'Verified'}</span>
                  </div>
                ) : (
                  <span className="text-foreground-muted">Verification: {product.verificationStatus || 'Pending'}</span>
                )}
                <span className="font-mono text-[11px] text-foreground-muted uppercase">
                  SKU-{String(product._id).slice(-8).toUpperCase()}
                </span>
              </div>
            </Card>

            {/* Seller / Exporter Card */}
            {product.exporterEmail && (
              <Card className="p-4 border border-border-default bg-surface">
                <div className="text-[11px] uppercase font-mono tracking-wider text-foreground-muted mb-2">
                  Registered Exporter
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-foreground truncate">
                    {product.exporterEmail}
                  </div>
                  {isVerified && (
                    <Badge variant="accent" size="sm" hasDot>
                      Verified Exporter
                    </Badge>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column: Specification & Purchase Action */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-foreground-muted mb-2 flex-wrap">
                <span>{product.category} &bull; {product.origin || 'Global'}</span>
                <Badge variant="accent" size="sm" className="font-mono text-[10px]">
                  HS: {product.hsCode || 'Standard Tariff'}
                </Badge>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3">
                {product.name}
              </h1>

              <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed">
                {product.description ||
                  'Export-grade commodity. Contact the trade desk for full specification sheets before ordering.'}
              </p>
            </div>

            {/* Pricing & Terms */}
            <div className="p-5 rounded-lg border border-border-default bg-surface-subtle/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-foreground-muted mb-0.5">
                  FOB Base Price
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums">
                    ${product.price?.toLocaleString()}
                  </span>
                  <span className="text-xs text-foreground-muted font-mono">USD / {product.unit || 'unit'}</span>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <div className="text-[10px] uppercase font-mono tracking-wider text-foreground-muted mb-0.5">
                  Available Supply
                </div>
                <div className="text-sm font-semibold text-foreground tabular-nums">
                  {product.quantity?.toLocaleString()} {product.unit || 'Units'}
                </div>
                <div className="text-[11px] text-foreground-muted">
                  MOQ: {moq.toLocaleString()} {product.unit || 'Unit'}
                </div>
              </div>
            </div>

            {/* Certificates — collapsed accordion, only when real data exists */}
            {certificates.length > 0 && (
              <div className="rounded-lg border border-border-default bg-surface overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowCertificates((s) => !s)}
                  className="w-full flex items-center justify-between px-4 py-3 text-xs font-semibold text-foreground hover:bg-surface-hover/60 transition-colors"
                  aria-expanded={showCertificates}
                >
                  <span className="flex items-center gap-2">
                    <HiDocumentText className="w-4 h-4 text-foreground-muted" />
                    Certificates ({certificates.length})
                  </span>
                  <HiChevronDown className={`w-4 h-4 text-foreground-muted transition-transform ${showCertificates ? 'rotate-180' : ''}`} />
                </button>
                {showCertificates && (
                  <div className="px-4 pb-3 grid grid-cols-1 gap-2">
                    {certificates.map((c, i) => (
                      <div key={i} className="flex items-center justify-between gap-2 p-2.5 rounded border border-border-subtle bg-surface-subtle text-xs">
                        <span className="font-medium text-foreground truncate">{c.name}</span>
                        <span className="text-[11px] text-foreground-muted shrink-0">{c.issuer}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Primary & RFQ Actions */}
            <div className="pt-4 border-t border-border-subtle flex flex-col gap-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <Button
                  onClick={() => {
                    if (!user) {
                      toast.error('Please sign in to issue purchase orders');
                      navigate('/login', { state: { from: { pathname: `/products/${id}` } } });
                      return;
                    }
                    setDrawerOpen(true);
                  }}
                  disabled={isOutOfStock}
                  size="lg"
                  className="w-full h-11 text-xs font-semibold"
                >
                  {isOutOfStock ? 'Out of Stock' : 'Authorize Purchase Order'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (!user) {
                      toast.error('Please sign in to request quotations');
                      navigate('/login', { state: { from: { pathname: `/products/${id}` } } });
                      return;
                    }
                    setRfqQuantity(moq);
                    setRfqTargetPrice(product.price);
                    setRfqDrawerOpen(true);
                  }}
                  size="lg"
                  className="w-full h-11 text-xs font-semibold"
                >
                  Request Quotation (RFQ)
                </Button>
              </div>
              <Link
                to="/contact"
                className="text-xs text-foreground-muted hover:text-foreground hover:underline text-center"
              >
                Questions about this listing? Contact the trade desk
              </Link>
              <p className="text-[11px] text-foreground-muted text-center">
                Incoterms 2020 &bull; PO issued instantly &bull; Track progress from your dashboard
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Slide-over Purchase Order Drawer */}
      <Sheet open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <SheetHeader
          title="Create Purchase Order"
          description={`Issuing standard import request for ${product.name}`}
          onClose={() => setDrawerOpen(false)}
        />

        <SheetContent>
          <form id="po-form" onSubmit={handleCreatePurchaseOrder} className="space-y-5">
            {/* Commodity Summary */}
            <div className="p-3 bg-surface-subtle rounded-lg border border-border-default flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-foreground line-clamp-1">{product.name}</div>
                <div className="text-[11px] text-foreground-muted">SKU-{String(product._id).slice(-6).toUpperCase()}</div>
              </div>
              <div className="text-right font-mono text-xs font-semibold text-foreground">
                ${product.price?.toLocaleString()} <span className="text-[10px] text-foreground-muted font-normal">/{product.unit || 'unit'}</span>
              </div>
            </div>

            {/* Quantity Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground">
                  Order Quantity ({product.unit || 'Units'})
                </label>
                <span className="text-[11px] text-foreground-muted tabular-nums">
                  MOQ {moq.toLocaleString()} &bull; Max {product.quantity?.toLocaleString()}
                </span>
              </div>
              <Input
                type="number"
                min={moq}
                max={product.quantity}
                value={quantity}
                onChange={(e) => {
                  const v = parseInt(e.target.value) || moq;
                  setQuantity(Math.min(Math.max(v, moq), product.quantity));
                }}
                className="h-9 text-xs"
                required
              />
            </div>

            {/* Incoterm Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Shipping Incoterm (ICC 2020)
              </label>
              <select
                value={incoterm}
                onChange={(e) => setIncoterm(e.target.value)}
                className="flex h-9 w-full rounded-md border border-border-default bg-surface px-3 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:border-accent-primary"
              >
                <option value="FOB">FOB — Free on Board (Origin Port)</option>
                <option value="CIF">CIF — Cost, Insurance & Freight</option>
                <option value="EXW">EXW — Ex Works (Factory Pickup)</option>
                <option value="DDP">DDP — Delivered Duty Paid</option>
              </select>
            </div>

            {/* Port of Destination (POD) */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Named Port of Destination (UN/LOCODE POD)
              </label>
              <Input
                value={destinationPort}
                onChange={(e) => setDestinationPort(e.target.value)}
                className="h-9 text-xs"
                placeholder="e.g. SGSIN (Port of Singapore) or USLAX"
                required
              />
            </div>

            {/* Payment Terms */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Payment Terms
              </label>
              <select
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="flex h-9 w-full rounded-md border border-border-default bg-surface px-3 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:border-accent-primary"
              >
                <option value="Confirmed Letter of Credit (LC)">Letter of Credit (LC)</option>
                <option value="30% Advance / 70% CAD">30% Advance / 70% CAD</option>
                <option value="Milestone Escrow (ICC Standard)">Milestone Escrow</option>
                <option value="Open Account / Net 30">Open Account (Net 30)</option>
              </select>
            </div>

            {/* Laycan Window */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Laycan Loading Window
              </label>
              <Input
                value={laycanWindow}
                onChange={(e) => setLaycanWindow(e.target.value)}
                className="h-9 text-xs"
                placeholder="e.g. 15 Oct 2026 – 30 Oct 2026"
              />
            </div>

            {/* Contract Stipulations & Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Inspection & Packaging Notes (Optional)
              </label>
              <textarea
                value={contractNotes}
                onChange={(e) => setContractNotes(e.target.value)}
                rows={2}
                className="flex w-full rounded-md border border-border-default bg-surface px-3 py-2 text-xs text-foreground placeholder:text-foreground-muted focus-visible:outline-none focus-visible:border-accent-primary resize-none"
                placeholder="e.g. Pre-shipment inspection required; desiccants in 40ft HC containers."
              />
            </div>

            {/* Financial Breakdown */}
            <div className="p-4 rounded-lg border border-border-default bg-surface space-y-2 text-xs">
              <div className="flex justify-between text-foreground-secondary">
                <span>Subtotal ({quantity} {product.unit || 'units'})</span>
                <span className="font-mono tabular-nums">${totalValue.toLocaleString()}</span>
              </div>
              <div className="border-t border-border-subtle pt-2 flex justify-between font-semibold text-foreground">
                <span>Total Commitment</span>
                <span className="font-mono text-accent-primary tabular-nums">${totalValue.toLocaleString()} USD</span>
              </div>
            </div>

            <p className="text-[11px] text-foreground-muted leading-relaxed">
              Upon authorization, stock is reserved from the seller's inventory and a purchase order reference is issued to your dashboard.
            </p>
          </form>
        </SheetContent>

        <SheetFooter>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setDrawerOpen(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="po-form"
            size="sm"
            disabled={submitting || quantity < moq || quantity > product.quantity}
          >
            {submitting ? 'Confirming Order...' : `Authorize Order ($${totalValue.toLocaleString()})`}
          </Button>
        </SheetFooter>
      </Sheet>

      {/* Slide-over RFQ Drawer */}
      <Sheet open={rfqDrawerOpen} onClose={() => setRfqDrawerOpen(false)}>
        <SheetHeader
          title="Request for Formal Quotation (RFQ)"
          description={`Submit custom pricing & delivery terms directly to ${product.exporterEmail || 'the exporter'}`}
          onClose={() => setRfqDrawerOpen(false)}
        />

        <SheetContent>
          <form id="rfq-form" onSubmit={handleCreateRFQ} className="space-y-4">
            <div className="p-3 bg-surface-subtle rounded-lg border border-border-default">
              <div className="text-xs font-semibold text-foreground line-clamp-1">{product.name}</div>
              <div className="text-[11px] text-foreground-muted font-mono">
                Catalog Listed Price: ${product.price?.toLocaleString()} USD / {product.unit || 'unit'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Requested Quantity ({product.unit || 'units'}) *</label>
                <Input
                  type="number"
                  min="1"
                  required
                  value={rfqQuantity}
                  onChange={(e) => setRfqQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="h-9 text-xs font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Target Bid Price ($ USD) *</label>
                <Input
                  type="number"
                  step="0.01"
                  required
                  placeholder={String(product.price)}
                  value={rfqTargetPrice}
                  onChange={(e) => setRfqTargetPrice(e.target.value)}
                  className="h-9 text-xs font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Target Discharge Port (POD)</label>
              <Input
                value={rfqPort}
                onChange={(e) => setRfqPort(e.target.value)}
                className="h-9 text-xs"
                placeholder="e.g. SGSIN (Port of Singapore)"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Requested Delivery Window</label>
              <Input
                value={rfqDeliveryWindow}
                onChange={(e) => setRfqDeliveryWindow(e.target.value)}
                className="h-9 text-xs"
                placeholder="e.g. Within 30 days of LC issuance"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Contractual Specifications & Notes</label>
              <textarea
                rows={3}
                value={rfqNotes}
                onChange={(e) => setRfqNotes(e.target.value)}
                placeholder="Specify moisture tolerance, packaging, or payment schedule requirements..."
                className="flex w-full rounded-md border border-border-default bg-surface px-3 py-2 text-xs text-foreground placeholder:text-foreground-muted focus-visible:outline-none focus-visible:border-accent-primary resize-none"
              />
            </div>

            <p className="text-[11px] text-foreground-muted leading-relaxed">
              Upon transmission, the seller will receive an alert in their Exporter Cockpit to either affirm your terms or submit a counter-offer.
            </p>
          </form>
        </SheetContent>

        <SheetFooter>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setRfqDrawerOpen(false)}
            disabled={rfqSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="rfq-form"
            size="sm"
            disabled={rfqSubmitting || !rfqTargetPrice}
          >
            {rfqSubmitting ? 'Transmitting RFQ...' : 'Transmit RFQ to Exporter'}
          </Button>
        </SheetFooter>
      </Sheet>
    </div>
  );
};

export default ProductDetailsPage;
