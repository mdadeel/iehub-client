import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  HiLockClosed,
  HiOfficeBuilding,
  HiCurrencyDollar,
} from 'react-icons/hi';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { WebhooksManager } from '../components/WebhooksManager';

const ProfilePage = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'identity';
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null); // last loaded server state (for KYB badge)
  const isGuestUser = user?.isGuest;

  const emptyForm = {
    displayName: user?.displayName || '',
    email: user?.email || '',
    companyLegalName: '',
    taxId: '',
    eoriNumber: '',
    customsBroker: '',
    portOfPreference: '',
    settlementCurrency: 'USD',
    swiftBic: '',
    escrowBeneficiary: '',
  };

  const [formData, setFormData] = useState(emptyForm);

  const loadCompanyProfile = useCallback(async () => {
    if (!user?.email) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get(`/company/${encodeURIComponent(user.email)}`);
      setProfile(data || null);
      setFormData((prev) => ({
        ...prev,
        ...data,
        displayName: user?.displayName || data?.displayName || prev.displayName,
        email: user?.email || data?.email || prev.email,
      }));
    } catch (err) {
      console.error('Failed to load corporate profile:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.email, user?.displayName]);

  useEffect(() => {
    loadCompanyProfile();
  }, [loadCompanyProfile]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.post('/company', {
        userId: user?.uid || 'guest-operator',
        userEmail: formData.email,
        companyLegalName: formData.companyLegalName,
        taxId: formData.taxId,
        eoriNumber: formData.eoriNumber,
        customsBroker: formData.customsBroker,
        portOfPreference: formData.portOfPreference,
        settlementCurrency: formData.settlementCurrency,
        swiftBic: formData.swiftBic,
        escrowBeneficiary: formData.escrowBeneficiary,
      });
      setProfile(data);
      toast.success('Company profile saved.');
      setIsEditing(false);
    } catch (err) {
      console.error('Save failed:', err);
      toast.error(err.response?.data?.message || 'Failed to save company profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-2 border-border-default border-t-accent-primary rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-foreground-muted">Loading company profile...</p>
      </div>
    );
  }

  const kybStatus = profile?.kybStatus;
  const hasLegalName = Boolean(formData.companyLegalName);

  const identityBar = (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-border-default bg-surface">
      <div className="w-9 h-9 rounded-md bg-accent-subtle text-accent-primary border border-accent-primary/20 flex items-center justify-center text-xs font-bold shrink-0">
        {hasLegalName ? formData.companyLegalName.substring(0, 2).toUpperCase() : (user?.displayName?.charAt(0) || 'U')}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-semibold text-foreground truncate">
          {hasLegalName ? formData.companyLegalName : 'Company not set up yet'}
        </div>
        <div className="text-[11px] text-foreground-muted truncate">
          {formData.email}
        </div>
      </div>
      {isGuestUser ? (
        <Badge variant="warning" size="sm">Sandbox Mode</Badge>
      ) : kybStatus === 'Verified' ? (
        <Badge variant="success" size="sm" hasDot>Verified</Badge>
      ) : kybStatus === 'Requires Review' ? (
        <Badge variant="warning" size="sm" hasDot>Under Review</Badge>
      ) : (
        <Badge variant="neutral" size="sm" hasDot>Unverified</Badge>
      )}
    </div>
  );

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border-default">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Company Profile
          </h1>
          <p className="text-xs text-foreground-muted mt-0.5">
            Legal identifiers used on purchase orders, manifests, and customs entries.
          </p>
        </div>
        <Button
          variant={isEditing ? 'outline' : 'default'}
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </div>

      {/* Identity Bar (compact, replaces the duplicated card) */}
      {identityBar}

      <Tabs value={tab} onValueChange={(v) => setSearchParams({ tab: v })}>
        <TabsList>
          <TabsTrigger value="identity">Identity</TabsTrigger>
          <TabsTrigger value="banking">Banking &amp; Settlement</TabsTrigger>
          <TabsTrigger value="webhooks">Developer &amp; Webhooks</TabsTrigger>
        </TabsList>

        <form onSubmit={handleSave}>
          {/* Identity Tab */}
          <TabsContent value="identity" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Registered Legal Entity Name</label>
                <Input
                  disabled={!isEditing}
                  value={formData.companyLegalName}
                  onChange={(e) => setFormData({ ...formData, companyLegalName: e.target.value })}
                  className="h-9 text-xs"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Authorized Signatory</label>
                <Input
                  disabled={!isEditing}
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  className="h-9 text-xs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Tax ID / EIN / VAT Number</label>
                <Input
                  disabled={!isEditing}
                  value={formData.taxId}
                  onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                  className="h-9 text-xs font-mono"
                  placeholder="e.g. US-EIN-94-2849102"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">EORI Number (EU / UK)</label>
                <Input
                  disabled={!isEditing}
                  value={formData.eoriNumber}
                  onChange={(e) => setFormData({ ...formData, eoriNumber: e.target.value })}
                  className="h-9 text-xs font-mono"
                  placeholder="e.g. GB-EORI-88392019482"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Customs Broker of Record</label>
                <Input
                  disabled={!isEditing}
                  value={formData.customsBroker}
                  onChange={(e) => setFormData({ ...formData, customsBroker: e.target.value })}
                  className="h-9 text-xs"
                  placeholder="e.g. Kuehne+Nagel"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Default Discharge Port (UN/LOCODE)</label>
                <Input
                  disabled={!isEditing}
                  value={formData.portOfPreference}
                  onChange={(e) => setFormData({ ...formData, portOfPreference: e.target.value })}
                  className="h-9 text-xs"
                  placeholder="e.g. SGSIN (Port of Singapore)"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground flex items-center justify-between">
                <span>Email</span>
                <span className="text-[11px] text-foreground-muted flex items-center gap-1 font-normal">
                  <HiLockClosed className="w-3 h-3" /> Locked to account
                </span>
              </label>
              <Input
                disabled
                value={formData.email}
                className="h-9 text-xs opacity-60 cursor-not-allowed bg-surface-subtle font-mono"
              />
            </div>

            {isEditing && (
              <div className="pt-3 border-t border-border-subtle flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsEditing(false)} disabled={saving}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Identity'}
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Banking & Settlement Tab */}
          <TabsContent value="banking" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Settlement Currency</label>
                <select
                  disabled={!isEditing}
                  value={formData.settlementCurrency}
                  onChange={(e) => setFormData({ ...formData, settlementCurrency: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-border-default bg-surface px-3 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:border-accent-primary disabled:opacity-60"
                >
                  <option value="USD">USD ($ - US Dollar)</option>
                  <option value="EUR">EUR (€ - Euro)</option>
                  <option value="SGD">SGD (S$ - Singapore Dollar)</option>
                  <option value="GBP">GBP (£ - British Pound)</option>
                  <option value="AED">AED (د.إ - UAE Dirham)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">SWIFT / BIC Code</label>
                <Input
                  disabled={!isEditing}
                  value={formData.swiftBic}
                  onChange={(e) => setFormData({ ...formData, swiftBic: e.target.value })}
                  className="h-9 text-xs font-mono"
                  placeholder="e.g. CHASUS33XXX"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Escrow Trustee</label>
                <Input
                  disabled={!isEditing}
                  value={formData.escrowBeneficiary}
                  onChange={(e) => setFormData({ ...formData, escrowBeneficiary: e.target.value })}
                  className="h-9 text-xs"
                  placeholder="e.g. Standard Chartered Escrow"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-md bg-surface-subtle border border-border-subtle text-[11px] text-foreground-muted">
              <HiCurrencyDollar className="w-3.5 h-3.5 shrink-0" />
              <span>These details appear on purchase orders you issue. Verify them with your bank before first settlement.</span>
            </div>

            {isEditing && (
              <div className="pt-3 border-t border-border-subtle flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsEditing(false)} disabled={saving}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Banking Details'}
                </Button>
              </div>
            )}
          </TabsContent>
        </form>

        <TabsContent value="webhooks" className="space-y-4 pt-2">
          <WebhooksManager />
        </TabsContent>
      </Tabs>

      {/* Section hint for empty state guidance */}
      {!hasLegalName && !isEditing && (
        <div className="flex items-start gap-2.5 p-3 rounded-md border border-border-default bg-surface-subtle/50 text-xs">
          <HiOfficeBuilding className="w-4 h-4 text-foreground-muted shrink-0 mt-0.5" />
          <span className="text-foreground-secondary">
            Add your registered company name and tax identifiers so purchase orders and customs documents carry correct legal data.
          </span>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
