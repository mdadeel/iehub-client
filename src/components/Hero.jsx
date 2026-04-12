import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';
import { HiArrowRight } from 'react-icons/hi';

const Hero = () => {
    return (
        <div className="relative min-h-[80vh] flex items-center pt-20 overflow-hidden">
            {/* Background elements - Figma style gradients */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-figma-purple/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-figma-blue/20 blur-[100px] rounded-full" />
            
            <div className="container relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-figma-blue text-xs font-bold uppercase tracking-widest mb-8">
                            
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
                            Trade without <br />
                            <span className="text-figma-blue">limits.</span>
                        </h1>
                        
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                            The easy-to-use platform for global exporters and importers. 
                            Connect your business with the world's most trusted trade network.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button size="lg" asChild className="h-14 px-8 rounded-full text-base font-bold bg-figma-blue hover:bg-figma-blue/90 shadow-[0_8px_20px_rgba(13,153,255,0.3)] group">
                                <Link to="/products">
                                    Start Trading <HiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild className="h-14 px-8 rounded-full text-base font-bold border-2">
                                <Link to="/register">Create Account</Link>
                            </Button>
                        </div>
                    </motion.div>

                    {/* Decorative "Canvas" element */}
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="mt-20 relative"
                    >
                        <div className="relative rounded-2xl border-4 border-figma-black/5 dark:border-white/5 shadow-2xl overflow-hidden bg-background">
                            <img 
                                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop" 
                                alt="Dashboard Preview" 
                                className="w-full h-auto object-cover opacity-90"
                            />
                            {/* Figma-like floating elements */}
                            <div className="absolute top-10 left-10 p-4 bg-figma-blue text-white rounded-lg shadow-xl hidden md:block">
                                <div className="text-[10px] uppercase font-bold opacity-80 mb-1">Live Telemetry</div>
                                <div className="text-xl font-black">1,240 TEU</div>
                            </div>
                            <div className="absolute bottom-10 right-10 p-4 bg-figma-green text-white rounded-lg shadow-xl hidden md:block">
                                <div className="text-[10px] uppercase font-bold opacity-80 mb-1">Sync Status</div>
                                <div className="text-xl font-black">99.9%</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
