import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import {
    HiArrowLeft, HiCheckCircle, HiStar, HiLocationMarker,
    HiLightningBolt, HiShieldCheck, HiTrendingUp,
    HiCube, HiInformationCircle
} from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

const ImportModal = ({ product, user, onClose, onSuccess }) => {
    const [qty, setQty] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const isOverLimit = qty > product.quantity;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isOverLimit || qty < 1) return;
        setSubmitting(true);

        try {
            await api.post('/imports', {
                productId: product._id,
                quantity: qty,
                userId: user.uid,
                userEmail: user.email
            });
            toast.success(`Trade Request Successful: ${qty} units processed.`);
            onSuccess();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Trade execution failed");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-figma-black/80 backdrop-blur-md p-4"
        >
            <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <Card className="border-2 shadow-2xl">
                    <CardHeader className="text-center pb-4">
                        <div className="w-12 h-12 bg-figma-blue/10 text-figma-blue rounded-xl flex items-center justify-center mx-auto mb-4">
                            <HiShieldCheck className="w-6 h-6" />
                        </div>
                        <CardTitle className="text-2xl font-black tracking-tighter">Authorize Trade</CardTitle>
                        <CardDescription className="font-medium">Execute acquisition protocol for this asset.</CardDescription>
                    </CardHeader>

                    <CardContent className="grid gap-6">
                        <div className="p-4 bg-muted/50 rounded-xl border-2 border-dashed flex justify-between items-center">
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Available</div>
                                <div className="text-sm font-black">{product.quantity} Units</div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Price/Unit</div>
                                <div className="text-sm font-black text-figma-blue">${product.price?.toLocaleString()}</div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="grid gap-4">
                            <div className="grid gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Transaction Volume</label>
                                <Input
                                    type="number"
                                    min="1"
                                    max={product.quantity}
                                    value={qty}
                                    onChange={(e) => setQty(parseInt(e.target.value) || 0)}
                                    className="h-12 text-center text-lg font-black border-2 focus-visible:ring-figma-blue"
                                />
                                {isOverLimit && <p className="text-[10px] text-destructive font-bold text-center uppercase tracking-widest">Exceeds available inventory</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-2">
                                <Button type="button" variant="outline" onClick={onClose} className="h-12 font-bold border-2">
                                    CANCEL
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={isOverLimit || qty < 1 || submitting}
                                    className="h-12 font-black bg-figma-blue hover:bg-figma-blue/90"
                                >
                                    {submitting ? 'EXECUTING...' : 'CONFIRM TRADE'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
};

const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const fetchProduct = useCallback(async () => {
        try {
            const { data } = await api.get(`/products/${id}`);
            setProduct(data);
        } catch (error) {
            toast.error("Telemetry Link Broken: Asset Not Found");
            navigate('/products');
        } finally {
            setLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    if (loading) return (
        <div className="container py-40 text-center">
            <div className="w-12 h-12 border-4 border-muted border-t-figma-blue rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Initializing Asset Telemetry...</p>
        </div>
    );

    if (!product) return null;

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-figma-blue/5 blur-[120px] rounded-full pointer-events-none" />
            
            <main className="container py-24 relative z-10">
                <Button 
                    variant="ghost" 
                    onClick={() => navigate('/products')}
                    className="mb-8 hover:bg-transparent p-0 text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-[10px]"
                >
                    <HiArrowLeft className="mr-2 w-4 h-4" /> Back to Terminal Index
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Left: Visuals */}
                    <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
                        <Card className="overflow-hidden border-2 shadow-2xl">
                            <div className="aspect-square relative">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 left-4 bg-figma-blue text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-md shadow-lg">
                                    LIVE CHANNEL ACTIVE
                                </div>
                            </div>
                            <div className="p-4 bg-muted/30 border-t flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-figma-green animate-pulse" />
                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Verified Origin</span>
                                </div>
                                <div className="text-[10px] font-black text-figma-blue uppercase tracking-widest">
                                    REF-{product._id?.substring(0, 8).toUpperCase()}
                                </div>
                            </div>
                        </Card>

                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { label: 'Origin Port', value: product.origin, icon: <HiLocationMarker />, color: 'text-figma-blue' },
                                { label: 'Asset Class', value: product.category, icon: <HiCube />, color: 'text-figma-purple' },
                                { label: 'Net Capacity', value: `${product.quantity} U`, icon: <HiTrendingUp />, color: 'text-figma-green' }
                            ].map((item, idx) => (
                                <Card key={idx} className="border-2 p-4">
                                    <div className={`${item.color} mb-2`}>{item.icon}</div>
                                    <div className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">{item.label}</div>
                                    <div className="text-[10px] font-black truncate mt-1">{item.value}</div>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Right: Intel */}
                    <div className="lg:col-span-7 space-y-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-2 py-1 bg-muted rounded font-black text-[10px] uppercase tracking-widest text-muted-foreground">
                                    {product.category}
                                </span>
                                <div className="flex items-center gap-1">
                                    <HiStar className="text-figma-orange w-4 h-4" />
                                    <span className="font-black text-xs">{product.rating} HubScore</span>
                                </div>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.9] mb-6">
                                {product.name}
                            </h1>
                            <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                                {product.description || "Sophisticated commodity listing with verified supply chain origin. Rigorously tested for international compliance standards."}
                            </p>
                        </div>

                        <Card className="border-2 bg-muted/20">
                            <CardContent className="p-8 flex flex-wrap justify-between items-center gap-8">
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current Market Value</div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-black text-figma-blue">${product.price?.toLocaleString()}</span>
                                        <span className="text-sm font-bold text-muted-foreground">USD / UNIT</span>
                                    </div>
                                </div>
                                <div className="space-y-1 md:text-right">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Inventory Status</div>
                                    <div className="text-xl font-black text-foreground">{product.quantity} Units in Terminal</div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { title: 'Compliance Sync', desc: 'ISO 9001:2015 Verified', icon: <HiCheckCircle /> },
                                { title: 'Chain of Custody', desc: 'Blockchain Manifest', icon: <HiShieldCheck /> },
                                { title: 'Secure Logistics', desc: 'E2E Encryption', icon: <HiCube /> },
                                { title: 'Trade Protocol', desc: 'Algo-Ready Execution', icon: <HiLightningBolt /> }
                            ].map((cert, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-4 rounded-xl border-2 border-muted hover:border-figma-blue/20 transition-colors group">
                                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:text-figma-blue group-hover:bg-figma-blue/10 transition-all">
                                        {cert.icon}
                                    </div>
                                    <div>
                                        <div className="text-xs font-black uppercase tracking-widest">{cert.title}</div>
                                        <div className="text-[10px] font-bold text-muted-foreground">{cert.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-8 border-t space-y-4">
                            <Button 
                                onClick={() => {
                                    if (!user) {
                                        toast.error("Security Bypass Blocked: Login Required");
                                        navigate("/login", { state: { from: { pathname: `/products/${id}` } } });
                                        return;
                                    }
                                    setShowModal(true);
                                }}
                                disabled={product.quantity < 1}
                                className="w-full h-16 text-lg font-black bg-figma-blue hover:bg-figma-blue/90 shadow-xl shadow-figma-blue/20 rounded-2xl"
                            >
                                {product.quantity < 1 ? 'STOCK DEPLETED' : 'INITIATE SECURE IMPORT PROTOCOL'}
                            </Button>
                            <p className="text-[10px] text-center font-bold text-muted-foreground uppercase tracking-[0.2em]">
                                All transactions are governed by the IEHUB global trade agreement.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <AnimatePresence>
                {showModal && (
                    <ImportModal
                        product={product}
                        user={user}
                        onClose={() => setShowModal(false)}
                        onSuccess={fetchProduct}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProductDetailsPage;
