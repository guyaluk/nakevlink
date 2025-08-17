import React, { createContext, useContext, useState, useEffect } from 'react';

// Temporarily remove Firebase imports to test step by step
// import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
// import { auth } from '@/config/firebase';

// Mock User type for now
interface MockUser {
  uid: string;
  email: string | null;
}

// LocalStorage-based user store for testing
interface StoredUser {
  uid: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  favoriteCategory?: number;
}

const USER_STORE_KEY = 'nakevlink_mock_users';

// Helper functions for localStorage
const getUserStore = (): StoredUser[] => {
  try {
    const stored = localStorage.getItem(USER_STORE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Error reading user store:', error);
    return [];
  }
};

const saveUserStore = (users: StoredUser[]): void => {
  try {
    localStorage.setItem(USER_STORE_KEY, JSON.stringify(users));
  } catch (error) {
    console.warn('Error saving user store:', error);
  }
};

const addUserToStore = (user: StoredUser): void => {
  const users = getUserStore();
  users.push(user);
  saveUserStore(users);
  console.log('User saved to localStorage. Total users:', users.length);
};

export type UserRole = 'customer' | 'business_owner';

interface AuthUser extends MockUser {
  role?: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData?: { name: string; role: UserRole; favoriteCategory?: number }) => Promise<MockUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false); // Start with false for now

  // Mock authentication functions with real validation
  const signIn = async (email: string, password: string) => {
    console.log('Mock signIn attempt:', email);
    
    // Find user in localStorage
    const users = getUserStore();
    console.log('Current users in store:', users.length);
    const storedUser = users.find(u => u.email === email && u.password === password);
    
    if (!storedUser) {
      console.log('User not found. Available emails:', users.map(u => u.email));
      throw new Error('Invalid email or password');
    }
    
    console.log('Sign in successful:', storedUser.name, storedUser.role);
    
    // Set authenticated user
    setUser({
      uid: storedUser.uid,
      email: storedUser.email,
      role: storedUser.role
    });
  };

  const signUp = async (email: string, password: string, userData?: { name: string; role: UserRole; favoriteCategory?: number }) => {
    console.log('Mock signUp:', email);
    
    // Check if user already exists
    const users = getUserStore();
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      throw new Error('Email already in use');
    }
    
    // Create new user
    const newUser: StoredUser = {
      uid: 'mock-uid-' + Date.now(),
      email: email,
      password: password,
      name: userData?.name || 'Unknown',
      role: userData?.role || 'customer',
      favoriteCategory: userData?.favoriteCategory
    };
    
    // Store user in localStorage
    addUserToStore(newUser);
    console.log('User created and stored:', newUser);
    
    // Set authenticated user
    setUser({
      uid: newUser.uid,
      email: newUser.email,
      role: newUser.role
    });
    
    return {
      uid: newUser.uid,
      email: newUser.email
    };
  };

  const logout = async () => {
    console.log('Mock logout');
    setUser(null);
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};