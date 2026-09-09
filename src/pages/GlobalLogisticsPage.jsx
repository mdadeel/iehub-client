import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { HiDocumentText, HiClock, HiArrowRight } from 'react-icons/hi';
import { FaShip } from 'react-icons/fa';

// Reference transit times for common corridors — static reference data, not live telemetry.
const CORRIDORS = [
  { name: 'Trans-Pacific Eastbound', route: 'Shanghai / Ningbo → Los Angeles / Long Beach', transitTime: '14–18 days' },
  { name: 'Asia–North Europe', route: 'Singapore / Port Klang → Rotterdam / Hamburg', transitTime: '26–32 days' },
  { name: 'Trans-Atlantic Westbound', route: 'Antwerp / Le Havre → New York / New Jersey', transitTime: '10–13 days' },
  { name: 'Latin America–Europe', route: 'Santos / Paranaguá → Felixstowe / Valencia', transitTime: '18–22 days' },
];

const GlobalLogisticsPage = () => {
  const { user } = useAuth();
  const [transitPOs, setTransitPOs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyShipments = useCallback(async () => {
    if (!user?.email || user.isGuest) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get(`/imports/${encodeURIComponent(user.email)}`);
      const list = Array.isArray(data) ? data : [];
      setTransitPOs(
        list.filter((i) => ['In Transit', 'Customs Clearance', 'Cargo Received'].includes(i.status)).slice(0, 4)
      );
    } catch {
      // Non-fatal: reference content below still renders
    } finally {
      setLoading(false);
    }
  }, [user?.email, user?.isGuest]);

  useEffect(() => {
    fetchMyShipments();
  }, [fetchMyShipments]);

  return (
    <div className="container py-10 md:py-14 max-w-5xl">
      <div className="max-w-2xl mb-10">
        <Badge variant="neutral" size="sm" className="mb-2">
          Shipping Reference
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2">
          Track Shipments
        </h1>
        <p className="text-xs sm:text-sm text-foreground-muted">
          Live status for your cargo lives on each purchase order. Below: your shipments in motion, typical corridor transit times, and how customs clearance works.
        </p>
      </div>

      {/* My Shipments — real data first */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">My Shipments in Motion</h2>
          <Link to="/dashboard/my-imports" className="text-xs font-semibold text-accent-primary hover:underline flex items-center gap-1">
            <span>All Purchase Orders</span>
            <HiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[0, 1].map((i) => (
              <div key={i} className="h-16 rounded-lg border border-border-default bg-surface animate-pulse" />
            ))}
          </div>
        ) : transitPOs.length > 0 ? (
          <Card className="border border-border-default bg-surface overflow-hidden divide-y divide-border-subtle">
            {transitPOs.map((imp) => {
              const prod = imp.productId || {};
              const status = imp.status || 'Confirmed';
              return (
                <Link
                  key={imp._id}
                  to="/dashboard/my-imports"
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 hover:bg-surface-hover/60 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-foreground truncate">
                      {prod.name || 'Consignment'}
                    </div>
                    <div className="text-[11px] text-foreground-muted font-mono flex items-center gap-2 mt-0.5">
                      <span>{imp.poNumber || `PO-${String(imp._id).slice(-6).toUpperCase()}`}</span>
                      <span>&bull;</span>
                      <span className="truncate">{prod.origin || 'Origin'} → {imp.destinationPort || 'Destination'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={status === 'In Transit' ? 'accent' : 'warning'} size="sm" hasDot>
                      {status}
                    </Badge>
                    <HiArrowRight className="w-3.5 h-3.5 text-foreground-muted" />
                  </div>
                </Link>
              );
            })}
          </Card>
        ) : (
          <Card className="p-6 border border-border-default bg-surface text-center">
            <FaShip className="w-6 h-6 text-foreground-muted mx-auto mb-2" />
            <p className="text-xs text-foreground-muted mb-3">
              No shipments in motion. Shipments appear here after a purchase order clears its origin port.
            </p>
            <Button size="sm" variant="outline" asChild>
              <Link to="/products">Browse Marketplace</Link>
            </Button>
          </Card>
        )}
      </section>

      {/* Corridor Reference — static, honestly labeled */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">Typical Corridor Transit Times</h2>
          <Badge variant="neutral" size="sm">Reference</Badge>
        </div>
        <Card className="border border-border-default bg-surface overflow-hidden divide-y divide-border-subtle">
          {CORRIDORS.map((lane) => (
            <div key={lane.name} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <div className="font-semibold text-foreground">{lane.name}</div>
                <div className="text-foreground-muted mt-0.5">{lane.route}</div>
              </div>
              <div className="flex items-center gap-1.5 text-foreground-secondary shrink-0">
                <HiClock className="w-3.5 h-3.5 text-foreground-muted" />
                <span className="font-mono font-semibold text-foreground">{lane.transitTime}</span>
              </div>
            </div>
          ))}
        </Card>
      </section>

      {/* Customs Clearance Explainer — static education */}
      <section>
        <h2 className="text-sm font-semibold text-foreground mb-1">Customs Clearance, Step by Step</h2>
        <p className="text-[11px] text-foreground-muted mb-3">What happens between port arrival and cargo release.</p>
        <div className="grid sm:grid-cols-4 gap-3 text-xs">
          {[
            { step: '01', title: 'Manifest Filed', desc: 'Electronic manifest submitted to port systems' },
            { step: '02', title: 'Inspection & Release', desc: 'Regulated goods pass phytosanitary / safety checks' },
            { step: '03', title: 'Duty Assessment', desc: 'HS classification and import duties validated' },
            { step: '04', title: 'Bill of Lading Issued', desc: 'Carrier releases cargo against the original B/L' },
          ].map((s) => (
            <div key={s.step} className="p-3 rounded-lg border border-border-subtle bg-surface-subtle">
              <div className="font-mono text-[10px] text-foreground-muted">{s.step}</div>
              <div className="font-semibold text-foreground mt-1">{s.title}</div>
              <div className="text-[11px] text-foreground-muted mt-0.5">{s.desc}</div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex gap-2">
          <Button size="sm" asChild>
            <Link to="/dashboard/my-imports">
              <HiDocumentText className="w-3.5 h-3.5 mr-1.5" />
              View My Purchase Orders
            </Link>
          </Button>
          <Button size="sm" variant="outline" onClick={() => window.open('https://www.marinetraffic.com', '_blank', 'noopener')}>
            External AIS Tracker
          </Button>
        </div>
      </section>
    </div>
  );
};

export default GlobalLogisticsPage;
