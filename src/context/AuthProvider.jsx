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

    const loginWithGoogle = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    };

    const logout = () => {
        setLoading(true);
        return signOut(auth);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const value = {
        user,
        loading,
        theme,
        toggleTheme,
        registerUser,
        loginUser,
        loginWithGoogle,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
