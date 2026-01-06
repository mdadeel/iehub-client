// Script to create demo users in Firebase
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { app } from './firebase.config.js'; // Adjust path to your firebase config

const auth = getAuth(app);

// Demo users to create
const demoUsers = [
    {
        email: 'demo@importexport.com',
        password: 'demopass123',
        displayName: 'Demo User'
    },
    {
        email: 'admin@importexport.com',
        password: 'adminpass123',
        displayName: 'Demo Admin'
    }
];

const createDemoUsers = async () => {
    for (const user of demoUsers) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
            console.log(`Created user: ${user.email}`);
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                console.log(`User ${user.email} already exists`);
            } else {
                console.error(`Error creating user ${user.email}:`, error.message);
            }
        }
    }
    console.log('Demo users setup complete');
};

createDemoUsers();