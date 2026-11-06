import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import AuthShell from '../components/AuthShell';

const RegisterPage = () => {
  const { registerUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    photo: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (pass) => {
    if (pass.length < 6) return 'Password must be at least 6 characters long.';
    if (!/[A-Z]/.test(pass)) return 'Password must contain at least one uppercase letter.';
    if (!/[a-z]/.test(pass)) return 'Password must contain at least one lowercase letter.';
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const passError = validatePassword(formData.password);
    if (passError) {
      toast.error(passError);
      return;
    }

    setLoading(true);
    try {
      await registerUser(formData.email, formData.password, formData.name, formData.photo);
      toast.success('Trade account established. Welcome to IEHUB.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Open a trade account"
      subtitle="Register your company to source verified commodities and issue purchase orders under escrow."
      asideTitle="Verified suppliers. Protected money."
      asideCopy="KYB-checked exporters, assayed lots and escrow that releases on the bill of lading — not on a promise."
      image="/images/desk-operations.jpg"
    >
      <form onSubmit={handleRegister} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="reg-name" className="text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground-secondary">
            Representative or entity name
          </label>
          <Input
            id="reg-name"
            type="text"
            placeholder="e.g. Apex Global Logistics Ltd"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="h-10 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="reg-email" className="text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground-secondary">
            Corporate email
          </label>
          <Input
            id="reg-email"
            type="email"
            placeholder="desk@enterprise.com"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="h-10 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="reg-photo" className="text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground-secondary">
              Logo URL <span className="font-normal normal-case text-foreground-subtle">(optional)</span>
            </label>
            <Input
              id="reg-photo"
              type="url"
              placeholder="https://…/logo.png"
              value={formData.photo}
              onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
              className="h-10 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="reg-password" className="text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground-secondary">
              Password
            </label>
            <Input
              id="reg-password"
              type="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="h-10 text-sm"
            />
          </div>
        </div>

        <p className="text-[11px] leading-relaxed text-foreground-muted">
          Minimum 6 characters, with at least one uppercase and one lowercase letter.
        </p>

        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="mt-1 w-full text-sm font-semibold"
        >
          {loading ? 'Registering account…' : 'Open trade account'}
        </Button>

        <p className="text-[11px] leading-relaxed text-foreground-subtle">
          By opening an account you accept the platform terms of trade and escrow disclosures.
        </p>
      </form>

      <div className="mt-6 border-t border-border-subtle pt-4 text-[12px] text-foreground-muted">
        Already registered?{' '}
        <Link to="/login" className="font-semibold text-accent-primary hover:underline">
          Sign in to your desk
        </Link>
      </div>
    </AuthShell>
  );
};

export default RegisterPage;
