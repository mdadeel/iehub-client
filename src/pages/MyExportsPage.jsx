import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiSearch,
  HiExternalLink,
  HiCube,
  HiTruck,
  HiDocumentText,
  HiCheckCircle,
  HiXCircle,
  HiRefresh,
} from 'react-icons/hi';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '../components/ui/Table';
import { Sheet, SheetHeader, SheetContent, SheetFooter } from '../components/ui/Sheet';
import { Modal, ModalHeader, ModalContent, ModalFooter } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { DropdownMenu } from '../components/ui/DropdownMenu';

const MyExportsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('inventory');
  const [exports, setExports] = useState([]);
  const [filteredExports, setFilteredExports] = useState([]);
  const [inboundOrders, setInboundOrders] = useState([]);
  const [inboundRFQs, setInboundRFQs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Edit Drawer
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [updating, setUpdating] = useState(false);

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Shipping Modal
  const [shippingModalOpen, setShippingModalOpen] = useState(false);
  const [shippingOrder, setShippingOrder] = useState(null);
  const [shippingData, setShippingData] = useState({
    vesselName: '',
    vesselImo: '',
    containerNumber: '',
    billOfLadingUrl: '',
    status: 'In Transit',
  });
  const [savingShipping, setSavingShipping] = useState(false);

  // RFQ Counter Modal
  const [rfqModalOpen, setRfqModalOpen] = useState(false);
  const [selectedRFQ, setSelectedRFQ] = useState(null);
  const [counterData, setCounterData] = useState({
    counterOfferPrice: '',
    counterOfferLeadDays: '14',
    sellerNotes: '',
  });
  const [submittingCounter, setSubmittingCounter] = useState(false);

  const fetchExporterData = useCallback(async () => {
    if (!user?.email) return;
    try {
      setRefreshing(true);
      const [productsRes, ordersRes, rfqsRes] = await Promise.allSettled([
        api.get(`/products?exporterEmail=${encodeURIComponent(user.email)}`),
        api.get('/imports/inbound/seller'),
        api.get('/rfq?as=seller'),
      ]);

      if (productsRes.status === 'fulfilled') {
        const list = Array.isArray(productsRes.value.data) ? productsRes.value.data : [];
        const myData = list.filter((item) => item.exporterEmail === user.email);
        setExports(myData);
        setFilteredExports(myData);
      }
      if (ordersRes.status === 'fulfilled') {
        setInboundOrders(Array.isArray(ordersRes.value.data) ? ordersRes.value.data : []);
      }
      if (rfqsRes.status === 'fulfilled') {
        setInboundRFQs(Array.isArray(rfqsRes.value.data) ? rfqsRes.value.data : []);
      }
    } catch {
      toast.error('Unable to synchronize exporter cockpit.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchExporterData();
  }, [fetchExporterData]);

  useEffect(() => {
    const results = exports.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.origin?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredExports(results);
  }, [searchTerm, exports]);

  const handleDeletePrompt = (id, name) => {
    setItemToDelete({ id, name });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/products/${itemToDelete.id}`);
      setExports((prev) => prev.filter((item) => item._id !== itemToDelete.id));
      toast.success('Listing removed from marketplace.');
      setDeleteModalOpen(false);
    } catch {
      toast.error('Failed to remove listing.');
    } finally {
      setDeleting(false);
      setItemToDelete(null);
    }
  };

  const handleOpenEdit = (product) => {
    setSelectedProduct(product);
    setEditFormData({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      origin: product.origin,
      category: product.category,
      hsCode: product.hsCode || '',
      description: product.description,
    });
    setEditDrawerOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setUpdating(true);
    try {
      const { data } = await api.patch(`/products/${selectedProduct._id}`, {
        ...editFormData,
        price: parseFloat(editFormData.price),
        quantity: parseInt(editFormData.quantity, 10),
      });
      setExports((prev) => prev.map((item) => (item._id === selectedProduct._id ? data : item)));
      toast.success('Listing updated.');
      setEditDrawerOpen(false);
    } catch {
      toast.error('Failed to update listing.');
    } finally {
      setUpdating(false);
    }
  };

  // Bilateral Order Handlers
  const handleSellerAcceptOrder = async (orderId) => {
    try {
      await api.patch(`/imports/${orderId}/seller-accept`);
      toast.success('Order contract accepted. Buyer notified.');
      fetchExporterData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept order.');
    }
  };

  const handleSellerRejectOrder = async (orderId) => {
    try {
      await api.patch(`/imports/${orderId}/seller-reject`);
      toast.success('Order declined. Reserved inventory returned.');
      fetchExporterData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to decline order.');
    }
  };

  // Shipping updates
  const handleOpenShipping = (order) => {
    setShippingOrder(order);
    setShippingData({
      vesselName: order.vesselName || '',
      vesselImo: order.vesselImo || '',
      containerNumber: order.containerNumber || '',
      billOfLadingUrl: order.billOfLadingUrl || '',
      status: order.status === 'Confirmed' ? 'Cargo Received' : order.status,
    });
    setShippingModalOpen(true);
  };

  const handleSaveShipping = async (e) => {
    e.preventDefault();
    if (!shippingOrder) return;
    setSavingShipping(true);
    try {
      await api.patch(`/imports/${shippingOrder._id}/shipping`, shippingData);
      toast.success('Shipping & Bill of Lading details updated.');
      setShippingModalOpen(false);
      fetchExporterData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update shipping logistics.');
    } finally {
      setSavingShipping(false);
    }
  };

  // RFQ handlers
  const handleOpenCounter = (rfq) => {
    setSelectedRFQ(rfq);
    setCounterData({
      counterOfferPrice: rfq.targetPrice || '',
      counterOfferLeadDays: '14',
      sellerNotes: '',
    });
    setRfqModalOpen(true);
  };

  const handleSubmitCounter = async (e) => {
    e.preventDefault();
    if (!selectedRFQ) return;
    setSubmittingCounter(true);
    try {
      await api.patch(`/rfq/${selectedRFQ._id}/counter`, {
        counterOfferPrice: Number(counterData.counterOfferPrice),
        counterOfferLeadDays: Number(counterData.counterOfferLeadDays),
        sellerNotes: counterData.sellerNotes,
      });
      toast.success('Formal quotation transmitted to buyer.');
      setRfqModalOpen(false);
      fetchExporterData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit quotation.');
    } finally {
      setSubmittingCounter(false);
    }
  };

  const handleAcceptBuyerRFQ = async (rfqId) => {
    try {
      await api.patch(`/rfq/${rfqId}/accept`);
      toast.success("Buyer's RFQ terms accepted. Awaiting buyer PO execution.");
      fetchExporterData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept RFQ terms.');
    }
  };

  if (user?.isGuest) {
    return (
      <EmptyState
        icon={HiCube}
        title="Export Inventory"
        description="Listing management is reserved for verified trade accounts. Sign in or register to publish inventory."
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

  const totalUnits = exports.reduce((acc, curr) => acc + (curr.quantity || 0), 0);
  const totalPortfolioValue = exports.reduce(
    (acc, curr) => acc + (curr.quantity || 0) * (curr.price || 0),
    0
  );
  const pendingOrdersCount = inboundOrders.filter((o) => o.sellerAccepted === 'Pending').length;
  const pendingRFQsCount = inboundRFQs.filter((r) => r.status === 'Submitted').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-default">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Exporter Cockpit
            </h1>
            <Badge variant="neutral" size="sm">
              {exports.length} Listing{exports.length === 1 ? '' : 's'}
            </Badge>
          </div>
          {exports.length > 0 && (
            <p className="text-xs text-foreground-muted mt-0.5 tabular-nums">
              {totalUnits.toLocaleString()} total units &bull; ${totalPortfolioValue.toLocaleString()} FOB valuation
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchExporterData}
            disabled={refreshing}
            className="h-8 text-xs text-foreground-muted"
          >
            <HiRefresh className={`w-3.5 h-3.5 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
            Sync
          </Button>
          <Button size="sm" asChild className="shrink-0 gap-1.5">
            <Link to="/dashboard/add-export">
              <HiPlus className="w-4 h-4" />
              <span>New Listing</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Tabs Cockpit */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between border-b border-border-default pb-3">
          <TabsList className="bg-surface-subtle border border-border-default">
            <TabsTrigger value="inventory">
              Export Inventory ({exports.length})
            </TabsTrigger>
            <TabsTrigger value="orders">
              Inbound Purchase Orders ({inboundOrders.length})
              {pendingOrdersCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-status-warning/20 text-status-warning font-semibold">
                  {pendingOrdersCount} Pending
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="rfqs">
              Inbound RFQs ({inboundRFQs.length})
              {pendingRFQsCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-status-info/20 text-status-info font-semibold">
                  {pendingRFQsCount} New
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* TAB 1: INVENTORY */}
        <TabsContent value="inventory" className="space-y-4">
          {exports.length > 0 && (
            <div className="flex items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                <Input
                  placeholder="Search by name, origin, or sector..."
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
          ) : exports.length === 0 ? (
            <EmptyState
              icon={HiCube}
              title="No listings yet"
              description="Register your first commodity to appear in the marketplace and receive purchase orders from global importers."
              action={
                <Button size="sm" asChild>
                  <Link to="/dashboard/add-export">Create Listing</Link>
                </Button>
              }
            />
          ) : filteredExports.length === 0 ? (
            <div className="py-16 text-center text-xs text-foreground-muted">
              No listings match &ldquo;{searchTerm}&rdquo;.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Commodity / HS Code</TableHead>
                  <TableHead>Sector / Origin</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Volume</TableHead>
                  <TableHead className="text-right">FOB Price</TableHead>
                  <TableHead className="text-right">Valuation</TableHead>
                  <TableHead className="w-10"><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExports.map((item) => {
                  const valuation = (item.quantity || 0) * (item.price || 0);
                  const isLow = (item.quantity || 0) < 20;

                  return (
                    <TableRow key={item._id}>
                      <TableCell className="py-2.5">
                        <div className="flex items-center gap-2.5">
                          {item.image ? (
                            <div className="w-9 h-9 rounded-md overflow-hidden bg-surface-subtle border border-border-default shrink-0">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>
                          ) : (
                            <div className="w-9 h-9 rounded-md bg-accent-subtle text-accent-primary border border-accent-primary/20 flex items-center justify-center font-bold text-[10px] shrink-0">
                              {item.name?.charAt(0)?.toUpperCase() || 'C'}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-semibold text-xs text-foreground truncate max-w-[200px]">
                              {item.name}
                            </div>
                            <div className="text-[10px] text-accent-primary font-mono">
                              HS: {item.hsCode || 'Standard Tariff'}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="py-2.5 text-xs">
                        <div className="font-medium text-foreground">{item.category}</div>
                        <div className="text-[10px] text-foreground-muted">{item.origin || 'Global'}</div>
                      </TableCell>

                      <TableCell className="py-2.5">
                        <Badge
                          variant={item.verificationStatus === 'verified' ? 'success' : item.verificationStatus === 'rejected' ? 'danger' : 'warning'}
                          size="sm"
                        >
                          {item.verificationStatus === 'verified' ? (item.verificationBadge || 'Verified') : (item.verificationStatus || 'Pending')}
                        </Badge>
                      </TableCell>

                      <TableCell className="py-2.5 text-right">
                        <Badge variant={isLow ? 'warning' : 'success'} size="sm" hasDot>
                          {item.quantity?.toLocaleString()} {item.unit || 'units'}
                        </Badge>
                      </TableCell>

                      <TableCell className="py-2.5 text-right font-mono text-xs text-foreground tabular-nums">
                        ${item.price?.toLocaleString()}
                      </TableCell>

                      <TableCell className="py-2.5 text-right font-mono text-xs font-medium text-foreground tabular-nums">
                        ${valuation.toLocaleString()}
                      </TableCell>

                      <TableCell className="py-2.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEdit(item)}
                            className="h-7 text-[10px] px-2 gap-1 text-foreground-secondary hover:text-foreground"
                          >
                            <HiPencil className="w-3 h-3" />
                            Edit
                          </Button>
                          <DropdownMenu
                            items={[
                              {
                                label: 'View listing',
                                icon: HiExternalLink,
                                onSelect: () => window.open(`/products/${item._id}`, '_blank'),
                              },
                              {
                                label: 'Remove listing',
                                icon: HiTrash,
                                danger: true,
                                onSelect: () => handleDeletePrompt(item._id, item.name),
                              },
                            ]}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </TabsContent>

        {/* TAB 2: INBOUND PURCHASE ORDERS */}
        <TabsContent value="orders" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground">Inbound Purchase Orders</h2>
              <p className="text-xs text-foreground-muted">Review incoming buyer orders, confirm contract acceptance, and register shipping documents.</p>
            </div>
          </div>

          {inboundOrders.length > 0 ? (
            <Card className="border border-border-default bg-surface shadow-2xs overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO Reference</TableHead>
                    <TableHead>Buyer / Commodity</TableHead>
                    <TableHead>Terms / Destination</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                    <TableHead>Bilateral Acceptance</TableHead>
                    <TableHead>Logistics</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inboundOrders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell>
                        <div className="font-semibold text-xs font-mono text-foreground">{order.poNumber || order._id?.slice(-8)}</div>
                        <div className="text-[11px] text-foreground-muted">{new Date(order.createdAt).toLocaleDateString()}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs font-semibold text-foreground">{order.productId?.name || 'Commodity'}</div>
                        <div className="text-[11px] text-foreground-muted truncate max-w-[170px]">{order.userEmail}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs text-foreground font-mono">{order.incoterm || 'FOB'}</div>
                        <div className="text-[11px] text-foreground-muted">{order.destinationPort || 'Standard Port'}</div>
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs font-bold tabular-nums text-foreground">
                        ${((order.totalPrice || (order.quantity * (order.productId?.price || 0)))).toLocaleString()}
                        <div className="text-[10px] text-foreground-muted font-normal">{order.quantity} units</div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={order.sellerAccepted === 'Accepted' ? 'success' : order.sellerAccepted === 'Rejected' ? 'danger' : 'warning'}
                          size="sm"
                        >
                          {order.sellerAccepted || 'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs text-foreground">{order.vesselName || 'No Vessel Assigned'}</div>
                        <div className="text-[11px] font-mono text-foreground-muted">
                          {order.containerNumber ? `Cont: ${order.containerNumber}` : 'Pending Consolidation'}
                        </div>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {order.sellerAccepted === 'Pending' ? (
                          <div className="inline-flex gap-1.5">
                            <Button size="sm" onClick={() => handleSellerAcceptOrder(order._id)} className="h-7 text-xs">
                              Accept
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleSellerRejectOrder(order._id)} className="h-7 text-xs text-status-danger hover:bg-status-danger/10">
                              Decline
                            </Button>
                          </div>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => handleOpenShipping(order)} className="h-7 text-xs gap-1">
                            <HiTruck className="w-3.5 h-3.5" />
                            Logistics
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          ) : (
            <EmptyState
              icon={HiDocumentText}
              title="No Inbound Purchase Orders"
              description="When global importers issue purchase orders against your active listings, they will appear here for contractual acceptance."
              className="min-h-[220px]"
            />
          )}
        </TabsContent>

        {/* TAB 3: INBOUND RFQS */}
        <TabsContent value="rfqs" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground">Requests for Formal Quotation (RFQ)</h2>
              <p className="text-xs text-foreground-muted">Bespoke pricing, high-volume bids, and custom delivery schedule negotiations.</p>
            </div>
          </div>

          {inboundRFQs.length > 0 ? (
            <Card className="border border-border-default bg-surface shadow-2xs overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>RFQ Reference</TableHead>
                    <TableHead>Commodity / Buyer</TableHead>
                    <TableHead>Volume & Target Price</TableHead>
                    <TableHead>Delivery Port / Window</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inboundRFQs.map((rfq) => (
                    <TableRow key={rfq._id}>
                      <TableCell>
                        <div className="font-semibold text-xs font-mono text-foreground">{rfq.rfqNumber || rfq._id?.slice(-8)}</div>
                        <div className="text-[11px] text-foreground-muted">{new Date(rfq.createdAt).toLocaleDateString()}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs font-semibold text-foreground">{rfq.productId?.name || 'Commodity'}</div>
                        <div className="text-[11px] text-foreground-muted truncate max-w-[160px]">{rfq.buyerEmail}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs font-bold tabular-nums text-foreground">{rfq.requestedQuantity} Units</div>
                        <div className="text-[11px] text-foreground-muted font-mono">Target: ${rfq.targetPrice?.toLocaleString()}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs text-foreground">{rfq.targetPort || 'Standard POD'}</div>
                        <div className="text-[11px] text-foreground-muted">{rfq.requestedDeliveryWindow || 'Standard Laycan'}</div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={rfq.status === 'Accepted' ? 'success' : rfq.status === 'Quoted' ? 'accent' : 'warning'}
                          size="sm"
                        >
                          {rfq.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {rfq.status === 'Submitted' && (
                          <div className="inline-flex gap-1.5">
                            <Button size="sm" onClick={() => handleOpenCounter(rfq)} className="h-7 text-xs">
                              Quote / Counter
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleAcceptBuyerRFQ(rfq._id)} className="h-7 text-xs">
                              Accept Terms
                            </Button>
                          </div>
                        )}
                        {rfq.status === 'Quoted' && (
                          <span className="text-[11px] font-mono text-accent-primary font-semibold">
                            Quoted: ${rfq.counterOfferPrice}
                          </span>
                        )}
                        {rfq.status === 'Accepted' && (
                          <span className="text-[11px] text-status-success font-semibold">
                            Terms Finalized
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          ) : (
            <EmptyState
              icon={HiDocumentText}
              title="No Inbound RFQs"
              description="Direct quotation requests from enterprise buyers will be routed here for pricing negotiation."
              className="min-h-[220px]"
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Listing Slide-Over Drawer */}
      <Sheet open={editDrawerOpen} onClose={() => setEditDrawerOpen(false)}>
        <SheetHeader
          title="Edit Listing"
          description={selectedProduct?.name}
          onClose={() => setEditDrawerOpen(false)}
        />

        <SheetContent>
          <form id="edit-form" onSubmit={handleSaveEdit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Commodity Name</label>
              <Input
                required
                value={editFormData.name || ''}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">FOB Price ($)</label>
                <Input
                  type="number"
                  required
                  step="0.01"
                  value={editFormData.price || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Stock Quantity</label>
                <Input
                  type="number"
                  required
                  value={editFormData.quantity || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, quantity: e.target.value })}
                  className="h-9 text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Origin</label>
                <Input
                  value={editFormData.origin || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, origin: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">HS Tariff Code</label>
                <Input
                  placeholder="e.g. 0904.11"
                  value={editFormData.hsCode || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, hsCode: e.target.value })}
                  className="h-9 text-xs font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Category</label>
              <Input
                value={editFormData.category || ''}
                onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Description</label>
              <textarea
                rows={3}
                value={editFormData.description || ''}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                className="flex w-full rounded-md border border-border-default bg-surface px-3 py-2 text-xs text-foreground placeholder:text-foreground-muted focus-visible:outline-none focus-visible:border-accent-primary"
              />
            </div>
          </form>
        </SheetContent>

        <SheetFooter>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setEditDrawerOpen(false)}
            disabled={updating}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="edit-form"
            size="sm"
            disabled={updating}
          >
            {updating ? 'Saving...' : 'Save Changes'}
          </Button>
        </SheetFooter>
      </Sheet>

      {/* Confirmation Dialog for Listing Removal */}
      <ConfirmDialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title="Remove Listing"
        description={`Are you sure you want to remove "${itemToDelete?.name}"? It will no longer appear on the marketplace and buyers cannot order against it.`}
        confirmText="Remove Listing"
        cancelText="Keep Active"
        variant="danger"
      />

      {/* Shipping & Bill of Lading Modal */}
      {shippingModalOpen && (
        <Modal open={shippingModalOpen} onClose={() => setShippingModalOpen(false)}>
          <ModalHeader
            title="Dispatch & Logistics Registration"
            description={`Attach vessel IMO, container numbers, and negotiable Bill of Lading for PO ${shippingOrder?.poNumber || ''}.`}
          />
          <form onSubmit={handleSaveShipping}>
            <ModalContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Vessel Name</label>
                  <Input
                    required
                    placeholder="e.g. MSC OSCAR"
                    value={shippingData.vesselName}
                    onChange={(e) => setShippingData({ ...shippingData, vesselName: e.target.value })}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Vessel IMO Number</label>
                  <Input
                    placeholder="e.g. IMO 9703291"
                    value={shippingData.vesselImo}
                    onChange={(e) => setShippingData({ ...shippingData, vesselImo: e.target.value })}
                    className="h-8 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Container Number (BIC)</label>
                  <Input
                    placeholder="e.g. MSCU1234567"
                    value={shippingData.containerNumber}
                    onChange={(e) => setShippingData({ ...shippingData, containerNumber: e.target.value })}
                    className="h-8 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Logistics Status</label>
                  <select
                    value={shippingData.status}
                    onChange={(e) => setShippingData({ ...shippingData, status: e.target.value })}
                    className="w-full h-8 text-xs rounded-md border border-border-default bg-surface px-2 text-foreground focus:outline-none focus:ring-1 focus:ring-accent-primary"
                  >
                    <option value="Cargo Received">Cargo Received at Origin</option>
                    <option value="Customs Clearance">Customs Cleared</option>
                    <option value="In Transit">In Transit (Vessel En Route)</option>
                    <option value="Delivered">Delivered to Consignee</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Bill of Lading URL / Secure Link</label>
                <Input
                  type="url"
                  placeholder="https://documents.carrier.com/bol/..."
                  value={shippingData.billOfLadingUrl}
                  onChange={(e) => setShippingData({ ...shippingData, billOfLadingUrl: e.target.value })}
                  className="h-8 text-xs font-mono"
                />
              </div>
            </ModalContent>
            <ModalFooter>
              <Button type="button" variant="outline" onClick={() => setShippingModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={savingShipping}>
                {savingShipping ? 'Transmitting...' : 'Register Shipping Manifest'}
              </Button>
            </ModalFooter>
          </form>
        </Modal>
      )}

      {/* RFQ Counter Offer Modal */}
      {rfqModalOpen && (
        <Modal open={rfqModalOpen} onClose={() => setRfqModalOpen(false)}>
          <ModalHeader
            title={`Formal Quotation: ${selectedRFQ?.rfqNumber || ''}`}
            description={`Counter-offer or affirm pricing terms for ${selectedRFQ?.requestedQuantity} units of ${selectedRFQ?.productId?.name}.`}
          />
          <form onSubmit={handleSubmitCounter}>
            <ModalContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Offered Unit Price ($ FOB)</label>
                  <Input
                    type="number"
                    required
                    step="0.01"
                    value={counterData.counterOfferPrice}
                    onChange={(e) => setCounterData({ ...counterData, counterOfferPrice: e.target.value })}
                    className="h-8 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Production Lead Time (Days)</label>
                  <Input
                    type="number"
                    required
                    value={counterData.counterOfferLeadDays}
                    onChange={(e) => setCounterData({ ...counterData, counterOfferLeadDays: e.target.value })}
                    className="h-8 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Quotation Notes / Terms</label>
                <textarea
                  rows={3}
                  value={counterData.sellerNotes}
                  onChange={(e) => setCounterData({ ...counterData, sellerNotes: e.target.value })}
                  placeholder="Specify payment schedule, packaging tolerances, or port terms..."
                  className="w-full text-xs rounded-md border border-border-default bg-surface p-2 text-foreground focus:outline-none focus:ring-1 focus:ring-accent-primary resize-none"
                />
              </div>
            </ModalContent>
            <ModalFooter>
              <Button type="button" variant="outline" onClick={() => setRfqModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submittingCounter}>
                {submittingCounter ? 'Transmitting...' : 'Send Formal Quote'}
              </Button>
            </ModalFooter>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default MyExportsPage;
