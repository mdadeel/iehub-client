import { Link } from 'react-router-dom';
import { FaFacebook, FaGithub, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
    return (
        <footer style={{
            background: 'var(--bg-subtle-dark)',
            color: 'var(--text-dark)',
            padding: '4rem 0 2rem 0',
            marginTop: '4rem'
        }}>
            <div className="container grid" style={{
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '2rem'
            }}>
                <div>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--secondary)' }}>Import ExportHub</h3>
                    <p style={{ opacity: 0.8 }}>
                        Empowering global trade with the seamless IE Hub import-export management platform.
                    </p>
                </div>

                <div>
                    <h4 style={{ marginBottom: '1rem' }}>Quick Links</h4>
                    <ul style={{ listStyle: 'none' }}>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/products">All Products</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 style={{ marginBottom: '1rem' }}>Contact Info</h4>
                    <p style={{ opacity: 0.8 }}>Email: support@exporthub.com</p>
                    <p style={{ opacity: 0.8 }}>Phone: +1 234 567 890</p>
                    <p style={{ opacity: 0.8 }}>Address: 123 Trade Center, NY</p>
                </div>

                <div>
                    <h4 style={{ marginBottom: '1rem' }}>Follow Us</h4>
                    <div className="flex gap-4">
                        <a href="#"><FaFacebook size={24} /></a>
                        <a href="#"><FaXTwitter size={24} /></a>
                        <a href="#"><FaGithub size={24} /></a>
                        <a href="#"><FaLinkedin size={24} /></a>
                    </div>
                </div>
            </div>

            <div className="container" style={{
                marginTop: '3rem',
                paddingTop: '2rem',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                textAlign: 'center',
                opacity: 0.6
            }}>
                <p>&copy; {new Date().getFullYear()} IE Hub | Import ExportHub. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
