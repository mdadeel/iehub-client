import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import toast from 'react-hot-toast';

const ContactPage = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success("Message sent! Our team will contact you shortly.");
        e.target.reset();
    };

    return (
        <div className="container" style={{ padding: '6rem 0' }}>
            <h1 className="section-title">Get in <span style={{ color: 'var(--primary)' }}>Touch</span></h1>
            <p style={{ textAlign: 'center', maxWidth: '600px', margin: '-2rem auto 4rem', opacity: 0.7 }}>
                Have questions about global trade? Our experts are here to help you navigate the international market.
            </p>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
                {/* Contact Form */}
                <div className="card" style={{ padding: '2.5rem' }}>
                    <h2 style={{ marginBottom: '2rem' }}>Send a Message</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>Full Name</label>
                            <input
                                type="text" required
                                placeholder="John Doe"
                                style={{ padding: '0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'transparent' }}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>Email Address</label>
                            <input
                                type="email" required
                                placeholder="john@example.com"
                                style={{ padding: '0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'transparent' }}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>Subject</label>
                            <select style={{ padding: '0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'transparent' }}>
                                <option>General Inquiry</option>
                                <option>Export Support</option>
                                <option>Import Verification</option>
                                <option>Partnership</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>Message</label>
                            <textarea
                                required rows="4"
                                placeholder="How can we help you?"
                                style={{ padding: '0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'transparent', resize: 'none' }}
                            ></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', marginTop: '1rem' }}>
                            Send Message
                        </button>
                    </form>
                </div>

                {/* Contact Info */}
                <div className="flex flex-col gap-8">
                    <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ fontSize: '2rem', color: 'var(--primary)', background: 'var(--bg-subtle-light)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                            <HiMail />
                        </div>
                        <div>
                            <h4 style={{ fontSize: '1.1rem' }}>Email Us</h4>
                            <p style={{ opacity: 0.6 }}>support@exporthub.com</p>
                        </div>
                    </div>

                    <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ fontSize: '2rem', color: 'var(--accent)', background: 'var(--bg-subtle-light)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                            <HiPhone />
                        </div>
                        <div>
                            <h4 style={{ fontSize: '1.1rem' }}>Call Us</h4>
                            <p style={{ opacity: 0.6 }}>+1 (555) 123-4567</p>
                        </div>
                    </div>

                    <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ fontSize: '2rem', color: 'var(--secondary)', background: 'var(--bg-subtle-light)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                            <HiLocationMarker />
                        </div>
                        <div>
                            <h4 style={{ fontSize: '1.1rem' }}>Our Office</h4>
                            <p style={{ opacity: 0.6 }}>123 Trade Center, New York, NY 10001</p>
                        </div>
                    </div>

                    <div className="card" style={{ padding: '2rem', flex: 1 }}>
                        <h4 style={{ marginBottom: '1rem' }}>Office Hours</h4>
                        <div className="flex justify-between" style={{ opacity: 0.7, marginBottom: '0.5rem' }}>
                            <span>Monday - Friday</span>
                            <span>9 AM - 6 PM</span>
                        </div>
                        <div className="flex justify-between" style={{ opacity: 0.7 }}>
                            <span>Saturday</span>
                            <span>10 AM - 2 PM</span>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                .dark input, .dark select, .dark textarea { border-color: var(--border-dark) !important; color: white; }
                .dark .card div[style*="background: var(--bg-subtle-light)"] { background: var(--bg-dark); }
                .dark option { background: var(--bg-subtle-dark); color: white; }
            `}</style>
        </div>
    );
};

export default ContactPage;
