import { useState } from 'react';
import { HiMail, HiPhone, HiLocationMarker, HiClock, HiArrowRight } from 'react-icons/hi';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

import PageHeader from '../components/PageHeader';
import SEOHead from '../components/SEOHead';
const EMPTY_INQUIRY = {
  name: '',
  email: '',
  category: 'Bulk Commodity Procurement & Sourcing',
  message: '',
};

const DESK_EMAIL = 'desk@iehub.global';

const ContactPage = () => {
  const [form, setForm] = useState(EMPTY_INQUIRY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState(null);
  const [deskOffline, setDeskOffline] = useState(false);

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const mailtoHref = () => {
    const subject = encodeURIComponent(`Trade inquiry — ${form.category}`);
    const body = encodeURIComponent(
      `${form.message}\n\n—\n${form.name}\n${form.email}`
    );
    return `mailto:${DESK_EMAIL}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = 'Tell us who is writing.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) {
      next.email = 'Use a business email we can reply to.';
    }
    if (form.message.trim().length < 20) {
      next.message = 'Add the commodity, target volume and destination port (20+ characters).';
    }
    setErrors(next);
    if (Object.keys(next).length > 0) {
      document.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await api.post('/inquiries', {
        ...form,
        source: 'contact-page',
      });
      setReference(data?.id || data?.reference || null);
      setDeskOffline(false);
      setForm(EMPTY_INQUIRY);
      toast.success('Inquiry received. A desk officer replies within four working hours.');
    } catch (error) {
      const status = error?.response?.status;
      // 404/501 = the endpoint is not deployed yet. Say so instead of faking a send.
      if (!status || status === 404 || status === 501) {
        setDeskOffline(true);
        toast.error('The desk inbox is not connected yet — send it by email instead.');
      } else {
        toast.error(
          error.response?.data?.message ||
            `Could not reach the desk. Email ${DESK_EMAIL} and we will reply.`
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
        <>
      <SEOHead
        title="Contact the Trade Desk | IEHUB"
        description="Send commodity, volume and discharge port. A desk officer replies within four working hours, Dhaka time."
        canonicalUrl="https://iehub-client.vercel.app/contact"
      />

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
                    <label htmlFor="inq-name" className="text-xs font-medium text-foreground">
                      Representative name *
                    </label>
                    <Input
                      id="inq-name"
                      name="name"
                      value={form.name}
                      onChange={update('name')}
                      error={errors.name}
                      placeholder="Ayesha Rahman"
                      className="h-9 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="inq-email" className="text-xs font-medium text-foreground">
                      Business email *
                    </label>
                    <Input
                      id="inq-email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={update('email')}
                      error={errors.email}
                      placeholder="desk@company.com"
                      className="h-9 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="inq-category" className="text-xs font-medium text-foreground">
                    Inquiry category
                  </label>
                  <select
                    id="inq-category"
                    name="category"
                    value={form.category}
                    onChange={update('category')}
                    className="flex h-9 w-full rounded-md border border-border-default bg-surface px-3 py-1 text-xs text-foreground focus-visible:outline-none focus-visible:border-accent-primary"
                  >
                    <option>Bulk Commodity Procurement &amp; Sourcing</option>
                    <option>Exporter Accreditation &amp; KYC Support</option>
                    <option>Customs Manifest &amp; Logistics Telemetry</option>
                    <option>Letter of Credit &amp; Escrow Facilities</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="inq-message" className="text-xs font-medium text-foreground">
                    Inquiry details / scope *
                  </label>
                  <textarea
                    id="inq-message"
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={update('message')}
                    aria-invalid={errors.message ? 'true' : undefined}
                    placeholder="Commodity, target volume, Incoterm (FOB/CIF) and destination port…"
                    className={`flex w-full rounded-md border bg-surface px-3 py-2 text-xs text-foreground placeholder:text-foreground-muted focus-visible:outline-none focus-visible:border-accent-primary ${
                      errors.message ? 'border-status-danger' : 'border-border-default'
                    }`}
                  />
                  {errors.message && (
                    <p role="alert" className="text-[11px] font-medium text-status-danger">
                      {errors.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="sm"
                  disabled={submitting}
                  className="w-full h-9 text-xs font-semibold"
                >
                  {submitting ? 'Sending to the desk…' : 'Send inquiry to the desk'}
                </Button>

                {reference && (
                  <p className="text-[11px] text-foreground-muted">
                    Reference <span className="font-mono text-foreground">{reference}</span> — quote it
                    if you follow up.
                  </p>
                )}

                {deskOffline && (
                  <div className="border border-status-warning/30 bg-status-warning-bg p-3">
                    <p className="text-[11px] font-semibold text-status-warning">
                      Direct line — the desk inbox is not accepting submissions yet.
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-foreground-secondary">
                      Your text is kept in the form. Send it by email and a named officer will reply
                      within four working hours.
                    </p>
                    <a
                      href={mailtoHref()}
                      className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-accent-primary hover:underline"
                    >
                      Email {DESK_EMAIL} <HiArrowRight className="h-3 w-3" />
                    </a>
                  </div>
                )}
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
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
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
                <div className="text-[13px] text-foreground-muted mt-0.5">Automated ticketing & SLA response &lt; 4h</div>
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
                <div className="text-[13px] text-foreground-muted mt-0.5">Direct broker hotline for urgent consignments</div>
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
                <div className="text-[13px] text-foreground-muted mt-0.5">Physical customs representations</div>
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
