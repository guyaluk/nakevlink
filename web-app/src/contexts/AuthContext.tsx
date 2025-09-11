import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { 
  onAuthStateChanged,
  onIdTokenChanged,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth } from '@/config/firebase';
import { createUser as createUserInDb } from '@/lib/dataconnect/esm/index.esm.js';

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

  // INSTANT role detection - uses cache first, verifies in background
  const getUserRoleInstant = (firebaseUser: User): AuthUser => {
    const cachedRole = localStorage.getItem(`user_role_${firebaseUser.uid}`) as UserRole;
    const role = (cachedRole === 'business_owner' || cachedRole === 'customer') ? cachedRole : 'customer';
    
    console.log('AuthContext: Instant role for', firebaseUser.email, ':', role);
    
    return {
      ...firebaseUser,
      role
    };
  };

  // BACKGROUND role verification - runs async to update if needed
  const verifyRoleInBackground = async (firebaseUser: User): Promise<void> => {
    try {
      console.log('AuthContext: Background verification for:', firebaseUser.email);
      
      // Check custom claims first
      try {
        const idTokenResult = await firebaseUser.getIdTokenResult();
        if (idTokenResult.claims.role) {
          const claimsRole = idTokenResult.claims.role as UserRole;
          console.log('AuthContext: Found custom claims role:', claimsRole);
          
          const cachedRole = localStorage.getItem(`user_role_${firebaseUser.uid}`);
          if (cachedRole !== claimsRole) {
            console.log('AuthContext: Role changed via custom claims:', cachedRole, '→', claimsRole);
            localStorage.setItem(`user_role_${firebaseUser.uid}`, claimsRole);
            setUser({
              ...firebaseUser,
              role: claimsRole
            });
          }
          return;
        }
      } catch (claimsError) {
        console.log('AuthContext: No custom claims, checking database');
      }
      
      // Database check with retries
      let attempts = 0;
      const maxAttempts = 3;
      
      while (attempts < maxAttempts) {
        try {
          const { getBusinessByEmail } = await import('@/lib/dataconnect');
          const business = await getBusinessByEmail({ email: firebaseUser.email || '' });
          
          const dbRole: UserRole = business ? 'business_owner' : 'customer';
          const cachedRole = localStorage.getItem(`user_role_${firebaseUser.uid}`);
          
          if (cachedRole !== dbRole) {
            console.log('AuthContext: Role changed via database:', cachedRole, '→', dbRole);
            localStorage.setItem(`user_role_${firebaseUser.uid}`, dbRole);
            setUser({
              ...firebaseUser,
              role: dbRole
            });
            
            // If database shows business_owner but custom claims don't match, set the role
            if (dbRole === 'business_owner') {
              try {
                console.log('AuthContext: Setting business_owner custom claims for existing user');
                const { functions } = await import('@/config/firebase');
                const { httpsCallable } = await import('firebase/functions');
                const setUserRole = httpsCallable(functions, 'setUserRole');
                
                await setUserRole({
                  uid: firebaseUser.uid,
                  role: 'business_owner'
                });
                
                console.log('AuthContext: Successfully set custom claims for business owner');
              } catch (roleError) {
                console.error('AuthContext: Failed to set custom claims for business owner:', roleError);
                // Continue anyway - user can still access business features with localStorage role
              }
            }
          } else {
            console.log('AuthContext: Role verified, no change needed');
          }
          break;
        } catch (dbError: any) {
          attempts++;
          console.error(`AuthContext: Background verification attempt ${attempts} failed:`, dbError);
          
          if (dbError.code === 'permission-denied' && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
          } else {
            console.error('AuthContext: Background verification failed permanently');
            break;
          }
        }
      }
    } catch (error) {
      console.error('AuthContext: Background role verification error:', error);
    }
  };

  // Firebase authentication functions
  const signIn = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Attempting to sign in user:', email);
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('AuthContext: Sign in successful, user:', result.user.email);
      
      // INSTANT: Set user with cached role immediately
      const userWithRole = getUserRoleInstant(result.user);
      console.log('AuthContext: Setting user with instant role:', userWithRole.email, userWithRole.role);
      setUser(userWithRole);
      
      // BACKGROUND: Verify role and update if needed
      verifyRoleInBackground(result.user);
      
      console.log('AuthContext: Instant login complete, background verification started');
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
      
      // Save user to database (only for customers, business owners are handled by SimpleBusinessSignup)
      if (userData?.role === 'customer') {
        try {
          await createUserInDb({
            id: result.user.uid,
            name: userData?.name || result.user.displayName || '',
            email: result.user.email || '',
            favoriteCategory: userData?.favoriteCategory
          });
          console.log('AuthContext: Customer saved to User table');
        } catch (dbError) {
          console.error('AuthContext: Failed to save customer to database:', dbError);
          // Continue even if database save fails
        }
      } else if (userData?.role === 'business_owner') {
        console.log('AuthContext: Business owner will be saved to Business table by SimpleBusinessSignup');
      }
      
      // Create user with role
      const userWithRole: AuthUser = {
        ...result.user,
        role: userData?.role || 'customer'
      };
      
      // Store role in localStorage as a temporary solution until custom claims are set up
      localStorage.setItem(`user_role_${result.user.uid}`, userData?.role || 'customer');
      
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
    console.log('AuthContext useEffect: Setting up auth listeners');
    
    // Add timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      console.log('AuthContext: Loading timeout reached, setting loading to false');
      setLoading(false);
    }, 5000);

    // Main auth state listener - handles login/logout
    const unsubscribeAuthState = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('AuthContext: Auth state changed:', firebaseUser?.email || 'no user');
      clearTimeout(loadingTimeout);
      setLoading(true);
      
      try {
        if (firebaseUser) {
          // INSTANT: Set user with cached role immediately
          const userWithRole = getUserRoleInstant(firebaseUser);
          console.log('AuthContext: Setting instant role:', userWithRole.email, userWithRole.role);
          setUser(userWithRole);
          
          // BACKGROUND: Verify role and update if needed
          verifyRoleInBackground(firebaseUser);
        } else {
          console.log('AuthContext: No user, setting to null');
          setUser(null);
        }
      } catch (error) {
        console.error('AuthContext: Error in auth state change:', error);
        setUser(firebaseUser ? { ...firebaseUser, role: 'customer' } : null);
      } finally {
        console.log('AuthContext: Setting loading to false');
        setLoading(false);
      }
    });

    // Token listener - handles custom claims changes
    const unsubscribeTokenChange = onIdTokenChanged(auth, (firebaseUser) => {
      if (firebaseUser && user) {
        console.log('AuthContext: Token changed, checking for updated claims');
        verifyRoleInBackground(firebaseUser);
      }
    });

    return () => {
      console.log('AuthContext: Cleaning up auth listeners');
      clearTimeout(loadingTimeout);
      unsubscribeAuthState();
      unsubscribeTokenChange();
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