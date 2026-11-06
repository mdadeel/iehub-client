import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
    const { pathname } = useLocation();
    // The home hero sits under the transparent nav; every other page needs the header offset.
    const isHome = pathname === '/';

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className={isHome ? 'flex-1 w-full overflow-x-hidden' : 'flex-1 w-full overflow-x-hidden pt-16'}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
