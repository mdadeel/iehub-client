import { motion } from 'framer-motion';
import { HiMail, HiPhone, HiLocationMarker, HiClock } from 'react-icons/hi';
import toast from 'react-hot-toast';

const ContactPage = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success("Message received. Our trade expert will contact you within 24 hours.", {
            style: { background: 'var(--bg-card)', color: 'var(--text-body)', border: '1px solid var(--primary)' }
        });
        e.target.reset();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container"
            style={{ padding: '160px 0 120px 0' }}
        >
            <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    style={{ fontSize: '4.5rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-2.5px' }}
                >
                    Connect with <span style={{ color: 'var(--primary)' }}>Experts</span>
                </motion.h1>
                <p style={{ opacity: 0.5, fontSize: '1.4rem', maxWidth: '750px', margin: '0 auto', fontWeight: 600 }}>
                    Our dedicated sector specialists are available 24/7 to help you navigate international trade protocols and logistics.
                </p>
            </div>

            <div className="grid" style={{ gridTemplateColumns: '1.1fr 0.9fr', gap: '6rem' }}>
                {/* Premium Contact Form */}
                <motion.div
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="card"
                    style={{
                        padding: '4rem',
                        background: 'var(--bg-glass)',
                        backdropFilter: 'blur(30px)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '40px',
                        boxShadow: 'var(--shadow-lg)'
                    }}
                >
                    <h2 style={{ marginBottom: '3rem', fontSize: '2rem', fontWeight: 900, letterSpacing: '-1px' }}>Initialize Trade <span style={{ color: 'var(--primary)' }}>Inquiry</span></h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div className="flex flex-col gap-3">
                                <label style={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', opacity: 0.4 }}>Authorized Entity Name</label>
                                <input type="text" required placeholder="John Doe" className="premium-input" />
                            </div>
                            <div className="flex flex-col gap-3">
                                <label style={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', opacity: 0.4 }}>Secure Communication Email</label>
                                <input type="email" required placeholder="john@enterprise.com" className="premium-input" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <label style={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', opacity: 0.4 }}>Sector Classification</label>
                            <select className="premium-input">
                                <option>General Sourcing Inquiry</option>
                                <option>Export Compliance Support</option>
                                <option>Logistics & Shipping Telemetry</option>
                                <option>Bulk Order Verification Protocol</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-3">
                            <label style={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', opacity: 0.4 }}>Telemetry Description / Message</label>
                            <textarea
                                required rows="6"
                                placeholder="Describe your trade requirements in detail for our analysts..."
                                className="premium-input"
                                style={{ resize: 'none' }}
                            ></textarea>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="btn btn-primary"
                            style={{ padding: '1.3rem', fontWeight: 900, fontSize: '1.1rem', marginTop: '1rem', letterSpacing: '1px', borderRadius: '16px' }}
                        >
                            TRANSMIT INQUIRY
                        </motion.button>
                    </form>
                </motion.div>

                {/* Contact Info Sidebar */}
                <div className="flex flex-col gap-8">
                    <motion.div
                        initial={{ x: 30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="card contact-item-premium"
                    >
                        <div className="icon-box-premium"><HiMail /></div>
                        <div>
                            <h4 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '0.3rem' }}>Global Comms</h4>
                            <p style={{ fontSize: '1rem', fontWeight: 600, opacity: 0.5 }}>concierge@iehub.global</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ x: 30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="card contact-item-premium"
                    >
                        <div className="icon-box-premium" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}><HiPhone /></div>
                        <div>
                            <h4 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '0.3rem' }}>Priority Support</h4>
                            <p style={{ fontSize: '1rem', fontWeight: 600, opacity: 0.5 }}>+1 (888) TRADE-INTL</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ x: 30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="card contact-item-premium"
                    >
                        <div className="icon-box-premium" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}><HiLocationMarker /></div>
                        <div>
                            <h4 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '0.3rem' }}>Global HQ</h4>
                            <p style={{ fontSize: '1rem', fontWeight: 600, opacity: 0.5 }}>123 Gateway Plaza, NY 10001</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ x: 30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="card"
                        style={{
                            padding: '3rem',
                            flex: 1,
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-glass)',
                            borderRadius: '32px',
                            backdropFilter: 'blur(20px)'
                        }}
                    >
                        <div className="flex items-center gap-4" style={{ marginBottom: '2.5rem' }}>
                            <HiClock style={{ color: 'var(--primary)', fontSize: '2rem' }} />
                            <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, letterSpacing: '1px' }}>OPERATIONAL WINDOWS</h3>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between" style={{ opacity: 0.6 }}>
                                <span style={{ fontWeight: 700 }}>Mon - Fri (Global Trade)</span>
                                <span style={{ fontWeight: 900, color: 'white' }}>24 HOURS</span>
                            </div>
                            <div className="flex justify-between" style={{ opacity: 0.6, paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                                <span style={{ fontWeight: 700 }}>Sat - Sun (Consultations)</span>
                                <span style={{ fontWeight: 900, color: 'white' }}>10 AM - 4 PM</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <style>{`
                .premium-input {
                    padding: 1.25rem 1.5rem;
                    border-radius: 16px;
                    border: 1px solid var(--border-color);
                    background: var(--bg-inset);
                    color: var(--text-body);
                    outline: none;
                    font-size: 1rem;
                    font-weight: 600;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .premium-input:focus { 
                    border-color: var(--primary); 
                    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1); 
                    background: var(--bg-card);
                }
                
                .contact-item-premium {
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                    padding: 2.5rem 3rem;
                    border: 1px solid var(--border-color);
                    background: var(--bg-glass);
                    backdropFilter: blur(20px);
                    borderRadius: 32px;
                    transition: all 0.3s ease;
                }
                .contact-item-premium:hover {
                    transform: translateX(10px);
                    background: rgba(255,255,255,0.03);
                }
                .icon-box-premium {
                    font-size: 2rem;
                    color: var(--primary);
                    background: rgba(37, 99, 235, 0.1);
                    width: 72px;
                    height: 72px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 20px;
                    box-shadow: 0 8px 16px -4px rgba(37, 99, 235, 0.2);
                }
                
                @media (max-width: 992px) {
                    .grid { grid-template-columns: 1fr !important; gap: 4rem !important; }
                }
            `}</style>
        </motion.div>
    );
};

export default ContactPage;
