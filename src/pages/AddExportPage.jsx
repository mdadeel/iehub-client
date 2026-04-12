import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HiCloudUpload, HiCurrencyDollar, HiCube, HiIdentification, HiTag, HiGlobeAlt } from 'react-icons/hi';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';

const AddExportPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.isGuest) {
            toast.error("This feature is not available in demo mode. Please create an account.");
            navigate('/dashboard');
        }
    }, [user, navigate]);

    if (user?.isGuest) return null;

    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        image: '',
        price: '',
        origin: '',
        rating: 5,
        quantity: '',
        category: 'Spices',
        description: ''
    });

    const categories = ['Spices', 'Tea & Coffee', 'Textiles', 'Rubber', 'Coconut Products', 'Gemstones', 'Tech', 'Other'];

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024 * 2) {
                toast.error("Image size must be less than 2MB");
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
                quantity: parseInt(formData.quantity)
            });
            toast.success("Asset integrated into global supply chain.");
            navigate('/dashboard/my-exports');
        } catch (error) {
            console.error("Failed to add product:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Asset integration failed.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto py-10"
        >
            <div className="mb-10">
                <h1 className="text-4xl font-black tracking-tighter mb-2">New Export <span className="text-figma-purple">Listing</span></h1>
                <p className="text-muted-foreground font-medium">Register your professional goods on the global trade network.</p>
            </div>

            <Card className="border-2 shadow-xl overflow-hidden">
                <CardHeader className="bg-muted/30 border-b pb-8">
                    <CardTitle className="text-xl font-black tracking-tight flex items-center gap-2">
                        <HiIdentification className="text-figma-purple" />
                        Asset Metadata
                    </CardTitle>
                    <CardDescription className="font-bold">Provide high-fidelity specifications for international buyers.</CardDescription>
                </CardHeader>

                <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="grid gap-8">
                        {/* Image Upload */}
                        <div className="grid gap-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Asset Visualization</label>
                            <div className="relative group">
                                <div className="aspect-[21/9] rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-muted/30 flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-figma-purple/50">
                                    {formData.image ? (
                                        <>
                                            <img src={formData.image} alt="" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                <Button type="button" variant="secondary" className="font-black">REPLACE IMAGE</Button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-figma-purple transition-colors">
                                            <HiCloudUpload className="w-10 h-10" />
                                            <span className="text-xs font-black uppercase tracking-widest">Transmit Image File (Max 2MB)</span>
                                        </div>
                                    )}
                                    <input 
                                        type="file" 
                                        onChange={handleImageChange} 
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                                        accept="image/*"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Product Designation</label>
                                <div className="relative">
                                    <HiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="e.g. Industrial Grade Lithium Units"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="pl-10 h-12 border-2 focus-visible:ring-figma-purple"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Sector Classification</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="flex h-12 w-full rounded-md border-2 border-input bg-background px-3 py-2 text-sm font-bold focus:outline-none focus:border-figma-purple transition-colors appearance-none cursor-pointer"
                                >
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Market Value (USD)</label>
                                <div className="relative">
                                    <HiCurrencyDollar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="pl-10 h-12 border-2 focus-visible:ring-figma-purple"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Net Inventory Capacity</label>
                                <div className="relative">
                                    <HiCube className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="number"
                                        placeholder="Total units available"
                                        required
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                        className="pl-10 h-12 border-2 focus-visible:ring-figma-purple"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Terminal Origin</label>
                            <div className="relative">
                                <HiGlobeAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="e.g. Port of Singapore"
                                    required
                                    value={formData.origin}
                                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                                    className="pl-10 h-12 border-2 focus-visible:ring-figma-purple"
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Asset Intelligence / Description</label>
                            <textarea
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe quality, technical certifications, and logistics requirements..."
                                className="flex min-h-[120px] w-full rounded-md border-2 border-input bg-background px-3 py-2 text-sm font-medium focus:outline-none focus:border-figma-purple transition-colors resize-none"
                            />
                        </div>

                        <div className="pt-4 border-t flex flex-col md:flex-row gap-4">
                            <Button 
                                type="submit" 
                                disabled={submitting}
                                className="flex-1 h-14 text-lg font-black bg-figma-purple hover:bg-figma-purple/90 shadow-xl shadow-figma-purple/20 rounded-2xl"
                            >
                                {submitting ? 'INTEGRATING...' : 'PUBLISH ASSET TO NETWORK'}
                            </Button>
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => navigate('/dashboard/my-exports')}
                                className="h-14 px-10 font-black border-2 rounded-2xl"
                            >
                                ABORT
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default AddExportPage;
