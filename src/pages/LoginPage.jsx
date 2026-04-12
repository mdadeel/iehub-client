import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { FaGoogle, FaUser, FaCrown } from 'react-icons/fa';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';

const LoginPage = () => {
    const { loginUser, loginWithGoogle, loginAsGuest } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const handleLogin = (e) => {
        e.preventDefault();
        loginUser(email, password)
            .then(() => {
                toast.success("Authentication successful. Welcome to IE HUB.");
                navigate(from, { replace: true });
            })
            .catch((err) => {
                toast.error(err.message);
            });
    };

    const handleGoogleLogin = () => {
        loginWithGoogle()
            .then(() => {
                toast.success("Global Access Granted.");
                navigate(from, { replace: true });
            })
            .catch((err) => {
                toast.error(err.message);
            });
    };

    const handleDemoLogin = async (userType) => {
        try {
            await loginAsGuest(userType === 'user' ? 'demo-user' : 'demo-admin');
            toast.success(`Demo ${userType} access granted. Welcome to IE HUB.`);
            navigate(from, { replace: true });
        } catch (error) {
            toast.error("Demo access failed. Please try again.");
        }
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center container py-12 relative overflow-hidden">
            {/* Background Mesh */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-figma-blue/5 blur-[120px] rounded-full pointer-events-none" />
            
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-[420px] z-10"
            >
                <Card className="border-2 shadow-2xl">
                    <CardHeader className="text-center pb-8">
                        <div className="w-12 h-12 bg-figma-blue rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-figma-blue/20">
                            <img src="/logo.png" alt="" className="w-6 h-6 brightness-0 invert" />
                        </div>
                        <CardTitle className="text-3xl font-black tracking-tighter">Welcome <span className="text-figma-blue">Back</span></CardTitle>
                        <CardDescription className="font-medium">Access your global trade terminal.</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="grid gap-6">
                        <form onSubmit={handleLogin} className="grid gap-4">
                            <div className="grid gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Corporate Email</label>
                                <Input 
                                    type="email" 
                                    placeholder="name@company.com" 
                                    required 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-12 border-2 focus-visible:ring-figma-blue"
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Access Key</label>
                                    <Link to="#" className="text-[10px] font-bold text-figma-blue hover:underline">Forgot key?</Link>
                                </div>
                                <Input 
                                    type="password" 
                                    placeholder="••••••••" 
                                    required 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-12 border-2 focus-visible:ring-figma-blue"
                                />
                            </div>
                            <Button type="submit" className="h-12 font-black bg-figma-blue hover:bg-figma-blue/90 mt-2">
                                SIGN IN TO PORTAL
                            </Button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
                                <span className="bg-card px-2 text-muted-foreground">OR CONTINUE WITH</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" className="h-12 font-bold border-2" onClick={handleGoogleLogin}>
                                <FaGoogle className="mr-2 text-red-500" /> Google
                            </Button>
                            <Button variant="outline" className="h-12 font-bold border-2" onClick={() => handleDemoLogin('user')}>
                                <FaUser className="mr-2 text-figma-blue" /> Demo
                            </Button>
                        </div>

                        <p className="text-center text-xs font-medium text-muted-foreground">
                            New to the network? <Link to="/register" className="text-figma-blue font-bold hover:underline">Create Corporate ID</Link>
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default LoginPage;
