import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HiCloudUpload, HiArrowLeft } from 'react-icons/hi';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';
import { CATEGORIES } from '../lib/categories';

const AddExportPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    price: '',
    origin: '',
    quantity: '',
    category: 'Spices',
    hsCode: '',
    description: '',
    incoterm: 'FOB',
    unit: 'Metric Tons (MT)',
    moq: 1,
    portOfOrigin: '',
  });

  const categories = CATEGORIES;

  useEffect(() => {
    if (user?.isGuest) {
      toast.error('Listing registration requires a verified user account.');
      navigate('/dashboard');
    }
  }, [user, navigate]);

  if (user?.isGuest) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024 * 2) {
        toast.error('Image file size must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/products', {
        ...formData,
        exporterEmail: user.email,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity, 10),
      });
      toast.success('Commodity registered to global marketplace.');
      navigate('/dashboard/my-exports');
    } catch (error) {
      console.error('Failed to add product:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to register commodity.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-border-default">
        <Link
          to="/dashboard/my-exports"
          className="inline-flex items-center gap-1.5 text-xs text-foreground-muted hover:text-foreground mb-3 transition-colors"
        >
          <HiArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Export Inventory</span>
        </Link>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Register Export Commodity
        </h1>
        <p className="text-xs text-foreground-muted mt-1">
          Create a marketplace listing visible to international buyers. Fields marked * are required.
        </p>
      </div>

      <Card className="border border-border-default bg-surface shadow-2xs">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section: Essentials */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground">Essentials</span>
              <span className="h-px flex-1 bg-border-subtle" />
            </div>

            {/* Photo — compact thumbnail uploader */}
            <div className="flex items-center gap-4">
              <div className="relative group w-24 h-24 shrink-0 rounded-lg border border-dashed border-border-strong hover:border-accent-primary bg-surface-subtle overflow-hidden transition-colors cursor-pointer">
                {formData.image ? (
                  <>
                    <img
                      src={formData.image}
                      alt="Listing preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="text-[11px] font-medium text-white">Replace</span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-foreground-muted">
                    <HiCloudUpload className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Upload</span>
                  </div>
                )}
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  accept="image/*"
                />
              </div>

              <div className="min-w-0">
                <div className="text-xs font-medium text-foreground">Listing Photo</div>
                <p className="text-[11px] text-foreground-muted mt-0.5 leading-relaxed">
                  PNG, JPG, or WEBP up to 2MB. Shown on your marketplace card and inventory rows.
                </p>
                {formData.image && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: '' })}
                    className="text-[11px] text-status-danger hover:underline mt-1"
                  >
                    Remove photo
                  </button>
                )}
              </div>
            </div>

            {/* Title and Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Commodity Name *
                </label>
                <Input
                  placeholder="e.g. Organic Ceylon Cinnamon Grade ALBA"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Trade Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-border-default bg-surface px-3 py-1 text-xs text-foreground focus-visible:outline-none focus-visible:border-accent-primary"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price, Quantity, Origin */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  FOB Price ($ USD) *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Available Quantity *
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 500"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Port / Country of Origin *
                </label>
                <Input
                  placeholder="e.g. Colombo Port, Sri Lanka"
                  required
                  value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            {/* Section: Trade Terms */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground">Trade Terms</span>
              <span className="h-px flex-1 bg-border-subtle" />
              <span className="text-[11px] text-foreground-muted">Defaults work for most listings</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Incoterm
                </label>
                <select
                  value={formData.incoterm}
                  onChange={(e) => setFormData({ ...formData, incoterm: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-border-default bg-surface px-3 py-1 text-xs text-foreground focus-visible:outline-none focus-visible:border-accent-primary"
                >
                  <option value="FOB">FOB — Free on Board</option>
                  <option value="CIF">CIF — Cost, Insurance & Freight</option>
                  <option value="EXW">EXW — Ex Works</option>
                  <option value="CFR">CFR — Cost & Freight</option>
                  <option value="DDP">DDP — Delivered Duty Paid</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  HS Tariff Code
                </label>
                <Input
                  placeholder="e.g. 0904.11"
                  value={formData.hsCode}
                  onChange={(e) => setFormData({ ...formData, hsCode: e.target.value })}
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Unit of Measure
                </label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-border-default bg-surface px-3 py-1 text-xs text-foreground focus-visible:outline-none focus-visible:border-accent-primary"
                >
                  <option value="Metric Tons (MT)">Metric Tons (MT)</option>
                  <option value="Kilograms (kg)">Kilograms (kg)</option>
                  <option value="Containers (TEU)">Containers (TEU)</option>
                  <option value="Pallets">Pallets</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Minimum Order (MOQ)
                </label>
                <Input
                  type="number"
                  min="1"
                  placeholder="1"
                  value={formData.moq}
                  onChange={(e) => setFormData({ ...formData, moq: Math.max(1, parseInt(e.target.value) || 1) })}
                  className="h-9 text-xs font-mono"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Commercial Specification & Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide details on harvest purity, moisture content, ISO compliance, and packaging standard..."
                className="flex w-full rounded-md border border-border-default bg-surface px-3 py-2 text-xs text-foreground placeholder:text-foreground-muted focus-visible:outline-none focus-visible:border-accent-primary"
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-border-subtle flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => navigate('/dashboard/my-exports')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={submitting}
              >
                {submitting ? 'Publishing...' : 'Publish Listing'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddExportPage;
