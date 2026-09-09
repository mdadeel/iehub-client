import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';

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
    <div className="min-h-[85vh] flex items-center justify-center container py-12">
      <div className="w-full max-w-[420px]">
        {/* Top Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-surface border border-border-default shadow-2xs mb-3">
            <span className="font-black text-sm text-accent-primary">IE</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Create Trade Account
          </h1>
          <p className="text-xs text-foreground-muted mt-1">
            Register your corporate organization for international trade access.
          </p>
        </div>

        <Card className="border border-border-default bg-surface shadow-2xs">
          <CardContent className="p-6">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Representative or Entity Name
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Apex Global Logistics Ltd"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Corporate Email
                </label>
                <Input
                  type="email"
                  placeholder="desk@enterprise.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Avatar or Logo URL (Optional)
                </label>
                <Input
                  type="url"
                  placeholder="https://example.com/logo.png"
                  value={formData.photo}
                  onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Secure Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-9 text-xs"
                />
                <p className="text-[11px] text-foreground-muted">
                  Minimum 6 characters with uppercase and lowercase letters.
                </p>
              </div>

              <Button
                type="submit"
                size="sm"
                disabled={loading}
                className="w-full h-9 text-xs font-semibold mt-2"
              >
                {loading ? 'Registering Account...' : 'Open Trade Account'}
              </Button>
            </form>

            <div className="mt-4 pt-4 border-t border-border-subtle text-center text-xs text-foreground-muted">
              Already have an account?{' '}
              <Link to="/login" className="text-accent-primary font-medium hover:underline">
                Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
