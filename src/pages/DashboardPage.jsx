import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import {
  HiDocumentText,
  HiShieldCheck,
  HiArrowRight,
  HiCube,
  HiCheckCircle,
  HiClock,
  HiChevronRight,
  HiExclamation,
} from 'react-icons/hi';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '../components/ui/Table';

// Attention order: blocked customs first, then moving freight, then new POs, delivered last.
const attentionRank = (status) => {
  switch (status) {
    case 'Customs Clearance': return 0;
    case 'In Transit': return 1;
    case 'Cargo Received': return 2;
    case 'Confirmed': return 3;
    default: return 4;
  }
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.email || user.isGuest) {
        setLoading(false);
        return;
      }

      try {
        const [productsRes, importsRes] = await Promise.all([
          api.get(`/products`),
          api.get(`/imports/${encodeURIComponent(user.email)}`),
        ]);

        const allProducts = Array.isArray(productsRes.data) ? productsRes.data : [];
        const myExports = allProducts.filter((p) => p.exporterEmail === user.email);
        const myImports = Array.isArray(importsRes.data) ? importsRes.data : [];

        const importVal = myImports.reduce((acc, curr) => acc + (curr.totalAmount || (curr.quantity * (curr.productId?.price || 0))), 0);

        setStats({
          myExports,
          myImports,
          exportValue: myExports.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0),
          importCommitment: importVal,
        });
      } catch (error) {
        console.error('Dashboard sync failed', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const isGuest = user?.isGuest;
  const myImports = stats?.myImports || [];
  const myExports = stats?.myExports || [];

  const needsAttention = myImports.filter((i) => (i.status || 'Confirmed') === 'Customs Clearance');
  const inTransit = myImports.filter((i) => (i.status || 'Confirmed') === 'In Transit');
  const activePOs = myImports.filter((i) => (i.status || 'Confirmed') !== 'Delivered');

  // KPI row — each metric is real (or clearly demo for guests) and links onward
  const kpis = isGuest
    ? [
        { title: 'Needs Attention', value: '2 Orders', subtext: 'Demo data', icon: HiExclamation, to: null },
        { title: 'In Transit', value: '1 Shipment', subtext: 'Demo data', icon: HiClock, to: null },
        { title: 'Committed Capital', value: '$245,000 USD', subtext: 'Demo data', icon: HiShieldCheck, to: null },
        { title: 'Listed Cargo Lots', value: '6 Lots', subtext: 'Demo data', icon: HiCube, to: null },
      ]
    : [
        { title: 'Needs Attention', value: `${needsAttention.length} Order${needsAttention.length === 1 ? '' : 's'}`, subtext: needsAttention.length > 0 ? 'Customs clearance required' : 'Nothing blocked', icon: HiExclamation, to: '/dashboard/my-imports' },
        { title: 'In Transit', value: `${inTransit.length}`, subtext: 'Shipments at sea', icon: HiClock, to: '/dashboard/my-imports' },
        { title: 'Open Purchase Orders', value: `${activePOs.length}`, subtext: 'Active contracts', icon: HiDocumentText, to: '/dashboard/my-imports' },
        { title: 'Committed Capital', value: `$${stats?.importCommitment?.toLocaleString() || 0}`, subtext: 'Across all POs', icon: HiShieldCheck, to: '/dashboard/my-imports' },
      ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-16 border-b border-border-default" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-lg border border-border-default bg-surface animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-14 rounded-lg border border-border-default bg-surface animate-pulse" />
            ))}
          </div>
          <div className="h-48 rounded-lg border border-border-default bg-surface animate-pulse" />
        </div>
      </div>
    );
  }

  // Worklist sorted by attention, capped
  const worklist = [...myImports]
    .sort((a, b) => attentionRank(a.status) - attentionRank(b.status))
    .slice(0, 6);

  const transitList = inTransit.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Workspace Header — one primary CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border-default">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Trade Operations
          </h1>
          <p className="text-xs text-foreground-muted mt-0.5">
            {isGuest ? 'Demo workspace with sample data — register to trade for real.' : `Managing entity: ${user?.displayName || user?.email}`}
          </p>
        </div>

        {isGuest ? (
          <Button size="sm" asChild className="text-xs h-8 gap-1.5 shrink-0">
            <Link to="/products">
              Browse Marketplace
              <HiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        ) : (
          <Button size="sm" asChild className="text-xs h-8 gap-1.5 shrink-0">
            <Link to="/dashboard/add-export">
              New Listing
              <HiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        )}
      </div>

      {/* KPI Grid — compact, real, actionable */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          const content = (
            <CardContent className="p-3.5">
              <div className="flex items-center justify-between text-foreground-muted mb-1.5">
                <span className="text-[11px] font-medium tracking-wide">
                  {kpi.title}
                </span>
                <Icon className={`w-4 h-4 ${idx === 0 && !isGuest && needsAttention.length > 0 ? 'text-status-warning' : 'text-foreground-muted'}`} />
              </div>
              <div className="text-lg font-bold text-foreground tracking-tight tabular-nums">
                {kpi.value}
              </div>
              <div className="text-[11px] text-foreground-muted">
                {kpi.subtext}
              </div>
            </CardContent>
          );
          return kpi.to ? (
            <Link key={idx} to={kpi.to} className="block rounded-lg border border-border-default bg-surface shadow-2xs hover:border-border-hover transition-colors">
              {content}
            </Link>
          ) : (
            <Card key={idx} className="border border-border-default bg-surface shadow-2xs">{content}</Card>
          );
        })}
      </div>

      {/* Priority Worklist + Transit Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Purchase Orders
              </h2>
              <p className="text-[11px] text-foreground-muted">
                Blocked customs first, then in transit
              </p>
            </div>
            <Link
              to="/dashboard/my-imports"
              className="text-xs font-semibold text-accent-primary hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <HiChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="rounded-lg border border-border-default bg-surface overflow-hidden shadow-2xs">
            <Table>
              <TableHeader>
                <TableRow className="text-[10px]">
                  <TableHead>PO / Commodity</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {worklist.length > 0 ? (
                  worklist.map((imp) => {
                    const prod = imp.productId || {};
                    const status = imp.status || 'Confirmed';
                    const isBlocked = status === 'Customs Clearance';
                    return (
                      <TableRow key={imp._id} className="text-xs cursor-pointer hover:bg-surface-subtle/50">
                        <TableCell className="py-2.5">
                          <div className="font-medium text-foreground truncate max-w-[180px]">
                            {prod.name || 'Commodity Batch'}
                          </div>
                          <div className="font-mono text-[10px] text-foreground-muted">
                            {imp.poNumber || `PO-${String(imp._id).slice(-6).toUpperCase()}`}
                          </div>
                        </TableCell>
                        <TableCell className="py-2.5 text-foreground-secondary text-[11px] truncate max-w-[140px]">
                          {imp.destinationPort || prod.origin || '—'}
                        </TableCell>
                        <TableCell className="py-2.5 text-right font-mono text-foreground tabular-nums">
                          ${(imp.totalAmount || (imp.quantity * (prod.price || 0))).toLocaleString()}
                        </TableCell>
                        <TableCell className="py-2.5 text-center">
                          <Badge variant={isBlocked ? 'warning' : status === 'In Transit' ? 'accent' : status === 'Delivered' ? 'success' : 'neutral'} size="sm" hasDot className="text-[10px]">
                            {status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="py-0">
                      <EmptyState
                        icon={HiDocumentText}
                        title="No purchase orders yet"
                        description="Browse the marketplace to issue your first purchase order."
                        className="min-h-[160px] border-0 bg-transparent"
                        action={
                          <Button size="sm" variant="outline" asChild>
                            <Link to="/products">Browse Marketplace</Link>
                          </Button>
                        }
                      />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* In-Transit Column — real data only */}
        <div className="space-y-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              In Transit
            </h2>
            <p className="text-[11px] text-foreground-muted">
              Shipments currently moving
            </p>
          </div>

          <Card className="border border-border-default bg-surface shadow-2xs">
            <CardContent className="p-4 space-y-3">
              {transitList.length > 0 ? (
                transitList.map((imp) => {
                  const prod = imp.productId || {};
                  return (
                    <Link
                      key={imp._id}
                      to="/dashboard/my-imports"
                      className="block p-3 rounded-md bg-surface-subtle border border-border-subtle space-y-1.5 hover:border-border-hover transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs gap-2">
                        <span className="font-semibold text-foreground truncate">
                          {prod.name || 'Consignment'}
                        </span>
                        <Badge variant="accent" size="sm" hasDot className="text-[10px] shrink-0">
                          At Sea
                        </Badge>
                      </div>
                      <div className="text-[11px] text-foreground-secondary flex items-center gap-1.5 font-mono">
                        <span className="truncate">{prod.origin || 'Origin port'}</span>
                        <HiArrowRight className="w-3 h-3 text-accent-primary shrink-0" />
                        <span className="truncate">{imp.destinationPort || 'Destination'}</span>
                      </div>
                      <div className="text-[10px] text-foreground-muted flex items-center gap-1">
                        <HiClock className="w-3 h-3" />
                        <span>{imp.poNumber || `PO-${String(imp._id).slice(-6).toUpperCase()}`}</span>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="py-6 text-center">
                  <p className="text-xs text-foreground-muted mb-1">
                    {isGuest ? 'No demo shipments at sea right now.' : 'No shipments currently at sea.'}
                  </p>
                  {!isGuest && myExports.length > 0 && (
                    <p className="text-[11px] text-foreground-muted">
                      {myExports.length} listing{myExports.length === 1 ? '' : 's'} active · ${stats?.exportValue?.toLocaleString() || 0} inventory value
                    </p>
                  )}
                </div>
              )}

              <div className="pt-2 border-t border-border-subtle">
                <Link
                  to="/dashboard/my-imports"
                  className="text-xs font-semibold text-accent-primary hover:underline flex items-center justify-between"
                >
                  <span>Track All Shipments</span>
                  <HiArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {!isGuest && myExports.length > 0 && (
            <div className="flex items-center gap-2 p-3 rounded-md border border-border-default bg-surface text-xs">
              <HiCheckCircle className="w-4 h-4 text-status-success shrink-0" />
              <span className="text-foreground-secondary">
                {myExports.length} listing{myExports.length === 1 ? '' : 's'} live on the marketplace
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
