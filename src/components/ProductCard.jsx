import { useNavigate } from 'react-router-dom';
import { HiStar, HiLocationMarker, HiArrowRight } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from 'lucide-react'; // Wait, I should use a custom badge or just a div

const ProductCard = ({ product }) => {
    const navigateToProductDetail = useNavigate();

    const handleViewSpecifications = () => {
        navigateToProductDetail(`/products/${product._id}`);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="overflow-hidden border-2 hover:border-figma-blue transition-colors group h-full flex flex-col">
                <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                        <div className="bg-white/90 dark:bg-figma-black/90 backdrop-blur-sm text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border border-border shadow-sm">
                            {product.category}
                        </div>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-figma-blue text-white text-sm font-black px-3 py-1 rounded-full shadow-lg">
                        ${product.price?.toLocaleString()}
                    </div>
                </div>

                <CardContent className="p-5 flex-1">
                    <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                            <HiStar key={i} className={i < Math.floor(product.rating || 0) ? "text-figma-orange" : "text-muted"} />
                        ))}
                        <span className="text-[10px] font-bold text-muted-foreground ml-1">{product.rating}</span>
                    </div>
                    
                    <h3 className="font-black text-lg leading-tight mb-3 line-clamp-1">{product.name}</h3>
                    
                    <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <HiLocationMarker className="text-figma-blue" />
                            {product.origin}
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-figma-green" />
                            {product.quantity} Units
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="p-5 pt-0">
                    <Button 
                        onClick={handleViewSpecifications}
                        className="w-full justify-between bg-muted hover:bg-figma-blue hover:text-white text-foreground border-none font-bold"
                    >
                        View Details <HiArrowRight />
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
};

export default ProductCard;
