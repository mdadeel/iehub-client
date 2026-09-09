import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HiLockClosed, HiShieldCheck } from 'react-icons/hi';
import { FaUserShield } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const ADMIN_EMAILS = ['admin121@gmail.com', 'admin@importexport.com'];

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser, loginAsGuest } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await loginUser(email, password);
      const userEmail = (result?.user?.email || email).toLowerCase();
      
      if (ADMIN_EMAILS.includes(userEmail)) {
        toast.success('Admin authorization granted. Welcome.');
        navigate('/admin/dashboard');
      } else {
        toast.error('Account does not possess administrative privileges.');
      }
    } catch (err) {
      toast.error(err.message || 'Invalid administrative credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdmin = async () => {
    try {
      await loginAsGuest('demo-admin');
      toast.success('Signed in as Demo Administrator.');
      navigate('/admin/dashboard');
    } catch {
      toast.error('Failed to authenticate demo admin.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center container py-12">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-surface border border-border-default shadow-2xs mb-3">
            <HiLockClosed className="w-5 h-5 text-accent-primary" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Administrator Console
            </h1>
            <Badge variant="neutral" size="sm">
              Restricted
            </Badge>
          </div>
          <p className="text-xs text-foreground-muted">
            Internal network operations, audit logs, and compliance overrides.
          </p>
        </div>

        <Card className="border border-border-default bg-surface shadow-2xs">
          <CardContent className="p-6 space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Admin Identity (Email)
                </label>
                <Input
                  type="email"
                  placeholder="admin121@gmail.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Security Passkey
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <Button
                type="submit"
                size="sm"
                disabled={loading}
                className="w-full h-9 text-xs font-semibold"
              >
                {loading ? 'Verifying Credentials...' : 'Authenticate Admin Session'}
              </Button>
            </form>

            <div className="pt-2 border-t border-border-subtle">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDemoAdmin}
                className="w-full h-8 text-xs gap-1.5 text-foreground-secondary hover:text-foreground"
              >
                <FaUserShield className="w-3 h-3 text-accent-primary" />
                <span>Sign in as Demo Administrator</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLoginPage;
