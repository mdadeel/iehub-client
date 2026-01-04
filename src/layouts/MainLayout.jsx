import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
    return (
        <div className="app">
            <Navbar />
            <main className="flex-grow pt-24 w-full" style={{ maxWidth: '100vw', overflowX: 'hidden' }}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
