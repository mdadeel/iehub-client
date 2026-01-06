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
        document.body.className = theme;
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
        // Create a mock user object for demo/guest access
        const guestUser = {
            uid: `guest-${Date.now()}`,
            email: userType === 'demo-user' ? 'demo@importexport.com' :
                   userType === 'demo-admin' ? 'admin@importexport.com' :
                   `guest-${Date.now()}@example.com`,
            displayName: `${userType.charAt(0).toUpperCase() + userType.slice(1)} User`,
            isGuest: true,
            userType: userType
        };

        setUser(guestUser);
        setLoading(false);
        return Promise.resolve({ user: guestUser });
    };

    const loginWithGoogle = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    };

    const logout = () => {
        setLoading(true);
        return signOut(auth);
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
            setUser(currentUser);
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
