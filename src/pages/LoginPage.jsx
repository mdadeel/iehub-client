import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { FaGoogle, FaUser } from 'react-icons/fa';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import AuthShell from '../components/AuthShell';

import SEOHead from '../components/SEOHead';
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
    <AuthShell
      title="Sign in to the trade desk"
      subtitle="Access verified lots, purchase orders and the escrow timeline for every consignment."
      asideTitle="Every consignment, one accountable desk."
      asideCopy="From origin inspection to the discharge port, IEHUB keeps the paperwork, the cargo and the money in the same ledger."
    >
            <SEOHead
        title="Sign in to the IEHUB trade desk"
        description="Access verified lots, purchase orders and escrow timelines."
        noIndex
      />

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="login-email" className="text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground-secondary">
            Business email
          </label>
          <Input
            id="login-email"
            type="email"
            placeholder="name@company.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-10 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="login-password" className="text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground-secondary">
              Password
            </label>
            <Link to="#" className="text-[11px] font-medium text-accent-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input
            id="login-password"
            type="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-10 text-sm"
          />
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="mt-2 w-full text-sm font-semibold"
        >
          {loading ? 'Authenticating…' : 'Sign in'}
        </Button>
      </form>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border-subtle" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-surface px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground-subtle">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-1.5 text-[12px]"
          onClick={handleGoogleLogin}
        >
          <FaGoogle className="h-3 w-3 text-status-danger" />
          <span>Google</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-1.5 text-[12px]"
          onClick={() => handleDemoLogin('user')}
        >
          <FaUser className="h-3 w-3 text-accent-primary" />
          <span>Demo trader</span>
        </Button>
      </div>

      <div className="mt-6 border-t border-border-subtle pt-4 text-[12px] text-foreground-muted">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-semibold text-accent-primary hover:underline">
          Open a trade account
        </Link>
      </div>
    </AuthShell>
  );
};

export default LoginPage;
