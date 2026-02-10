
import { UserProfile } from "./types";

// HARD-CODED ADMIN CREDENTIALS
const ADMIN_EMAIL = "zedelmaseduardomonteiro@gmail.com";
const ADMIN_PASS = "C=_1=j_1+8";

// Mock Database for General Users
let MOCK_USERS: UserProfile[] = [
    { id: 'u1', name: 'John Doe', email: 'john@example.com', role: 'reader', joinedAt: Date.now() - 1000000, status: 'active' },
    { id: 'u2', name: 'Sarah Journalist', email: 'sarah@press.com', role: 'journalist_pending', joinedAt: Date.now() - 500000, status: 'active' },
];

export const AuthService = {
    // 1. Admin Verification
    verifyAdmin: (email: string, pass: string): boolean => {
        return email === ADMIN_EMAIL && pass === ADMIN_PASS;
    },

    // 2. General Login (Mock)
    login: async (email: string, pass: string): Promise<UserProfile> => {
        // Simulate network delay
        await new Promise(r => setTimeout(r, 800));
        
        // Special check for Admin logging in via normal portal
        if (email === ADMIN_EMAIL && pass === ADMIN_PASS) {
            return { id: 'admin-001', name: 'Super Admin', email: ADMIN_EMAIL, role: 'admin', joinedAt: 0, status: 'active' };
        }

        const user = MOCK_USERS.find(u => u.email === email);
        
        if (!user) throw new Error("Invalid credentials");
        if (user.status === 'pending_verification') throw new Error("Email not verified. Please verify your account.");
        
        return user;
    },

    // 3. Register (Starts Verification Process)
    register: async (name: string, email: string, pass: string): Promise<UserProfile> => {
        await new Promise(r => setTimeout(r, 800));
        
        if (MOCK_USERS.find(u => u.email === email)) {
            throw new Error("Email already exists");
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit code
        
        const newUser: UserProfile = {
            id: `u-${Date.now()}`,
            name,
            email,
            role: 'reader',
            joinedAt: Date.now(),
            status: 'pending_verification',
            verificationCode: verificationCode 
        };
        
        MOCK_USERS.push(newUser);
        
        // Simulate Sending Email
        console.log(`[EMAIL SERVICE] Sending code ${verificationCode} to ${email}`);
        
        return newUser;
    },

    // 4. Verify Email
    verifyEmail: async (email: string, code: string): Promise<UserProfile> => {
        await new Promise(r => setTimeout(r, 800));
        
        const userIndex = MOCK_USERS.findIndex(u => u.email === email);
        if (userIndex === -1) throw new Error("User not found");
        
        const user = MOCK_USERS[userIndex];
        
        // For demo purposes, we accept '123456' as a master code or the actual generated code
        if (user.verificationCode !== code && code !== '123456') {
            throw new Error("Invalid verification code");
        }

        const updatedUser: UserProfile = { ...user, status: 'active', verificationCode: undefined };
        MOCK_USERS[userIndex] = updatedUser;
        
        return updatedUser;
    },

    // 5. Continue with Google (Mock)
    loginWithGoogle: async (): Promise<UserProfile> => {
        await new Promise(r => setTimeout(r, 1200));
        // Simulate a Google User response
        const googleUser: UserProfile = {
            id: `g-${Date.now()}`,
            name: 'Google User',
            email: 'user@gmail.com',
            role: 'reader',
            joinedAt: Date.now(),
            avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
            status: 'active'
        };
        // Check if exists, else add
        const exists = MOCK_USERS.find(u => u.email === googleUser.email);
        if (!exists) MOCK_USERS.push(googleUser);
        
        return exists || googleUser;
    },

    // 6. Admin: Get All Users
    getAllUsers: async (): Promise<UserProfile[]> => {
        return [...MOCK_USERS]; // Return copy
    },

    // 7. Admin: Approve Journalist
    updateUserRole: async (userId: string, newRole: UserProfile['role']) => {
        MOCK_USERS = MOCK_USERS.map(u => u.id === userId ? { ...u, role: newRole } : u);
        return true;
    }
};
