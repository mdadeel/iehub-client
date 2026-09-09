import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { FaGoogle, FaUser, FaShieldAlt } from 'react-icons/fa';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const LoginPage = () => {
  const { loginUser, loginWithGoogle, loginAsGuest } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginUser(email, password);
      toast.success('Authenticated successfully. Welcome to IEHUB.');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      toast.success('Signed in with Google.');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Google sign in failed');
    }
  };

  const handleDemoLogin = async (userType) => {
    try {
      await loginAsGuest(userType === 'user' ? 'demo-user' : 'demo-admin');
      toast.success(`Signed in as ${userType === 'user' ? 'Demo Trader' : 'Trade Administrator'}.`);
      navigate(from, { replace: true });
    } catch {
      toast.error('Demo access failed. Please try again.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center container py-12">
      <div className="w-full max-w-[400px]">
        {/* Top Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-surface border border-border-default shadow-2xs mb-3">
            <span className="font-black text-sm text-accent-primary">IE</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Sign in to Trade Desk
          </h1>
          <p className="text-xs text-foreground-muted mt-1">
            Access your global commodity catalog and purchase orders.
          </p>
        </div>

        <Card className="border border-border-default bg-surface shadow-2xs">
          <CardContent className="p-6 space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Business Email
                </label>
                <Input
                  type="email"
                  placeholder="name@company.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-foreground">
                    Password
                  </label>
                  <Link
                    to="#"
                    className="text-[11px] text-accent-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
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
                {loading ? 'Authenticating...' : 'Sign In'}
              </Button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border-subtle" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-wider">
                <span className="bg-surface px-2 text-foreground-muted">Or continue with</span>
              </div>
            </div>

            {/* Quick SSO Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1.5"
                onClick={handleGoogleLogin}
              >
                <FaGoogle className="w-3 h-3 text-status-danger" />
                <span>Google</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1.5"
                onClick={() => handleDemoLogin('user')}
              >
                <FaUser className="w-3 h-3 text-accent-primary" />
                <span>Demo Trader</span>
              </Button>
            </div>

            <div className="pt-2 text-center text-xs text-foreground-muted border-t border-border-subtle">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-accent-primary font-medium hover:underline">
                Create Account
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
