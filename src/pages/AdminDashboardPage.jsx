import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import {
  HiLogout,
  HiShieldCheck,
  HiCheckCircle,
  HiExclamationCircle,
  HiOfficeBuilding,
  HiClipboardList,
  HiScale,
  HiDocumentReport,
  HiRefresh,
  HiCurrencyDollar,
  HiShoppingCart,
} from 'react-icons/hi';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
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
import { Modal, ModalHeader, ModalContent, ModalFooter } from '../components/ui/Modal';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Data states
  const [metrics, setMetrics] = useState({
    totalGMV: 0,
    activeOrders: 0,
    totalListings: 0,
    pendingListings: 0,
    openDisputes: 0,
    pendingKYB: 0,
    totalEntities: 0,
  });
  const [products, setProducts] = useState([]);
  const [entities, setEntities] = useState([]);
  const [orders, setOrders] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Dispute resolution modal state
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [resolutionType, setResolutionType] = useState('Buyer Refund');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [resolving, setResolving] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      setRefreshing(true);
      const [metricsRes, prodsRes, entitiesRes, ordersRes, disputesRes, auditRes] =
        await Promise.allSettled([
          api.get('/admin/metrics'),
          api.get('/products'),
          api.get('/admin/entities'),
          api.get('/admin/orders'),
          api.get('/disputes'),
          api.get('/admin/audit-logs'),
        ]);

      if (metricsRes.status === 'fulfilled') setMetrics(metricsRes.value.data);
      if (prodsRes.status === 'fulfilled') setProducts(Array.isArray(prodsRes.value.data) ? prodsRes.value.data : []);
      if (entitiesRes.status === 'fulfilled') setEntities(Array.isArray(entitiesRes.value.data) ? entitiesRes.value.data : []);
      if (ordersRes.status === 'fulfilled') setOrders(Array.isArray(ordersRes.value.data) ? ordersRes.value.data : []);
      if (disputesRes.status === 'fulfilled') setDisputes(Array.isArray(disputesRes.value.data) ? disputesRes.value.data : []);
      if (auditRes.status === 'fulfilled') setAuditLogs(Array.isArray(auditRes.value.data) ? auditRes.value.data : []);
    } catch {
      toast.error('Failed to synchronize mission control state.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (!user?.isAdmin && user?.userType !== 'demo-admin') {
      toast.error('Administrative privileges required.');
      navigate('/admin/login');
      return;
    }

    fetchDashboardData();
  }, [user, authLoading, navigate, fetchDashboardData]);

  const handleLogout = async () => {
    await logout();
    toast.success('Admin session terminated.');
    navigate('/admin/login');
  };

  const verifyProduct = async (id, status, badgeText = 'SGS Certified') => {
    try {
      await api.patch(`/products/${id}/verify`, { status, badge: status === 'verified' ? badgeText : 'Rejected' });
      toast.success(`Listing marked ${status}.`);
      setProducts((prev) => prev.map((p) => (p._id === id ? { ...p, verificationStatus: status } : p)));
      setMetrics((m) => ({
        ...m,
        pendingListings: Math.max(0, m.pendingListings - 1),
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update listing.');
    }
  };

  const updateKYB = async (companyId, kybStatus) => {
    try {
      await api.patch(`/admin/entities/${companyId}/kyb`, { kybStatus });
      toast.success(`Company KYB status updated to ${kybStatus}.`);
      setEntities((prev) => prev.map((e) => (e._id === companyId ? { ...e, kybStatus } : e)));
      setMetrics((m) => ({
        ...m,
        pendingKYB: kybStatus === 'Verified' ? Math.max(0, m.pendingKYB - 1) : m.pendingKYB,
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update KYB status.');
    }
  };

  const handleResolveDispute = async (e) => {
    e.preventDefault();
    if (!selectedDispute) return;
    setResolving(true);
    try {
      await api.patch(`/disputes/${selectedDispute._id}/resolve`, {
        resolution: resolutionType,
        resolutionNotes,
      });
      toast.success(`Dispute ${selectedDispute.disputeNumber} arbitrated successfully.`);
      setSelectedDispute(null);
      setResolutionNotes('');
      fetchDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resolve dispute.');
    } finally {
      setResolving(false);
    }
  };

  const pendingListings = products.filter((p) => p.verificationStatus === 'pending');

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas py-24 text-center">
        <div className="w-8 h-8 border-2 border-border-default border-t-accent-primary rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-foreground-muted">Initializing Enterprise Mission Control...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      {/* Top Header */}
      <header className="h-14 bg-surface border-b border-border-default flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-accent-primary text-accent-contrast flex items-center justify-center font-black text-xs">
            IE
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs tracking-tight text-foreground">
                Super Admin Mission Control
              </span>
              <Badge variant="accent" size="sm" className="h-4 text-[10px] px-1.5 py-0 font-mono">
                RBAC Level 0
              </Badge>
            </div>
            <p className="text-[10px] text-foreground-muted hidden sm:block">
              Full Governance: KYB, Escrow, Catalog, Arbitration & Compliance Audit
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchDashboardData}
            disabled={refreshing}
            className="h-7 text-xs text-foreground-muted hover:text-foreground"
          >
            <HiRefresh className={`w-3.5 h-3.5 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
            Sync
          </Button>
          <div className="h-4 w-px bg-border-default" />
          <span className="text-[11px] text-foreground-muted font-mono hidden md:inline">
            {user?.email || 'admin@importexport.com'}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="h-7 text-xs text-status-danger hover:bg-status-danger/10 hover:text-status-danger"
          >
            <HiLogout className="w-3.5 h-3.5 mr-1" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between border-b border-border-default pb-3">
            <TabsList className="bg-surface-subtle border border-border-default flex-wrap">
              <TabsTrigger value="overview">
                Overview
              </TabsTrigger>
              <TabsTrigger value="listings">
                Listings Queue
                {pendingListings.length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-status-warning/20 text-status-warning font-semibold">
                    {pendingListings.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="entities">
                KYB & Entities
                {metrics.pendingKYB > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-status-warning/20 text-status-warning font-semibold">
                    {metrics.pendingKYB}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="orders">
                Global Orders ({orders.length})
              </TabsTrigger>
              <TabsTrigger value="disputes">
                Dispute Center
                {disputes.filter((d) => d.status !== 'Resolved').length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-status-danger/20 text-status-danger font-semibold">
                    {disputes.filter((d) => d.status !== 'Resolved').length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="audit">
                Audit Trail
              </TabsTrigger>
            </TabsList>
          </div>

          {/* TAB 1: OVERVIEW */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <Card className="p-4 border border-border-default bg-surface shadow-2xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-foreground-muted font-medium">Total GMV</span>
                  <HiCurrencyDollar className="w-4 h-4 text-accent-primary" />
                </div>
                <div className="text-xl font-bold text-foreground tabular-nums">
                  ${(metrics.totalGMV || 0).toLocaleString()}
                </div>
                <div className="text-[10px] text-foreground-muted mt-1">Platform volume</div>
              </Card>

              <Card className="p-4 border border-border-default bg-surface shadow-2xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-foreground-muted font-medium">Active POs</span>
                  <HiShoppingCart className="w-4 h-4 text-status-info" />
                </div>
                <div className="text-xl font-bold text-foreground tabular-nums">
                  {metrics.activeOrders || orders.length}
                </div>
                <div className="text-[10px] text-foreground-muted mt-1">Purchase orders in transit</div>
              </Card>

              <Card className="p-4 border border-border-default bg-surface shadow-2xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-foreground-muted font-medium">Pending Listings</span>
                  <HiClipboardList className="w-4 h-4 text-status-warning" />
                </div>
                <div className="text-xl font-bold text-foreground tabular-nums">
                  {pendingListings.length}
                </div>
                <div className="text-[10px] text-foreground-muted mt-1">Awaiting inspection</div>
              </Card>

              <Card className="p-4 border border-border-default bg-surface shadow-2xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-foreground-muted font-medium">Pending KYB</span>
                  <HiOfficeBuilding className="w-4 h-4 text-status-warning" />
                </div>
                <div className="text-xl font-bold text-foreground tabular-nums">
                  {entities.filter((e) => e.kybStatus === 'Pending' || e.kybStatus === 'Under Review').length}
                </div>
                <div className="text-[10px] text-foreground-muted mt-1">Corporate vetting</div>
              </Card>

              <Card className="p-4 border border-border-default bg-surface shadow-2xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-foreground-muted font-medium">Open Disputes</span>
                  <HiScale className="w-4 h-4 text-status-danger" />
                </div>
                <div className="text-xl font-bold text-foreground tabular-nums text-status-danger">
                  {disputes.filter((d) => d.status !== 'Resolved').length}
                </div>
                <div className="text-[10px] text-foreground-muted mt-1">Require arbitration</div>
              </Card>

              <Card className="p-4 border border-border-default bg-surface shadow-2xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-foreground-muted font-medium">Total Entities</span>
                  <HiShieldCheck className="w-4 h-4 text-status-success" />
                </div>
                <div className="text-xl font-bold text-foreground tabular-nums">
                  {entities.length || metrics.totalEntities}
                </div>
                <div className="text-[10px] text-foreground-muted mt-1">Registered businesses</div>
              </Card>
            </div>

            {/* Quick Action Alerts */}
            {(pendingListings.length > 0 || disputes.some((d) => d.status !== 'Resolved')) && (
              <div className="p-4 rounded-lg bg-status-warning/10 border border-status-warning/20 flex items-start gap-3">
                <HiExclamationCircle className="w-5 h-5 text-status-warning shrink-0 mt-0.5" />
                <div className="flex-1 text-xs">
                  <span className="font-semibold text-foreground">Operational Attention Required: </span>
                  <span className="text-foreground-muted">
                    {pendingListings.length} listing(s) awaiting approval and{' '}
                    {disputes.filter((d) => d.status !== 'Resolved').length} commercial dispute(s) require intervention.
                  </span>
                </div>
                <Button size="sm" variant="outline" onClick={() => setActiveTab(pendingListings.length > 0 ? 'listings' : 'disputes')}>
                  Review Pending
                </Button>
              </div>
            )}

            {/* Recent Audit Activity Preview */}
            <Card className="border border-border-default bg-surface shadow-2xs">
              <div className="px-5 py-3 border-b border-border-subtle flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HiDocumentReport className="w-4 h-4 text-accent-primary" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider font-mono text-foreground">
                    Live Security & Compliance Stream
                  </h3>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab('audit')} className="text-xs h-7">
                  View Full Audit Log
                </Button>
              </div>
              <div className="divide-y divide-border-subtle">
                {auditLogs.slice(0, 5).map((log) => (
                  <div key={log._id} className="p-3 text-xs flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <span className="font-semibold text-foreground font-mono">{log.action}</span>
                      <span className="text-foreground-muted ml-2">by {log.actorEmail}</span>
                      <span className="text-foreground-muted block text-[11px] truncate">
                        Resource: {log.targetResource} &bull; ID: {log.targetId}
                      </span>
                    </div>
                    <span className="text-[11px] text-foreground-muted font-mono shrink-0">
                      {new Date(log.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
                {auditLogs.length === 0 && (
                  <div className="p-6 text-center text-xs text-foreground-muted">
                    No compliance events logged in current window.
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* TAB 2: LISTINGS QUEUE */}
          <TabsContent value="listings" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-foreground">Marketplace Catalog Review</h2>
                <p className="text-xs text-foreground-muted">Enforce HS codes, origin validation, and SGS quality standards.</p>
              </div>
              <Badge variant="warning" size="sm">{pendingListings.length} Pending Approval</Badge>
            </div>

            {pendingListings.length > 0 ? (
              <Card className="border border-border-default bg-surface shadow-2xs overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product / Commodity</TableHead>
                      <TableHead>Origin / HS Code</TableHead>
                      <TableHead>Price / Incoterm</TableHead>
                      <TableHead>Exporter</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingListings.map((p) => (
                      <TableRow key={p._id}>
                        <TableCell>
                          <div className="font-semibold text-xs text-foreground">{p.name}</div>
                          <div className="text-[11px] text-foreground-muted">{p.category} &bull; MOQ: {p.moq || 1} {p.unit}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs text-foreground">{p.origin}</div>
                          <div className="text-[11px] font-mono text-accent-primary">HS: {p.hsCode || 'Standard'}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs font-semibold tabular-nums text-foreground">${p.price?.toLocaleString()}</div>
                          <div className="text-[11px] text-foreground-muted">{p.incoterm || 'FOB'}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs text-foreground truncate max-w-[180px]">{p.exporterEmail}</div>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button size="sm" onClick={() => verifyProduct(p._id, 'verified', 'SGS Certified')} className="h-7 text-xs">
                            SGS Verify
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => verifyProduct(p._id, 'rejected')} className="h-7 text-xs text-status-danger border-status-danger/30 hover:bg-status-danger/10">
                            Reject
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            ) : (
              <EmptyState
                icon={HiCheckCircle}
                title="Catalog Verification Queue is Clear"
                description="No products are pending review. New listings will automatically appear in this pipeline."
                className="min-h-[220px]"
              />
            )}
          </TabsContent>

          {/* TAB 3: ENTITIES & KYB */}
          <TabsContent value="entities" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-foreground">Know Your Business (KYB) Verification</h2>
                <p className="text-xs text-foreground-muted">Corporate registry authentication, tax registration, and entity risk profiling.</p>
              </div>
              <Badge variant="accent" size="sm">{entities.length} Registered Entities</Badge>
            </div>

            {entities.length > 0 ? (
              <Card className="border border-border-default bg-surface shadow-2xs overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company Legal Name</TableHead>
                      <TableHead>Country / Reg No.</TableHead>
                      <TableHead>Tax / VAT ID</TableHead>
                      <TableHead>Owner / Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">KYB Decision</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entities.map((company) => (
                      <TableRow key={company._id}>
                        <TableCell>
                          <div className="font-semibold text-xs text-foreground">{company.companyName}</div>
                          <div className="text-[11px] text-foreground-muted font-mono">Entity ID: {company._id?.slice(-8)}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs text-foreground">{company.country}</div>
                          <div className="text-[11px] font-mono text-foreground-muted">Reg: {company.registrationNumber || 'Pending'}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs font-mono text-foreground">{company.taxId || 'N/A'}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs text-foreground truncate max-w-[160px]">{company.ownerEmail}</div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={company.kybStatus === 'Verified' ? 'success' : company.kybStatus === 'Rejected' ? 'danger' : 'warning'}
                            size="sm"
                          >
                            {company.kybStatus || 'Pending'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            size="sm"
                            variant={company.kybStatus === 'Verified' ? 'ghost' : 'default'}
                            disabled={company.kybStatus === 'Verified'}
                            onClick={() => updateKYB(company._id, 'Verified')}
                            className="h-7 text-xs"
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={company.kybStatus === 'Rejected'}
                            onClick={() => updateKYB(company._id, 'Rejected')}
                            className="h-7 text-xs text-status-danger hover:bg-status-danger/10"
                          >
                            Reject
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            ) : (
              <EmptyState
                icon={HiOfficeBuilding}
                title="No Corporate Entities Registered"
                description="Corporate profiles created by buyers and exporters will appear here for statutory due diligence."
                className="min-h-[220px]"
              />
            )}
          </TabsContent>

          {/* TAB 4: GLOBAL ORDERS */}
          <TabsContent value="orders" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-foreground">Global Purchase Order Registry</h2>
                <p className="text-xs text-foreground-muted">Real-time trade flow oversight across all importers and exporters.</p>
              </div>
              <Badge variant="neutral" size="sm">{orders.length} Executed Orders</Badge>
            </div>

            {orders.length > 0 ? (
              <Card className="border border-border-default bg-surface shadow-2xs overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>PO Reference</TableHead>
                      <TableHead>Commodity / Port</TableHead>
                      <TableHead>Buyer & Seller</TableHead>
                      <TableHead>Volume & Value</TableHead>
                      <TableHead>Escrow / Bilateral</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((po) => (
                      <TableRow key={po._id}>
                        <TableCell>
                          <div className="font-semibold text-xs font-mono text-foreground">{po.poNumber || po._id?.slice(-8)}</div>
                          <div className="text-[11px] text-foreground-muted">{new Date(po.createdAt).toLocaleDateString()}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs font-semibold text-foreground">{po.productId?.name || 'Commodity'}</div>
                          <div className="text-[11px] text-foreground-muted">{po.destinationPort || 'Standard POD'} &bull; {po.incoterm || 'FOB'}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-[11px] text-foreground truncate max-w-[160px]">B: {po.userEmail}</div>
                          <div className="text-[11px] text-foreground-muted truncate max-w-[160px]">S: {po.productId?.exporterEmail || 'Exporter'}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs font-bold tabular-nums text-foreground">
                            ${((po.totalPrice || (po.quantity * (po.productId?.price || 0)))).toLocaleString()}
                          </div>
                          <div className="text-[11px] text-foreground-muted">{po.quantity} Units</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge
                              variant={po.escrowStatus === 'Released' ? 'success' : po.escrowStatus === 'Funded' ? 'accent' : 'neutral'}
                              size="sm"
                              className="text-[10px] w-fit"
                            >
                              Escrow: {po.escrowStatus || 'None'}
                            </Badge>
                            <span className="text-[10px] text-foreground-muted">
                              Seller: {po.sellerAccepted || 'Pending'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={po.status === 'Delivered' ? 'success' : po.status === 'Disputed' ? 'danger' : 'accent'}
                            size="sm"
                          >
                            {po.status || 'Confirmed'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            ) : (
              <EmptyState
                icon={HiShoppingCart}
                title="No Purchase Orders Recorded"
                description="Purchase orders executed on the platform will be registered into this global ledger."
                className="min-h-[220px]"
              />
            )}
          </TabsContent>

          {/* TAB 5: DISPUTE ARBITRATION CENTER */}
          <TabsContent value="disputes" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-foreground">Commercial Dispute Arbitration</h2>
                <p className="text-xs text-foreground-muted">Adjudicate contract disputes, cargo damage claims, and escrow release settlements.</p>
              </div>
              <Badge variant={disputes.some((d) => d.status !== 'Resolved') ? 'danger' : 'success'} size="sm">
                {disputes.filter((d) => d.status !== 'Resolved').length} Open Claims
              </Badge>
            </div>

            {disputes.length > 0 ? (
              <Card className="border border-border-default bg-surface shadow-2xs overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Claim ID</TableHead>
                      <TableHead>PO Reference</TableHead>
                      <TableHead>Claimant / Reason</TableHead>
                      <TableHead>Disputed Sum</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {disputes.map((d) => (
                      <TableRow key={d._id}>
                        <TableCell>
                          <div className="font-semibold text-xs font-mono text-foreground">{d.disputeNumber || d._id?.slice(-8)}</div>
                          <div className="text-[11px] text-foreground-muted">{new Date(d.createdAt).toLocaleDateString()}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs font-mono text-foreground">{d.orderId?.poNumber || 'PO Link'}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs font-semibold text-foreground">{d.reason}</div>
                          <div className="text-[11px] text-foreground-muted truncate max-w-[200px]">By: {d.claimantEmail}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs font-bold tabular-nums text-status-danger">${(d.disputedAmount || 0).toLocaleString()}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={d.status === 'Resolved' ? 'success' : d.status === 'Under Review' ? 'warning' : 'danger'} size="sm">
                            {d.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {d.status !== 'Resolved' ? (
                            <Button size="sm" onClick={() => setSelectedDispute(d)} className="h-7 text-xs">
                              Arbitrate
                            </Button>
                          ) : (
                            <span className="text-[11px] text-status-success font-semibold">
                              {d.resolution}
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
                icon={HiScale}
                title="No Disputes on Record"
                description="Zero active commercial disputes. Escrow settlements and trades are proceeding nominally."
                className="min-h-[220px]"
              />
            )}
          </TabsContent>

          {/* TAB 6: AUDIT TRAIL */}
          <TabsContent value="audit" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-foreground">Immutable Compliance Audit Log</h2>
                <p className="text-xs text-foreground-muted">System-wide append-only ledger tracking all administrative and high-value actions.</p>
              </div>
              <Badge variant="neutral" size="sm">{auditLogs.length} Events Recorded</Badge>
            </div>

            {auditLogs.length > 0 ? (
              <Card className="border border-border-default bg-surface shadow-2xs overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Operator</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Target Resource</TableHead>
                      <TableHead>Resource ID</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map((log) => (
                      <TableRow key={log._id}>
                        <TableCell className="text-[11px] font-mono text-foreground-muted whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-xs font-semibold text-foreground truncate max-w-[150px]">
                          {log.actorEmail}
                        </TableCell>
                        <TableCell>
                          <Badge variant="accent" size="sm" className="font-mono text-[10px]">
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-foreground font-mono">
                          {log.targetResource}
                        </TableCell>
                        <TableCell className="text-[11px] text-foreground-muted font-mono">
                          {log.targetId ? log.targetId.slice(-8) : '-'}
                        </TableCell>
                        <TableCell className="text-[11px] text-foreground-muted font-mono truncate max-w-[200px]">
                          {typeof log.details === 'object' ? JSON.stringify(log.details) : String(log.details || '')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            ) : (
              <EmptyState
                icon={HiDocumentReport}
                title="Audit Trail Stream Clear"
                description="Administrative interventions, verification updates, and escrow transactions will appear here."
                className="min-h-[220px]"
              />
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Dispute Arbitration Modal */}
      {selectedDispute && (
        <Modal open={!!selectedDispute} onClose={() => setSelectedDispute(null)}>
          <ModalHeader
            title={`Arbitrate Dispute: ${selectedDispute.disputeNumber || selectedDispute._id?.slice(-8)}`}
            description="Exercise fiduciary platform authority. Your decision will be logged immutably."
          />
          <form onSubmit={handleResolveDispute}>
            <ModalContent className="space-y-4">
              <div className="p-3 bg-surface-subtle border border-border-default rounded-md text-xs space-y-1">
                <div><span className="font-semibold text-foreground">Claimant:</span> {selectedDispute.claimantEmail}</div>
                <div><span className="font-semibold text-foreground">Reason:</span> {selectedDispute.reason}</div>
                <div><span className="font-semibold text-foreground">Claimed Sum:</span> ${selectedDispute.disputedAmount?.toLocaleString()}</div>
                <div><span className="font-semibold text-foreground">Claim Statement:</span> {selectedDispute.description || 'No statement provided.'}</div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Arbitration Decision
                </label>
                <select
                  value={resolutionType}
                  onChange={(e) => setResolutionType(e.target.value)}
                  className="w-full text-xs rounded-md border border-border-default bg-surface px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-accent-primary"
                >
                  <option value="Buyer Refund">Buyer Refund (Release escrow funds back to importer)</option>
                  <option value="Seller Release">Seller Release (Discharge escrow funds to exporter)</option>
                  <option value="Split Settlement">Split Settlement (50/50 mutual commercial compromise)</option>
                  <option value="Dismissed">Dismissed (Claim rejected without escrow impact)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Arbitration Findings & Legal Notes *
                </label>
                <textarea
                  required
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Detail the documentary inspection, bill of lading review, or contractual basis for this ruling..."
                  className="w-full text-xs rounded-md border border-border-default bg-surface p-2 text-foreground focus:outline-none focus:ring-1 focus:ring-accent-primary resize-none"
                />
              </div>
            </ModalContent>
            <ModalFooter>
              <Button type="button" variant="outline" onClick={() => setSelectedDispute(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={resolving || !resolutionNotes}>
                {resolving ? 'Issuing Ruling...' : 'Enact Arbitration Ruling'}
              </Button>
            </ModalFooter>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminDashboardPage;
