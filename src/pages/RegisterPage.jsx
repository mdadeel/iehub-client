import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';

const RegisterPage = () => {
    const { registerUser } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        photo: '',
        password: ''
    });
    const navigate = useNavigate();

    const validatePassword = (pass) => {
        if (pass.length < 6) return "Password must be at least 6 characters long.";
        if (!/[A-Z]/.test(pass)) return "Password must contain at least one uppercase letter.";
        if (!/[a-z]/.test(pass)) return "Password must contain at least one lowercase letter.";
        return null;
    };

    const handleRegister = (e) => {
        e.preventDefault();
        const passError = validatePassword(formData.password);
        if (passError) {
            toast.error(passError);
            return;
        }

        registerUser(formData.email, formData.password, formData.name, formData.photo)
            .then(() => {
                toast.success("Account infrastructure verified. Welcome.");
                navigate("/");
            })
            .catch((err) => {
                toast.error(err.message);
            });
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center container py-12 relative overflow-hidden">
            {/* Background Mesh */}
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-figma-blue/5 blur-[150px] rounded-full pointer-events-none" />
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-[460px] z-10"
            >
                <Card className="border-2 shadow-2xl">
                    <CardHeader className="text-center pb-8">
                        <div className="w-12 h-12 bg-figma-blue rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-figma-blue/20">
                            <img src="/logo.png" alt="" className="w-6 h-6 brightness-0 invert" />
                        </div>
                        <CardTitle className="text-3xl font-black tracking-tighter">Join the <span className="text-figma-blue">Network</span></CardTitle>
                        <CardDescription className="font-medium">Establish your global trade identity.</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="grid gap-6">
                        <form onSubmit={handleRegister} className="grid gap-4">
                            <div className="grid gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Entity Name</label>
                                <Input 
                                    type="text" 
                                    placeholder="e.g. Global Traders Ltd" 
                                    required 
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="h-12 border-2 focus-visible:ring-figma-blue"
                                />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Corporate Email</label>
                                <Input 
                                    type="email" 
                                    placeholder="admin@enterprise.com" 
                                    required 
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="h-12 border-2 focus-visible:ring-figma-blue"
                                />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Logo / Photo URL</label>
                                <Input 
                                    type="url" 
                                    placeholder="https://logo.com/my-company.jpg" 
                                    value={formData.photo}
                                    onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                                    className="h-12 border-2 focus-visible:ring-figma-blue"
                                />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Master Password</label>
                                <Input 
                                    type="password" 
                                    placeholder="••••••••" 
                                    required 
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="h-12 border-2 focus-visible:ring-figma-blue"
                                />
                                <p className="text-[10px] text-muted-foreground font-medium ml-1">Requires 6+ characters with mixed casing.</p>
                            </div>
                            <Button type="submit" className="h-12 font-black bg-figma-blue hover:bg-figma-blue/90 mt-4">
                                BUILD NETWORK ACCESS
                            </Button>
                        </form>

                        <p className="text-center text-xs font-medium text-muted-foreground">
                            Already have access? <Link to="/login" className="text-figma-blue font-bold hover:underline">Login to Portal</Link>
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
