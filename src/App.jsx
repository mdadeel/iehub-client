import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AllProductsPage from './pages/AllProductsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import AddExportPage from './pages/AddExportPage';
import MyImportsPage from './pages/MyImportsPage';
import MyExportsPage from './pages/MyExportsPage';
import ProfilePage from './pages/ProfilePage';
import AboutUsPage from './pages/AboutUsPage';
import ContactPage from './pages/ContactPage';
import DashboardLayout from './layouts/DashboardLayout';
import PrivateRoute from './routes/PrivateRoute';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<AllProductsPage />} />
              <Route path="/product/:id" element={<ProductDetailsPage />} />
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />

              {/* Dashboard Wrapper */}
              <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
                <Route index element={<DashboardPage />} />
                <Route path="add-export" element={<AddExportPage />} />
                <Route path="my-imports" element={<MyImportsPage />} />
                <Route path="my-exports" element={<MyExportsPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster position="top-center" />
      </AuthProvider>
    </Router>
  );
}

export default App;
