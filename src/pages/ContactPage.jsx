import { HiMail, HiPhone, HiLocationMarker, HiClock } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const ContactPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Inquiry submitted. A trade desk specialist will respond within 4 business hours.');
    e.target.reset();
  };

  return (
    <div className="container py-12 md:py-16 max-w-5xl">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <Badge variant="neutral" size="sm" className="mb-2">
          Global Trade Desk
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2">
          Contact Commercial Operations
        </h1>
        <p className="text-xs sm:text-sm text-foreground-muted">
          Our international trade specialists, customs brokers, and escrow analysts are available across major global maritime corridors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Form */}
        <div className="lg:col-span-7">
          <Card className="border border-border-default bg-surface shadow-2xs">
            <div className="p-6 border-b border-border-subtle">
              <h2 className="text-sm font-semibold text-foreground">
                Submit Commercial Trade Inquiry
              </h2>
              <p className="text-xs text-foreground-muted">
                Inquire about high-volume FOB purchasing, supplier qualification, or customs clearance support.
              </p>
            </div>

            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">
                      Representative Name
                    </label>
                    <Input required placeholder="John Doe" className="h-9 text-xs" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">
                      Business Email
                    </label>
                    <Input type="email" required placeholder="desk@company.com" className="h-9 text-xs" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Inquiry Category
                  </label>
                  <select className="flex h-9 w-full rounded-md border border-border-default bg-surface px-3 py-1 text-xs text-foreground focus-visible:outline-none focus-visible:border-accent-primary">
                    <option>Bulk Commodity Procurement & Sourcing</option>
                    <option>Exporter Accreditation & KYC Support</option>
                    <option>Customs Manifest & Logistics Telemetry</option>
                    <option>Letter of Credit & Escrow Facilities</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Inquiry Details / Scope
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide commodity requirements, target volumes, Incoterms preference (FOB/CIF), and destination ports..."
                    className="flex w-full rounded-md border border-border-default bg-surface px-3 py-2 text-xs text-foreground placeholder:text-foreground-muted focus-visible:outline-none focus-visible:border-accent-primary"
                  />
                </div>

                <Button type="submit" size="sm" className="w-full h-9 text-xs font-semibold">
                  Transmit Inquiry to Trade Desk
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Trade Desks & Directory */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-4 border border-border-default bg-surface">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-md bg-accent-subtle text-accent-primary shrink-0 mt-0.5">
                <HiMail className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-foreground">Central Trade Desk</div>
                <div className="text-xs text-foreground-secondary font-mono mt-0.5">desk@iehub.global</div>
                <div className="text-[11px] text-foreground-muted mt-0.5">Automated ticketing & SLA response &lt; 4h</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 border border-border-default bg-surface">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-md bg-accent-subtle text-accent-primary shrink-0 mt-0.5">
                <HiPhone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-foreground">Commercial Telephony</div>
                <div className="text-xs text-foreground-secondary font-mono mt-0.5">+1 (888) 434-8221</div>
                <div className="text-[11px] text-foreground-muted mt-0.5">Direct broker hotline for urgent consignments</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 border border-border-default bg-surface">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-md bg-accent-subtle text-accent-primary shrink-0 mt-0.5">
                <HiLocationMarker className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-foreground">Regional Corridors</div>
                <div className="text-xs text-foreground-secondary mt-0.5">Singapore Hub &bull; London Financial &bull; New York</div>
                <div className="text-[11px] text-foreground-muted mt-0.5">Physical customs representations</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 border border-border-default bg-surface-subtle/50">
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-foreground">
              <HiClock className="w-4 h-4 text-accent-primary" />
              <span>Market Trading Windows</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-foreground-secondary">
                <span>Electronic Trading:</span>
                <span className="font-mono text-status-success font-medium">24 / 7 / 365</span>
              </div>
              <div className="flex justify-between text-foreground-secondary">
                <span>Customs Escrow Processing:</span>
                <span className="font-mono">Mon–Fri 08:00–20:00 GMT</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
