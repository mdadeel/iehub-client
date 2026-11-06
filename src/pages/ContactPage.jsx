import { HiMail, HiPhone, HiLocationMarker, HiClock } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

import PageHeader from '../components/PageHeader';
const ContactPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Inquiry submitted. A trade desk specialist will respond within 4 business hours.');
    e.target.reset();
  };

  return (
        <>
      <PageHeader
        eyebrow="Trade desk"
        title="Tell us what needs to move."
        description="Send the commodity, the volume and the discharge port. A desk officer replies within four working hours, Dhaka time."
        image="/images/cta-port-night.jpg"
      />
      <div className="container py-12 md:py-16 max-w-5xl">
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
                  Send inquiry to the desk
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Trade Desks & Directory */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative overflow-hidden border border-border-default">
            <img
              src="/images/desk-operations.jpg"
              alt="IEHUB trade desk officers coordinating live shipments"
              className="h-44 w-full object-cover"
              loading="lazy"
            />
            <div className="photo-scrim absolute inset-0" />
            <div className="absolute inset-x-0 bottom-0 p-4 text-white">
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/60">
                Chattogram · head desk
              </div>
              <div className="mt-1 text-sm font-semibold">A named officer on every file</div>
            </div>
          </div>

          <Card className="p-4 border border-border-default bg-surface">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center bg-accent-primary text-white shrink-0 mt-0.5">
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
              <div className="flex h-8 w-8 items-center justify-center bg-accent-primary text-white shrink-0 mt-0.5">
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
              <div className="flex h-8 w-8 items-center justify-center bg-accent-primary text-white shrink-0 mt-0.5">
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
    </>
  );
};

export default ContactPage;
