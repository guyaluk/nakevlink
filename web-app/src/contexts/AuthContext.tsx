import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile
} from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { auth, functions } from '@/config/firebase';

export type UserRole = 'customer' | 'business_owner';

interface AuthUser extends User {
  role?: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData?: { name: string; role: UserRole; favoriteCategory?: number }) => Promise<User>;
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
  const [loading, setLoading] = useState(true);

  console.log('AuthProvider render:', { user: user?.email, loading });

  // Get custom claims and role from Firebase Auth
  const getUserWithRole = async (firebaseUser: User): Promise<AuthUser> => {
    try {
      // Temporarily skip token result calls to isolate auth issues
      console.log('AuthContext: Skipping token result call, using default role');
      return {
        ...firebaseUser,
        role: 'customer' // Default to customer for now
      };
    } catch (error) {
      console.error('AuthContext: Error getting token result:', error);
      return {
        ...firebaseUser,
        role: 'customer'
      };
    }
  };

  // Firebase authentication functions
  const signIn = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Attempting to sign in user:', email);
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('AuthContext: Sign in successful, user:', result.user.email);
      
      const userWithRole = await getUserWithRole(result.user);
      console.log('AuthContext: Setting user with role:', userWithRole.email, userWithRole.role);
      setUser(userWithRole);
      
      console.log('AuthContext: User state updated successfully');
    } catch (error: any) {
      console.error('AuthContext: Sign in error:', error);
      throw new Error(error.message || 'Failed to sign in');
    }
  };

  const signUp = async (email: string, password: string, userData?: { name: string; role: UserRole; favoriteCategory?: number }) => {
    try {
      console.log('AuthContext: Creating user with email:', email);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name if provided
      if (userData?.name) {
        console.log('AuthContext: Updating display name to:', userData.name);
        await updateProfile(result.user, {
          displayName: userData.name
        });
      }
      
      // Temporarily disable Firebase Functions calls to isolate auth issues
      console.log('AuthContext: Skipping Firebase Functions call for now');
      
      // Create user with default role for now
      const userWithRole: AuthUser = {
        ...result.user,
        role: userData?.role || 'customer'
      };
      setUser(userWithRole);
      
      console.log('User created successfully:', {
        uid: result.user.uid,
        email: result.user.email,
        role: userData?.role,
        userData: userData
      });
      
      return result.user;
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw new Error(error.message || 'Failed to create account');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error: any) {
      console.error('Logout error:', error);
      throw new Error(error.message || 'Failed to sign out');
    }
  };

  // Listen to authentication state changes
  useEffect(() => {
    console.log('AuthContext useEffect: Setting up auth listener');
    
    // Add timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      console.log('AuthContext: Loading timeout reached, setting loading to false');
      setLoading(false);
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('AuthContext: Auth state changed:', firebaseUser?.email || 'no user');
      clearTimeout(loadingTimeout);
      setLoading(true);
      
      try {
        if (firebaseUser) {
          console.log('AuthContext: Getting user role for:', firebaseUser.email);
          const userWithRole = await getUserWithRole(firebaseUser);
          console.log('AuthContext: User with role:', userWithRole.email, userWithRole.role);
          setUser(userWithRole);
        } else {
          console.log('AuthContext: No user, setting to null');
          setUser(null);
        }
      } catch (error) {
        console.error('AuthContext: Error getting user role:', error);
        setUser(firebaseUser ? { ...firebaseUser, role: 'customer' } : null);
      } finally {
        console.log('AuthContext: Setting loading to false');
        setLoading(false);
      }
    });

    return () => {
      console.log('AuthContext: Cleaning up auth listener');
      clearTimeout(loadingTimeout);
      unsubscribe();
    };
  }, []);

  const value = {
    user,
    loading,
    signIn,
    signUp,
    logout
  };

  // Show loading screen while Firebase initializes
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};