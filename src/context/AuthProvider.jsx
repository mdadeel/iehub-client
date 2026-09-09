import { useState, useEffect } from 'react';
import {
    onAuthStateChanged,
    signInWithPopup,
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../utils/firebase.config';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    useEffect(() => {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
    }, [theme]);

    // Auth Operations
    const registerUser = (email, password, name, photo) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password)
            .then((result) => {
                return updateProfile(result.user, {
                    displayName: name,
                    photoURL: photo
                });
            });
    };

    const loginUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    // Guest/Demo user login
    const loginAsGuest = (userType = 'guest') => {
        setLoading(true);
        const isAdmin = userType === 'demo-admin';
        const guestUser = {
            uid: `guest-${Date.now()}`,
            email: userType === 'demo-user' ? 'demo@importexport.com' :
                   userType === 'demo-admin' ? 'admin@importexport.com' :
                   `guest-${Date.now()}@example.com`,
            displayName: `${userType.charAt(0).toUpperCase() + userType.slice(1)} User`,
            isGuest: true,
            isAdmin: isAdmin,
            userType: userType
        };

        setUser(guestUser);
        localStorage.setItem('guestUser', JSON.stringify(guestUser));
        setLoading(false);
        return Promise.resolve({ user: guestUser });
    };

    const loginWithGoogle = () => {
        setLoading(true);
        localStorage.removeItem('guestUser');
        return signInWithPopup(auth, googleProvider);
    };

    const logout = () => {
        setLoading(true);
        localStorage.removeItem('guestUser');
        if (user?.isGuest) {
            setUser(null);
            setLoading(false);
            return Promise.resolve();
        }
        return signOut(auth).finally(() => setLoading(false));
    };

    useEffect(() => {
        // Safety timeout in case Firebase fails to respond
        const timeoutId = setTimeout(() => {
            setLoading((currentLoading) => {
                if (currentLoading) {
                    console.warn("Auth check timed out - forcing loading to false");
                    return false;
                }
                return currentLoading;
            });
        }, 5000);

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                const adminEmails = ['admin121@gmail.com', 'admin@importexport.com'];
                currentUser.isAdmin = adminEmails.includes(currentUser.email?.toLowerCase());
                setUser(currentUser);
            } else {
                const savedGuest = localStorage.getItem('guestUser');
                if (savedGuest) {
                    try {
                        setUser(JSON.parse(savedGuest));
                    } catch {
                        setUser(null);
                    }
                } else {
                    setUser(null);
                }
            }
            setLoading(false);
            clearTimeout(timeoutId);
        });
        return () => {
            unsubscribe();
            clearTimeout(timeoutId);
        };
    }, []);

    const value = {
        user,
        loading,
        theme,
        toggleTheme,
        registerUser,
        loginUser,
        loginWithGoogle,
        logout,
        loginAsGuest
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
