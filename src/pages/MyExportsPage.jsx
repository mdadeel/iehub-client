import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HiPencil, HiTrash, HiSearch, HiCube, HiCurrencyDollar, HiExternalLink } from 'react-icons/hi';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

const UpdateModal = ({ product, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({ ...product });
    const [updating, setUpdating] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            await onUpdate(product._id, formData);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setUpdating(false);
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
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xl font-black tracking-tight">Update Asset Specification</CardTitle>
                        <CardDescription className="font-bold">Modify parameters for {product.name}</CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="grid gap-4">
                            <div className="grid gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Asset Name</label>
                                <Input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="h-11 border-2 focus-visible:ring-figma-purple"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Price ($)</label>
                                    <Input
                                        type="number" required step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                        className="h-11 border-2 focus-visible:ring-figma-purple"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Quantity</label>
                                    <Input
                                        type="number" required
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                        className="h-11 border-2 focus-visible:ring-figma-purple"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-4">
                                <Button type="button" variant="outline" onClick={onClose} className="font-bold border-2">CANCEL</Button>
                                <Button type="submit" disabled={updating} className="font-black bg-figma-purple hover:bg-figma-purple/90">
                                    {updating ? 'SYNCING...' : 'SAVE CHANGES'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
};

const MyExportsPage = () => {
    const { user } = useAuth();

    if (user?.isGuest) {
        return (
            <div className="max-w-2xl mx-auto py-20 text-center">
                <div className="w-20 h-20 bg-figma-orange/10 text-figma-orange rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <HiCube className="w-10 h-10" />
                </div>
                <h1 className="text-4xl font-black tracking-tighter mb-4">Demo <span className="text-figma-orange">Environment</span></h1>
                <p className="text-muted-foreground font-medium mb-10 leading-relaxed">
                    Personalized export listings are not available in the demo sandbox. 
                    Please establish a verified corporate identity to access professional trading tools.
                </p>
                <div className="flex gap-4 justify-center">
                    <Button asChild size="lg" className="rounded-full font-black bg-figma-blue hover:bg-figma-blue/90 h-14 px-8">
                        <Link to="/register">Create Account</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="rounded-full font-black border-2 h-14 px-8">
                        <Link to="/dashboard">Back to Overview</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const [exports, setExports] = useState([]);
    const [filteredExports, setFilteredExports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);

    const fetchExports = useCallback(async () => {
        if (!user?.email) return;
        setLoading(true);
        try {
            const { data } = await api.get(`/products?exporterEmail=${user.email}`);
            const myData = data.filter(item => item.exporterEmail === user.email);
            setExports(myData);
            setFilteredExports(myData);
        } catch (error) {
            console.error("Failed to fetch exports", error);
            toast.error("Telemetry failure: Could not retrieve asset index.");
        } finally {
            setLoading(false);
        }
    }, [user?.email]);

    useEffect(() => {
        fetchExports();
    }, [fetchExports]);

    useEffect(() => {
        const results = exports.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredExports(results);
    }, [searchTerm, exports]);

    const handleDelete = async (id) => {
        if (!window.confirm("Permanently decommission this asset from the network?")) return;
        try {
            await api.delete(`/products/${id}`);
            const updated = exports.filter(item => item._id !== id);
            setExports(updated);
            toast.success("Asset decommissioned.");
        } catch {
            toast.error("Decommission protocol failed.");
        }
    };

    const handleUpdate = async (id, updatedData) => {
        try {
            const { data } = await api.patch(`/products/${id}`, updatedData);
            const updatedList = exports.map(item => item._id === id ? data : item);
            setExports(updatedList);
            toast.success("Asset catalog updated.");
        } catch {
            toast.error("Network sync failed.");
        }
    };

    if (loading) return (
        <div className="py-40 text-center">
            <div className="w-12 h-12 border-4 border-muted border-t-figma-purple rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Retrieving Asset Catalog...</p>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
        >
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter mb-2">My <span className="text-figma-purple">Exports</span></h1>
                    <p className="text-muted-foreground font-medium">Manage and monitor your active global market listings.</p>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Identify asset..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 h-12 border-2 focus-visible:ring-figma-purple"
                        />
                    </div>
                    <Button asChild className="h-12 font-black bg-figma-purple hover:bg-figma-purple/90 shrink-0">
                        <Link to="/dashboard/add-export">
                            <HiCube className="mr-2" /> NEW LISTING
                        </Link>
                    </Button>
                </div>
            </div>

            {exports.length === 0 ? (
                <div className="py-32 text-center border-4 border-dashed rounded-[32px] bg-muted/20">
                    <HiCube className="w-16 h-16 text-muted mx-auto mb-6" />
                    <h3 className="text-2xl font-black tracking-tight mb-2">Zero Active Listings</h3>
                    <p className="text-muted-foreground font-medium mb-8">Your export terminal is currently empty.</p>
                    <Button asChild size="lg" className="rounded-full font-black bg-figma-purple h-14 px-8">
                        <Link to="/dashboard/add-export">START EXPORTING</Link>
                    </Button>
                </div>
            ) : filteredExports.length === 0 ? (
                <div className="py-20 text-center text-muted-foreground font-bold">No matching assets identified.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode='popLayout'>
                        {filteredExports.map((item, index) => (
                            <motion.div
                                layout
                                key={item._id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className="overflow-hidden border-2 hover:border-figma-purple transition-all group flex flex-col h-full shadow-lg">
                                    <div className="relative aspect-[16/10] overflow-hidden">
                                        <img
                                            src={item.image || 'https://via.placeholder.com/300'}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-3 right-3 bg-figma-black/80 backdrop-blur-sm text-[9px] font-black text-white px-2 py-1 rounded uppercase tracking-[0.1em]">
                                            {item.status || 'ACTIVE_SYNC'}
                                        </div>
                                        <div className="absolute bottom-3 left-3 bg-figma-purple text-white text-[10px] font-black px-2 py-1 rounded shadow-lg uppercase">
                                            {item.category}
                                        </div>
                                    </div>

                                    <CardContent className="p-6 flex-1">
                                        <h3 className="text-xl font-black leading-tight mb-4 group-hover:text-figma-purple transition-colors truncate">{item.name}</h3>
                                        
                                        <div className="grid grid-cols-2 gap-3 mb-6">
                                            <div className="p-3 bg-muted/50 rounded-xl border">
                                                <div className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1">Capacity</div>
                                                <div className="text-sm font-black flex items-center gap-1.5">
                                                    <HiCube className="text-figma-purple" /> {item.quantity} U
                                                </div>
                                            </div>
                                            <div className="p-3 bg-muted/50 rounded-xl border">
                                                <div className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1">Valuation</div>
                                                <div className="text-sm font-black flex items-center gap-1">
                                                    <span className="text-figma-purple">$</span>{item.price.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                                            <HiExternalLink className="text-figma-purple" />
                                            {item.origin}
                                        </div>
                                    </CardContent>

                                    <CardFooter className="p-6 pt-0 grid grid-cols-2 gap-3">
                                        <Button 
                                            variant="outline"
                                            onClick={() => setSelectedProduct(item)}
                                            className="font-bold border-2 hover:bg-muted"
                                        >
                                            <HiPencil className="mr-2" /> EDIT
                                        </Button>
                                        <Button 
                                            variant="outline"
                                            onClick={() => handleDelete(item._id)}
                                            className="font-bold border-2 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
                                        >
                                            <HiTrash className="mr-2" /> DROP
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <AnimatePresence>
                {selectedProduct && (
                    <UpdateModal
                        product={selectedProduct}
                        onClose={() => setSelectedProduct(null)}
                        onUpdate={handleUpdate}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default MyExportsPage;
