import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState, useEffect } from 'react';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            // Validate auth state
            if (loading === undefined || user === undefined) {
                console.error('Auth context is not properly initialized');
            }
        } catch (err) {
            setError(err.message);
            console.error('Error in PrivateRoute:', err);
        }
    }, [user, loading]);

    if (error) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', textAlign: 'center' }}>
                <div>
                    <h2>Authentication Error</h2>
                    <p>There was an issue with the authentication system.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn"
                        style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
                    >
                        Refresh Page
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div style={{
                    width: '50px',
                    height: '50px',
                    border: '5px solid #f3f3f3',
                    borderTop: '5px solid var(--primary)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
            </div>
        );
    }

    // Check if user is authenticated (either real user or guest)
    if (user) {
        // For nested routes, use Outlet; otherwise render children
        return children || <Outlet />;
    }

    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
