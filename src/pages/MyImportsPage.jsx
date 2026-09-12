import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  HiSearch,
  HiGlobeAlt,
  HiEye,
  HiTrash,
  HiCheckCircle,
  HiClipboardCopy,
  HiShieldCheck,
  HiScale,
  HiCurrencyDollar,
  HiExternalLink,
  HiRefresh,
  HiDownload,
  HiDocumentText,
  HiInformationCircle,
} from 'react-icons/hi';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Modal, ModalHeader, ModalContent, ModalFooter } from '../components/ui/Modal';
import { Sheet, SheetHeader, SheetContent, SheetFooter } from '../components/ui/Sheet';
import { DropdownMenu } from '../components/ui/DropdownMenu';
import OrderMessageThread from '../components/OrderMessageThread';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '../components/ui/Table';

const MILESTONES = [
  { id: 'Confirmed', label: 'PO Issued', desc: 'Legally binding order registered' },
  { id: 'Cargo Received', label: 'Port Origin', desc: 'Cargo consolidated at port of loading' },
  { id: 'Customs Clearance', label: 'Customs Cleared', desc: 'Export clearance & inspection passed' },
  { id: 'In Transit', label: 'In Ocean Transit', desc: 'Vessel en route to discharge port' },
  { id: 'Delivered', label: 'Consignee Delivery', desc: 'Customs released & landed at destination' },
];

const STATUS_SEQUENCE = ['Confirmed', 'Cargo Received', 'Customs Clearance', 'In Transit', 'Delivered'];

const MyImportsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [imports, setImports] = useState([]);
  const [filteredImports, setFilteredImports] = useState([]);
  const [myRFQs, setMyRFQs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Detail Sheet state
  const [activePO, setActivePO] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Cancellation dialog state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  // Dispute modal state
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [disputeData, setDisputeData] = useState({
    reason: 'Cargo Damage in Ocean Transit',
    disputedAmount: '',
    description: '',
  });
  const [filingDispute, setFilingDispute] = useState(false);

  // Escrow action states
  const [escrowLoading, setEscrowLoading] = useState(false);

  // Attached documents state
  const [attachedDocs, setAttachedDocs] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);

  // Delivery sign-off state
  const [deliveryModalOpen, setDeliveryModalOpen] = useState(false);
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [deliveryLoading, setDeliveryLoading] = useState(false);

  const fetchImportsAndRFQs = useCallback(async () => {
    if (!user?.email) return;
    try {
      setRefreshing(true);
      const [importsRes, rfqsRes] = await Promise.allSettled([
        api.get(`/imports/${encodeURIComponent(user.email)}`),
        api.get('/rfq?as=buyer'),
      ]);

      if (importsRes.status === 'fulfilled') {
        const list = Array.isArray(importsRes.value.data) ? importsRes.value.data : [];
        setImports(list);
        setFilteredImports(list);
      }
      if (rfqsRes.status === 'fulfilled') {
        setMyRFQs(Array.isArray(rfqsRes.value.data) ? rfqsRes.value.data : []);
      }
    } catch {
      toast.error('Unable to retrieve purchase order registry.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchImportsAndRFQs();
  }, [fetchImportsAndRFQs]);

  useEffect(() => {
    const results = imports.filter((item) => {
      const prod = item.productId || item;
      const name = prod.name || '';
      const origin = prod.origin || '';
      const poNum = item.poNumber || '';
      const pod = item.destinationPort || '';
      return (
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        poNum.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pod.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredImports(results);
  }, [searchTerm, imports]);

  const openCancelPrompt = (item) => {
    setOrderToCancel(item);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!orderToCancel) return;
    setCancelling(true);
    try {
      await api.patch(`/imports/${orderToCancel._id}/status`, { status: 'Cancelled' });
      setImports((prev) => prev.filter((i) => i._id !== orderToCancel._id));
      toast.success('Purchase order cancelled and reserved inventory released.');
      if (activePO?._id === orderToCancel._id) {
        setSheetOpen(false);
      }
      setCancelModalOpen(false);
    } catch {
      toast.error('Failed to cancel order.');
    } finally {
      setCancelling(false);
      setOrderToCancel(null);
    }
  };

  const handleFundEscrow = async (poId) => {
    setEscrowLoading(true);
    try {
      await api.patch(`/imports/${poId}/escrow-fund`);
      toast.success('Commercial escrow funded. Funds secured in platform vault.');
      fetchImportsAndRFQs();
      if (activePO?._id === poId) {
        setActivePO((p) => ({ ...p, escrowStatus: 'Funded' }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fund escrow.');
    } finally {
      setEscrowLoading(false);
    }
  };

  const handleReleaseEscrow = async (poId) => {
    setEscrowLoading(true);
    try {
      await api.patch(`/imports/${poId}/escrow-release`);
      toast.success('Escrow released to exporter upon confirmed delivery.');
      fetchImportsAndRFQs();
      if (activePO?._id === poId) {
        setActivePO((p) => ({ ...p, escrowStatus: 'Released' }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to release escrow.');
    } finally {
      setEscrowLoading(false);
    }
  };

  const openDisputeModal = (po) => {
    const prod = po.productId || po;
    const totalVal = po.totalAmount || (po.quantity || 1) * (po.unitPrice || prod.price || 0);
    setActivePO(po);
    setDisputeData({
      reason: 'Cargo Damage in Ocean Transit',
      disputedAmount: totalVal,
      description: '',
      evidenceDocId: '',
    });
    setDisputeModalOpen(true);
  };

  const handleFileDispute = async (e) => {
    e.preventDefault();
    if (!activePO) return;
    setFilingDispute(true);
    try {
      await api.post('/disputes', {
        orderId: activePO._id,
        reason: disputeData.reason,
        disputedAmount: Number(disputeData.disputedAmount),
        description: disputeData.description,
        evidenceDocumentIds: disputeData.evidenceDocId ? [disputeData.evidenceDocId] : [],
      });
      toast.success('Commercial dispute filed. Escrow locked pending arbitration.');
      setDisputeModalOpen(false);
      fetchImportsAndRFQs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to file dispute.');
    } finally {
      setFilingDispute(false);
    }
  };

  const handleConvertToPO = async (rfqId) => {
    try {
      const res = await api.post(`/rfq/${rfqId}/convert-to-po`);
      toast.success(`Converted to Purchase Order ${res.data?.poNumber || ''}!`);
      fetchImportsAndRFQs();
      setActiveTab('orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to convert RFQ to purchase order.');
    }
  };

  const openPODetails = async (item) => {
    setActivePO(item);
    setSheetOpen(true);
    setLoadingDocs(true);
    try {
      const docsRes = await api.get(`/imports/${item._id}/documents`);
      setAttachedDocs(Array.isArray(docsRes.data) ? docsRes.data : []);
    } catch {
      setAttachedDocs([]);
    } finally {
      setLoadingDocs(false);
    }
  };

  const handleConfirmDelivery = async () => {
    if (!activePO) return;
    setDeliveryLoading(true);
    try {
      const res = await api.patch(`/imports/${activePO._id}/confirm-delivery`, {
        notes: deliveryNotes.trim() || 'Cargo received and discharge inspection passed.',
      });
      toast.success('Delivery accepted! Escrow settlement confirmed.');
      setActivePO(res.data);
      setDeliveryModalOpen(false);
      setDeliveryNotes('');
      fetchImportsAndRFQs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to confirm delivery sign-off.');
    } finally {
      setDeliveryLoading(false);
    }
  };

  const handleDownloadDoc = async (docId, fileName) => {
    try {
      const res = await api.get(`/documents/${docId}/download-url`);
      const link = document.createElement('a');
      link.href = res.data.presignedGetUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Downloading ${fileName}`);
    } catch {
      toast.error('Failed to download document');
    }
  };

  const copyPO = (poNum) => {
    navigator.clipboard.writeText(poNum);
    toast.success(`Copied ${poNum} to clipboard`);
  };

  const handleExportCsv = async () => {
    try {
      const res = await api.get('/analytics/export?type=orders&format=csv', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `iehub-purchase-orders-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Trade ledger exported for ERP integration');
    } catch {
      toast.error('Failed to export trade ledger');
    }
  };

  if (user?.isGuest) {
    return (
      <EmptyState
        icon={HiGlobeAlt}
        title="Purchase Order Registry"
        description="Active import order tracking and consignment delivery manifests are reserved for verified corporate accounts."
        action={
          <div className="flex gap-2">
            <Button size="sm" asChild>
              <Link to="/register">Create Account</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/dashboard">Back to Overview</Link>
            </Button>
          </div>
        }
      />
    );
  }

  const totalUnits = imports.reduce((acc, curr) => acc + (curr.quantity || 1), 0);
  const totalCommitment = imports.reduce((acc, curr) => {
    const prod = curr.productId || curr;
    return acc + (curr.quantity || 1) * (curr.unitPrice || prod.price || 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-default">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Buyer Workbench
            </h1>
            <Badge variant="neutral" size="sm">
              {imports.length} PO{imports.length === 1 ? '' : 's'}
            </Badge>
          </div>
          {imports.length > 0 && (
            <p className="text-xs text-foreground-muted mt-0.5 tabular-nums">
              {totalUnits.toLocaleString()} units committed &bull; ${totalCommitment.toLocaleString()} total trade exposure
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {imports.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCsv}
              className="h-8 text-xs gap-1"
            >
              <HiDownload className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchImportsAndRFQs}
            disabled={refreshing}
            className="h-8 text-xs text-foreground-muted"
          >
            <HiRefresh className={`w-3.5 h-3.5 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
            Sync
          </Button>
          <Button size="sm" asChild className="shrink-0 gap-1.5">
            <Link to="/products">
              <HiGlobeAlt className="w-4 h-4" />
              <span>Source Commodities</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between border-b border-border-default pb-3">
          <TabsList className="bg-surface-subtle border border-border-default">
            <TabsTrigger value="orders">
              Purchase Orders ({imports.length})
            </TabsTrigger>
            <TabsTrigger value="rfqs">
              My Formal Quotations ({myRFQs.length})
              {myRFQs.filter((r) => r.status === 'Quoted').length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-status-success/20 text-status-success font-semibold">
                  {myRFQs.filter((r) => r.status === 'Quoted').length} Quoted
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* TAB 1: PURCHASE ORDERS */}
        <TabsContent value="orders" className="space-y-4">
          {imports.length > 0 && (
            <div className="flex items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                <Input
                  placeholder="Search PO number, commodity, or destination port..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-9 text-xs"
                />
              </div>

              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm('')}
                  className="text-xs text-foreground-muted"
                >
                  Clear
                </Button>
              )}
            </div>
          )}

          {loading ? (
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-14 rounded-lg border border-border-default bg-surface animate-pulse" />
              ))}
            </div>
          ) : imports.length === 0 ? (
            <EmptyState
              icon={HiGlobeAlt}
              title="No purchase orders yet"
              description="Your executed contracts and shipment milestones will appear here once you issue your first purchase order from the marketplace."
              action={
                <Button size="sm" asChild>
                  <Link to="/products">Browse Marketplace</Link>
                </Button>
              }
            />
          ) : filteredImports.length === 0 ? (
            <div className="py-16 text-center text-xs text-foreground-muted">
              No orders match &ldquo;{searchTerm}&rdquo;.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PO Reference / Commodity</TableHead>
                  <TableHead>Destination Port</TableHead>
                  <TableHead className="text-right">Total Commitment</TableHead>
                  <TableHead>Escrow / Acceptance</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="w-10"><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredImports.map((item) => {
                  const prod = item.productId || item;
                  const unitPrice = item.unitPrice || prod.price || 0;
                  const totalVal = item.totalAmount || (item.quantity || 1) * unitPrice;
                  const statusText = item.status || 'Confirmed';
                  const statusVariant =
                    statusText === 'Delivered'
                      ? 'success'
                      : statusText === 'In Transit'
                      ? 'accent'
                      : statusText === 'Disputed'
                      ? 'danger'
                      : statusText === 'Customs Clearance'
                      ? 'warning'
                      : 'neutral';
                  const poNumber = item.poNumber || `PO-${String(item._id).slice(-6).toUpperCase()}`;

                  return (
                    <TableRow key={item._id} className="cursor-pointer hover:bg-surface-subtle/50" onClick={() => openPODetails(item)}>
                      <TableCell className="py-2.5">
                        <div className="flex items-center gap-2.5">
                          {prod.image ? (
                            <div className="w-9 h-9 rounded-md overflow-hidden bg-surface-subtle border border-border-default shrink-0">
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>
                          ) : (
                            <div className="w-9 h-9 rounded-md bg-accent-subtle text-accent-primary border border-accent-primary/20 flex items-center justify-center font-bold text-[10px] shrink-0">
                              {prod.name?.charAt(0)?.toUpperCase() || 'P'}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-semibold text-xs text-foreground truncate max-w-[200px]">
                              {prod.name}
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-foreground-muted font-mono mt-0.5">
                              <span className="text-foreground-secondary">{poNumber}</span>
                              <span>&bull;</span>
                              <span className="text-accent-primary font-bold">{item.incoterm || prod.incoterm || 'FOB'}</span>
                              <span>&bull;</span>
                              <span className="text-foreground-muted">{(item.quantity || 1).toLocaleString()} {item.unit || prod.unit || 'MT'}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="py-2.5 text-xs text-foreground-secondary">
                        <div className="truncate max-w-[170px] font-medium text-foreground">
                          {item.destinationPort || 'Designated Port of Entry'}
                        </div>
                        <div className="text-[10px] text-foreground-muted font-mono">
                          Origin: {prod.origin || 'Global Port'}
                        </div>
                      </TableCell>

                      <TableCell className="py-2.5 text-right font-mono text-xs font-semibold tabular-nums text-foreground">
                        ${totalVal.toLocaleString()}
                      </TableCell>

                      <TableCell className="py-2.5">
                        <div className="flex flex-col gap-1">
                          <Badge
                            variant={item.escrowStatus === 'Funded' ? 'accent' : item.escrowStatus === 'Released' ? 'success' : 'neutral'}
                            size="sm"
                            className="text-[10px] w-fit"
                          >
                            Escrow: {item.escrowStatus || 'None'}
                          </Badge>
                          <span className="text-[10px] text-foreground-muted">
                            Seller: {item.sellerAccepted || 'Pending'}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="py-2.5 text-center">
                        <Badge variant={statusVariant} size="sm" hasDot>
                          {statusText}
                        </Badge>
                      </TableCell>

                      <TableCell className="py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu
                          items={[
                            { label: 'View contract & tracking', icon: HiEye, onSelect: () => openPODetails(item) },
                            { label: 'Copy PO reference', icon: HiClipboardCopy, onSelect: () => copyPO(poNumber) },
                            ...(item.escrowStatus !== 'Funded' && item.escrowStatus !== 'Released'
                              ? [{ label: 'Fund Escrow Vault', icon: HiCurrencyDollar, onSelect: () => handleFundEscrow(item._id) }]
                              : []),
                            { label: 'Raise Dispute / Claim', icon: HiScale, onSelect: () => openDisputeModal(item) },
                            { label: 'Cancel purchase order', icon: HiTrash, danger: true, onSelect: () => openCancelPrompt(item) },
                          ]}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </TabsContent>

        {/* TAB 2: MY RFQS */}
        <TabsContent value="rfqs" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground">My Requests for Quotation (RFQ)</h2>
              <p className="text-xs text-foreground-muted">Manage bespoke sourcing inquiries and convert agreed vendor quotes into active purchase orders.</p>
            </div>
          </div>

          {myRFQs.length > 0 ? (
            <Card className="border border-border-default bg-surface shadow-2xs overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>RFQ Reference</TableHead>
                    <TableHead>Commodity / Exporter</TableHead>
                    <TableHead>My Bid (Vol & Price)</TableHead>
                    <TableHead>Seller Quotation</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myRFQs.map((rfq) => (
                    <TableRow key={rfq._id}>
                      <TableCell>
                        <div className="font-semibold text-xs font-mono text-foreground">{rfq.rfqNumber || rfq._id?.slice(-8)}</div>
                        <div className="text-[11px] text-foreground-muted">{new Date(rfq.createdAt).toLocaleDateString()}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs font-semibold text-foreground">{rfq.productId?.name || 'Commodity'}</div>
                        <div className="text-[11px] text-foreground-muted truncate max-w-[170px]">{rfq.sellerEmail}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs font-bold tabular-nums text-foreground">{rfq.requestedQuantity} Units</div>
                        <div className="text-[11px] text-foreground-muted font-mono">Target: ${rfq.targetPrice?.toLocaleString()}</div>
                      </TableCell>
                      <TableCell>
                        {rfq.counterOfferPrice ? (
                          <div>
                            <div className="text-xs font-bold text-accent-primary tabular-nums">
                              ${rfq.counterOfferPrice?.toLocaleString()} FOB
                            </div>
                            <div className="text-[10px] text-foreground-muted">
                              Lead: {rfq.counterOfferLeadDays || 14} days
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-foreground-muted italic">Awaiting Quote</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={rfq.status === 'Accepted' ? 'success' : rfq.status === 'Quoted' ? 'accent' : 'warning'}
                          size="sm"
                        >
                          {rfq.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {rfq.status === 'Quoted' || rfq.status === 'Accepted' ? (
                          <Button size="sm" onClick={() => handleConvertToPO(rfq._id)} className="h-7 text-xs">
                            Convert to PO
                          </Button>
                        ) : (
                          <span className="text-xs text-foreground-muted">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          ) : (
            <EmptyState
              icon={HiGlobeAlt}
              title="No Formal RFQs Submitted"
              description="When requesting custom pricing from commodity pages, your RFQ negotiations will appear here."
              className="min-h-[220px]"
            />
          )}
        </TabsContent>
      </Tabs>

      {/* PO Detail & Milestone Drawer (Sheet) */}
      <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
        {activePO && (
          <>
            <SheetHeader
              title={`Purchase Order: ${activePO.poNumber || `PO-${String(activePO._id).slice(-6).toUpperCase()}`}`}
              description="Binding international commercial purchase order"
              onClose={() => setSheetOpen(false)}
            />

            <SheetContent className="space-y-6">
              {/* Escrow Status & Action Banner */}
              <div className="p-4 rounded-xl border border-accent-primary/20 bg-accent-subtle/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <HiShieldCheck className="w-4 h-4 text-accent-primary" />
                    B2B Platform Escrow Protection
                  </span>
                  <Badge variant={activePO.escrowStatus === 'Funded' ? 'accent' : activePO.escrowStatus === 'Released' ? 'success' : 'neutral'} size="sm">
                    {activePO.escrowStatus || 'None'}
                  </Badge>
                </div>
                <p className="text-[11px] text-foreground-muted">
                  Funds are secured in fiduciary vault and released only when bill of lading and discharge manifest are confirmed.
                </p>
                <div className="text-[10px] text-foreground-muted/90 bg-surface/60 border border-border-default/60 rounded p-2 flex items-center gap-1.5">
                  <HiInformationCircle className="w-3.5 h-3.5 text-accent-primary shrink-0" />
                  <span>Internal Fiduciary Ledger · Custody tracking under platform bilateral rules. Third-party licensed banking partner integration in progress.</span>
                </div>

                {activePO.deliveryAcceptedByEmail && (
                  <div className="p-2.5 rounded-lg bg-status-success-bg border border-status-success/20 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-status-success">
                      <HiCheckCircle className="w-4 h-4" />
                      Consignee Delivery Sign-off Complete
                    </div>
                    <div className="text-[11px] text-foreground-muted">
                      Accepted by <span className="font-medium text-foreground">{activePO.deliveryAcceptedByEmail}</span>
                      {activePO.deliveryAcceptedAt && ` on ${new Date(activePO.deliveryAcceptedAt).toLocaleDateString()}`}
                    </div>
                    {activePO.deliverySignoffNotes && (
                      <div className="text-[11px] text-foreground italic mt-0.5">&ldquo;{activePO.deliverySignoffNotes}&rdquo;</div>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-1">
                  {activePO.escrowStatus !== 'Funded' && activePO.escrowStatus !== 'Released' && (
                    <Button size="sm" onClick={() => handleFundEscrow(activePO._id)} disabled={escrowLoading} className="h-7 text-xs">
                      Fund Escrow Now
                    </Button>
                  )}
                  {activePO.escrowStatus === 'Funded' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReleaseEscrow(activePO._id)}
                      disabled={escrowLoading}
                      className="h-7 text-xs border-status-success/30 text-status-success hover:bg-status-success/10"
                    >
                      Direct Escrow Release
                    </Button>
                  )}
                  {!activePO.deliveryAcceptedByEmail && activePO.status !== 'Cancelled' && (
                    <Button
                      size="sm"
                      onClick={() => setDeliveryModalOpen(true)}
                      className="h-7 text-xs bg-status-success hover:bg-status-success/90"
                    >
                      Sign-off Delivery Acceptance
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => openDisputeModal(activePO)} className="h-7 text-xs text-status-danger border-status-danger/30 hover:bg-status-danger/10">
                    File Dispute
                  </Button>
                </div>
              </div>

              {/* Ocean Carrier & Bill of Lading Logistics */}
              <div className="p-4 rounded-xl border border-border-default bg-surface space-y-3">
                <div className="text-xs font-semibold text-foreground">
                  Carrier & Logistics Documentation
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-border-subtle">
                    <span className="text-foreground-muted">Vessel Name</span>
                    <span className="font-medium text-foreground">{activePO.vesselName || 'Pending Carrier Assignment'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border-subtle">
                    <span className="text-foreground-muted">Vessel IMO</span>
                    <span className="font-mono text-foreground">{activePO.vesselImo || 'Pending IMO'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border-subtle">
                    <span className="text-foreground-muted">Container BIC</span>
                    <span className="font-mono text-foreground">{activePO.containerNumber || 'Pending Consolidation'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border-subtle">
                    <span className="text-foreground-muted">Bill of Lading</span>
                    {activePO.billOfLadingUrl ? (
                      <a href={activePO.billOfLadingUrl} target="_blank" rel="noreferrer" className="text-accent-primary font-medium inline-flex items-center gap-1 hover:underline">
                        View B/L Manifest <HiExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-foreground-muted italic">Drafting Underway</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Trade & Shipping Documents Attached */}
              <div className="p-4 rounded-xl border border-border-default bg-surface space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <HiDocumentText className="w-4 h-4 text-accent-primary" />
                    Attached Trade Documents ({attachedDocs.length})
                  </div>
                  <Link to="/dashboard/documents" className="text-[11px] text-accent-primary hover:underline inline-flex items-center gap-1">
                    Document Vault <HiExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                {loadingDocs ? (
                  <div className="text-xs text-foreground-muted animate-pulse py-2">Loading document ledger...</div>
                ) : attachedDocs.length === 0 ? (
                  <div className="text-[11px] text-foreground-muted italic py-1">
                    No vault documents linked yet. Upload Bill of Lading, COO, or Inspection Certificates in the Document Vault.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {attachedDocs.map((doc) => (
                      <div key={doc._id} className="flex items-center justify-between p-2 rounded-lg bg-surface-subtle border border-border-subtle text-xs">
                        <div className="min-w-0 pr-2">
                          <div className="font-semibold text-foreground truncate">{doc.fileName}</div>
                          <div className="text-[10px] text-foreground-muted flex items-center gap-2 mt-0.5">
                            <Badge variant={doc.status === 'Verified' ? 'success' : 'neutral'} size="sm">
                              {doc.documentType}
                            </Badge>
                            <span>{(doc.fileSizeBytes / 1024).toFixed(0)} KB</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDownloadDoc(doc._id, doc.fileName)}
                          className="h-7 w-7 p-0 shrink-0"
                          title="Download Document"
                        >
                          <HiDownload className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bilateral Trade Messaging Thread */}
              <OrderMessageThread
                orderId={activePO._id}
                poNumber={activePO.poNumber}
              />

              {/* Milestone Stepper */}
              <div className="p-4 rounded-xl border border-border-default bg-surface space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-foreground">
                    Transit & Customs Lifecycle
                  </div>
                  <Badge variant="accent" size="sm" hasDot>
                    {activePO.status || 'Confirmed'}
                  </Badge>
                </div>

                <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border-default">
                  {MILESTONES.map((step, idx) => {
                    const currentIdx = STATUS_SEQUENCE.indexOf(activePO.status || 'Confirmed');
                    const isCompleted = idx <= currentIdx;
                    const milestoneEvent = activePO.milestones?.find((m) => m.status === step.id);

                    return (
                      <div key={step.id} className="relative">
                        <div
                          className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border flex items-center justify-center text-[9px] ${
                            isCompleted
                              ? 'bg-accent-primary border-accent-primary text-white'
                              : 'bg-surface border-border-default text-foreground-muted'
                          }`}
                        >
                          {isCompleted ? <HiCheckCircle className="w-3.5 h-3.5" /> : idx + 1}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-semibold text-foreground">
                            {step.label}
                          </div>
                          {milestoneEvent?.updatedAt && (
                            <div className="text-[10px] text-foreground-muted">
                              {new Date(milestoneEvent.updatedAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        <div className="text-[11px] text-foreground-muted">
                          {step.desc}
                        </div>
                        {milestoneEvent?.notes && (
                          <div className="text-[10px] text-foreground-secondary italic mt-0.5">
                            &ldquo;{milestoneEvent.notes}&rdquo;
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Commercial Terms */}
              <div className="p-4 rounded-xl border border-border-default bg-surface space-y-3">
                <div className="text-xs font-semibold text-foreground">
                  Contract Particulars
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-border-subtle">
                    <span className="text-foreground-muted">Incoterm (ICC 2020)</span>
                    <span className="font-mono font-bold text-accent-primary">
                      {activePO.incoterm || 'FOB'}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-border-subtle">
                    <span className="text-foreground-muted">Named Port of Destination</span>
                    <span className="font-medium text-foreground text-right max-w-[180px] truncate">
                      {activePO.destinationPort || 'Designated Port of Entry'}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-border-subtle">
                    <span className="text-foreground-muted">Payment Terms</span>
                    <span className="font-medium text-foreground text-right max-w-[180px] truncate">
                      {activePO.paymentTerms || 'Confirmed Letter of Credit (LC)'}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-border-subtle">
                    <span className="text-foreground-muted">Laycan Loading Window</span>
                    <span className="font-mono text-foreground">
                      {activePO.laycanWindow || 'Standard 14-Day Laycan'}
                    </span>
                  </div>

                  <div className="flex justify-between py-1">
                    <span className="text-foreground-muted">Seller Acceptance</span>
                    <span className="font-semibold text-foreground">
                      {activePO.sellerAccepted || 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            </SheetContent>

            <SheetFooter>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-status-danger border-status-danger/30 hover:bg-status-danger/10"
                onClick={() => {
                  setSheetOpen(false);
                  openCancelPrompt(activePO);
                }}
              >
                Terminate Purchase Order
              </Button>
            </SheetFooter>
          </>
        )}
      </Sheet>

      {/* Confirmation Dialog for Cancellation */}
      <ConfirmDialog
        open={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        loading={cancelling}
        title="Cancel Purchase Order"
        description={`Are you certain you wish to terminate PO ${orderToCancel?.poNumber || ''}? Allocated inventory will be released immediately back to the supplier.`}
        confirmText="Confirm Termination"
        cancelText="Retain Order"
        variant="danger"
      />

      {/* Dispute Modal */}
      {disputeModalOpen && (
        <Modal open={disputeModalOpen} onClose={() => setDisputeModalOpen(false)}>
          <ModalHeader
            title="File Commercial Dispute Claim"
            description={`Initiate official arbitration for PO ${activePO?.poNumber || ''}. Escrow funds will freeze automatically.`}
          />
          <form onSubmit={handleFileDispute}>
            <ModalContent className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Claim Reason</label>
                <select
                  value={disputeData.reason}
                  onChange={(e) => setDisputeData({ ...disputeData, reason: e.target.value })}
                  className="w-full text-xs rounded-md border border-border-default bg-surface px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-accent-primary"
                >
                  <option value="Cargo Damage in Ocean Transit">Cargo Damage in Ocean Transit</option>
                  <option value="Quality Specification Deviation">Quality Specification Deviation (SGS Mismatch)</option>
                  <option value="Non-Delivery / Exceeded Laycan">Non-Delivery / Exceeded Laycan Window</option>
                  <option value="Commercial Contract Breach">Commercial Contract Breach</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Disputed Amount ($ USD)</label>
                <Input
                  type="number"
                  required
                  step="0.01"
                  value={disputeData.disputedAmount}
                  onChange={(e) => setDisputeData({ ...disputeData, disputedAmount: e.target.value })}
                  className="h-8 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Detailed Claim Statement *</label>
                <textarea
                  required
                  rows={4}
                  value={disputeData.description}
                  onChange={(e) => setDisputeData({ ...disputeData, description: e.target.value })}
                  placeholder="Provide container seals numbers, inspection reports, or specific clauses breached..."
                  className="w-full text-xs rounded-md border border-border-default bg-surface p-2 text-foreground focus:outline-none focus:ring-1 focus:ring-accent-primary resize-none"
                />
              </div>

              {attachedDocs.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Link Vault Evidence Document
                  </label>
                  <select
                    value={disputeData.evidenceDocId || ''}
                    onChange={(e) => setDisputeData({ ...disputeData, evidenceDocId: e.target.value })}
                    className="w-full text-xs rounded-md border border-border-default bg-surface px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-accent-primary"
                  >
                    <option value="">None (Claim statement only)</option>
                    {attachedDocs.map((doc) => (
                      <option key={doc._id} value={doc._id}>
                        {doc.documentType}: {doc.fileName}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-foreground-muted mt-1">
                    Optionally bind inspection reports, SGS survey, or B/L manifests to lock escrow with evidence.
                  </p>
                </div>
              )}
            </ModalContent>
            <ModalFooter>
              <Button type="button" variant="outline" onClick={() => setDisputeModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={filingDispute || !disputeData.description}>
                {filingDispute ? 'Transmitting Claim...' : 'Submit Claim for Arbitration'}
              </Button>
            </ModalFooter>
          </form>
        </Modal>
      )}

      {/* Delivery Acceptance Modal */}
      {deliveryModalOpen && (
        <Modal open={deliveryModalOpen} onClose={() => setDeliveryModalOpen(false)}>
          <ModalHeader
            title="Sign-off Cargo Delivery"
            description={`Formal consignee acceptance for Purchase Order ${activePO?.poNumber || ''}`}
            onClose={() => setDeliveryModalOpen(false)}
          />
          <form onSubmit={(e) => { e.preventDefault(); handleConfirmDelivery(); }}>
            <ModalContent className="space-y-4">
              <div className="p-3 rounded-lg bg-status-success-bg border border-status-success/20 text-xs text-status-success">
                By confirming delivery, you formally certify that the commodity consignment has landed at{' '}
                <strong>{activePO?.destinationPort || 'the port of destination'}</strong>, passed physical tally/inspection, and that escrow funds are authorized for release to the supplier.
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Inspection / Discharge Remarks
                </label>
                <textarea
                  rows={3}
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="e.g. Received full consignment in good order. Container seal intact, tally report verified."
                  className="w-full text-xs rounded-md border border-border-default bg-surface p-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-accent-primary resize-none"
                />
              </div>
            </ModalContent>
            <ModalFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDeliveryModalOpen(false)}
                disabled={deliveryLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={deliveryLoading}
                className="bg-status-success hover:bg-status-success/90"
              >
                {deliveryLoading ? 'Confirming...' : 'Sign-off Delivery & Settle Escrow'}
              </Button>
            </ModalFooter>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default MyImportsPage;
