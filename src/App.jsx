import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import { useEffect } from 'react';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductsPage from './pages/AllProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactPage from './pages/ContactPage';
import DashboardPage from './pages/DashboardPage';
import AddExportPage from './pages/AddExportPage';
import MyExportsPage from './pages/MyExportsPage';
import MyImportsPage from './pages/MyImportsPage';
import ProfilePage from './pages/ProfilePage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

// Routes
import PrivateRoute from './routes/PrivateRoute';

function App() {
  const { theme } = useAuth();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className={`app ${theme}`}>
      <Toaster position="top-right" />

      <Routes>
        {/* Admin Routes (No Main Navbar) */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />

        {/* Main Application Routes (Wrapped in MainLayout) */}
        <Route element={<MainLayout />}>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* User Dashboard Routes (Protected) */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="stats" element={<DashboardPage />} />
              <Route path="add-export" element={<AddExportPage />} />
              <Route path="my-exports" element={<MyExportsPage />} />
              <Route path="my-imports" element={<MyImportsPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
