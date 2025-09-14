import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import RoleSelection from '@/components/auth/RoleSelection';
import SimpleCustomerSignup from '@/components/auth/SimpleCustomerSignup';
import SimpleBusinessSignup from '@/components/auth/SimpleBusinessSignup';
import PunchCardView from '@/components/customer/PunchCardView';
import DiscoveryScreen from '@/components/customer/DiscoveryScreen';
import BusinessDetailsScreen from '@/components/customer/BusinessDetailsScreen';
import OnePunchLeftScreen from '@/components/customer/OnePunchLeftScreen';
import PunchStation from '@/components/business/PunchStation';
import BusinessPunchHistory from '@/components/business/BusinessPunchHistory';
import CustomerDashboard from '@/components/dashboards/CustomerDashboard';
import CustomerPunchHistory from '@/components/customer/CustomerPunchHistory';
import ErrorBoundary from '@/components/ErrorBoundary';
// import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';

// Simple Login with Firebase Auth
const SimpleLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  console.log('SimpleLogin render:', { user: user?.email, loading });

  // Navigate based on user role when user state changes
  React.useEffect(() => {
    if (user) {
      console.log('SimpleLogin: User authenticated, details:', {
        email: user.email,
        role: user.role,
        uid: user.uid,
        currentPath: window.location.pathname
      });
      
      // Only redirect if we're on login/root pages to avoid interfering with signup navigation
      if (window.location.pathname === '/login' || window.location.pathname === '/') {
        if (user.role === 'business_owner') {
          console.log('SimpleLogin: Navigating to business dashboard because role is business_owner');
          navigate('/business');
        } else {
          console.log('SimpleLogin: Navigating to customer dashboard because role is:', user.role);
          navigate('/customers');
        }
      } else {
        console.log('SimpleLogin: User authenticated but not on login page, skipping redirect');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await signIn(email, password);
      
      console.log('Login successful, waiting for user state update...');
      
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.');
      console.error('Sign in error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground">NakevLink</h1>
          <p className="mt-2 text-muted-foreground">Welcome back</p>
        </div>

        {/* Login Card */}
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Sign in to your account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            {/* Sign up link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account yet?{' '}
                <Link
                  to="/signup"
                  className="font-medium text-primary hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};


// Business Dashboard  
const BusinessDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [businessData, setBusinessData] = useState<{
    id: string;
    name: string;
    contactName?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
    address?: string | null;
    categoryId: number;
    image?: string | null;
    description?: string | null;
    punchNum?: number | null;
    expirationDurationInDays?: number | null;
    createdDatetime?: string | null;
  } | null>(null);
  const [metrics, setMetrics] = useState({
    activePunchCards: 0,
    punchesToday: 0,
    averageTimeToReward: '0 days',
    almostCompleteCards: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('BusinessDashboard render:', {
    email: user?.email,
    role: user?.role,
    displayName: user?.displayName
  });

  // Helper function to get category emoji
  const getCategoryEmoji = (categoryId?: number) => {
    if (!categoryId) return '🏢';
    const categoryEmojis: { [key: number]: string } = {
      1: '💪', // Fitness Studios
      2: '☕', // Coffee Shops  
      3: '🍽️', // Restaurants
      4: '🛍️', // Retail Stores
      5: '💅', // Beauty & Wellness
      6: '⚙️', // Services
      7: '🏢'  // Other
    };
    return categoryEmojis[categoryId] || '🏢';
  };

  // Helper function to get category name
  const getCategoryName = (categoryId?: number) => {
    if (!categoryId) return 'Business';
    const categoryNames: { [key: number]: string } = {
      1: 'Fitness Studio',
      2: 'Coffee Shop',
      3: 'Restaurant', 
      4: 'Retail Store',
      5: 'Beauty & Wellness',
      6: 'Services',
      7: 'Other'
    };
    return categoryNames[categoryId] || 'Business';
  };

  // Helper function to format business image
  const getBusinessImage = (business: { image?: string }) => {
    if (business.image && business.image.startsWith('data:image/')) {
      return business.image;
    }
    return null; // We'll use emoji/name fallback in UI
  };

  // Calculate metrics from punch cards data
  const calculateMetrics = async (punchCards: { id: string; expiresAt: string; maxPunches: number; createdAt?: string | null }[], businessEmail?: string) => {
    const now = new Date();
    
    // Active punch cards (not expired)
    const activePunchCards = punchCards.filter(card => {
      const expiresAt = new Date(card.expiresAt);
      return expiresAt > now; // Not expired
    }).length;
    
    // Count today's punches from Firestore
    let punchesToday = 0;
    if (businessEmail) {
      try {
        const { db } = await import('@/config/firebase');
        const { collection, query, where, getDocs } = await import('firebase/firestore');
        
        // Get start and end of today
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        
        console.log('BusinessDashboard: Counting punches for business:', businessEmail, 'from', startOfToday, 'to', endOfToday);
        
        const punchesQuery = query(
          collection(db, 'punches'),
          where('businessEmail', '==', businessEmail),
          where('punchTime', '>=', startOfToday),
          where('punchTime', '<=', endOfToday)
        );
        
        const punchesSnapshot = await getDocs(punchesQuery);
        punchesToday = punchesSnapshot.size;
        
        console.log('BusinessDashboard: Found', punchesToday, 'punches today');
      } catch (error) {
        console.error('BusinessDashboard: Error counting today\'s punches:', error);
        punchesToday = 0;
      }
    }
    
    // Almost complete cards (simplified calculation)
    const almostCompleteCards = Math.min(
      punchCards.filter(card => new Date(card.expiresAt) > now).length,
      Math.floor(activePunchCards * 0.3)
    );
    
    return {
      activePunchCards,
      punchesToday,
      averageTimeToReward: '5 days', // Placeholder calculation
      almostCompleteCards
    };
  };

  // Fetch business data and metrics
  const fetchBusinessData = React.useCallback(async () => {
    if (!user?.email) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Import Data Connect functions
      const { getBusinessByEmail, getBusinessPunchCards } = await import('@/lib/dataconnect');
      
      // Get business data
      console.log('BusinessDashboard: Fetching business data for:', user.email);
      const businessResult = await getBusinessByEmail({ email: user.email });
      
      if (businessResult && businessResult.data?.businesses && businessResult.data.businesses.length > 0) {
        const business = businessResult.data.businesses[0];
        setBusinessData(business);
        
        // Get punch cards for this business
        const punchCardsResult = await getBusinessPunchCards({ businessId: business.id });
        const punchCards = punchCardsResult.data?.punchCards || [];
        
        // Calculate metrics
        const calculatedMetrics = await calculateMetrics(punchCards, user.email);
        setMetrics(calculatedMetrics);
        
        console.log('BusinessDashboard: Data loaded', {
          business: business.name,
          punchCards: punchCards.length,
          metrics: calculatedMetrics
        });
        
      } else {
        console.log('BusinessDashboard: Business lookup failed', {
          email: user.email,
          result: businessResult,
          hasData: !!businessResult?.data,
          hasBusinesses: !!businessResult?.data?.businesses,
          businessCount: businessResult?.data?.businesses?.length || 0
        });
        
        setError(`Business profile not found for ${user.email}. This may happen if:
        • The business profile wasn't created during signup
        • There's a mismatch between your login email and business email
        • The Data Connect database is not accessible
        
        Please try logging out and signing up again, or contact support.`);
      }
      
    } catch (error) {
      console.error('BusinessDashboard: Error fetching data:', error);
      setError('Failed to load business data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  // Fetch data on component mount
  React.useEffect(() => {
    fetchBusinessData();
  }, [fetchBusinessData]);

  // Page visibility - refresh when user comes back to the page  
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && !loading && businessData) {
        console.log('BusinessDashboard: Page became visible, refreshing metrics...');
        fetchBusinessData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [loading, businessData, fetchBusinessData]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-16">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading your business dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 pb-16">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Something went wrong</h3>
            <p className="text-gray-600 mt-2">{error}</p>
          </div>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Button onClick={fetchBusinessData}>
              Try Again
            </Button>
            <Button 
              variant="outline" 
              onClick={async () => {
                await logout();
                navigate('/login');
              }}
            >
              Logout & Return to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const businessImage = businessData ? getBusinessImage(businessData) : null;
  const categoryEmoji = getCategoryEmoji(businessData?.categoryId);
  const categoryName = getCategoryName(businessData?.categoryId);

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Hero Section */}
      <div className="relative">
        {/* Business Header with Background and Logo */}
        <div className="h-48 md:h-64 bg-gradient-to-r from-primary/20 to-primary/30 relative overflow-hidden">
          {/* Background Image (Blurred) */}
          {businessImage ? (
            <>
              <img 
                src={businessImage} 
                alt={businessData?.name}
                className="absolute inset-0 w-full h-full object-cover blur-sm opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-primary/20"></div>
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-primary/20"></div>
          )}
          
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        
        {/* Business Info with Logo */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-end space-x-4">
            {/* Business Logo */}
            <div className="flex-shrink-0">
              {businessImage ? (
                <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-lg p-2 shadow-lg">
                  <img 
                    src={businessImage} 
                    alt={businessData?.name}
                    className="w-full h-full object-contain rounded-md"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 md:w-24 md:h-24 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-3xl md:text-4xl">{categoryEmoji}</span>
                </div>
              )}
            </div>
            
            {/* Business Info */}
            <div className="flex-1 min-w-0 pb-2">
              <h1 className="text-2xl md:text-3xl font-bold mb-1 text-white drop-shadow-lg">
                {businessData?.name || 'Your Business'}
              </h1>
              {businessData?.address && (
                <div className="flex items-center space-x-3 text-sm">
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white/90">
                    📍 {businessData.address}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="secondary" 
                size="sm"
                className="bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30"
              >
                ⚙️ Manage Profile
              </Button>
              <Button 
                onClick={handleLogout} 
                variant="secondary" 
                size="sm"
                className="bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Active Punch Cards */}
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🎫</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{metrics.activePunchCards}</p>
              <p className="text-sm text-muted-foreground">Active Cards</p>
            </CardContent>
          </Card>

          {/* Punches Today */}
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">✨</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{metrics.punchesToday}</p>
              <p className="text-sm text-muted-foreground">Punches Today</p>
            </CardContent>
          </Card>

          {/* Average Time to Reward */}
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⏱️</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{metrics.averageTimeToReward}</p>
              <p className="text-sm text-muted-foreground">Avg to Reward</p>
            </CardContent>
          </Card>

          {/* Almost Complete Cards */}
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🏆</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{metrics.almostCompleteCards}</p>
              <p className="text-sm text-muted-foreground">Almost Complete</p>
            </CardContent>
          </Card>
        </div>

        {/* Primary CTAs */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Create Punch Program - Show if no program exists */}
          {!businessData?.punchNum && (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">➕</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Create Punch Program</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Set up your punch card rewards program
                </p>
                <Button className="w-full">
                  Create Program
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Punch Now */}
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Punch Now</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Validate customer punch codes
              </p>
              <Button 
                onClick={() => navigate('/business/punch-station')} 
                variant="outline"
                className="w-full"
              >
                Open Punch Station
              </Button>
            </CardContent>
          </Card>

          {/* Insights */}
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Insights</h3>
              <p className="text-muted-foreground text-sm mb-4">
                View analytics and reports
              </p>
              <Button 
                onClick={() => navigate('/business/insights')} 
                variant="outline" 
                className="w-full"
              >
                View Analytics
              </Button>
            </CardContent>
          </Card>

          {/* History */}
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📜</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">History</h3>
              <p className="text-muted-foreground text-sm mb-4">
                View all punch transactions
              </p>
              <Button 
                onClick={() => navigate('/business/history')} 
                variant="outline" 
                className="w-full"
              >
                View History
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

function App() {
  console.log('App component rendering...');
  
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<SimpleLogin />} />
            <Route path="/login" element={<SimpleLogin />} />
            <Route path="/signup" element={<RoleSelection />} />
            <Route path="/signup/customer" element={<SimpleCustomerSignup />} />
            <Route path="/signup/business" element={<SimpleBusinessSignup />} />
            <Route path="/customers" element={<CustomerDashboard />} />
            <Route path="/customers/discovery" element={<DiscoveryScreen />} />
            <Route path="/customers/one-punch-left" element={<OnePunchLeftScreen />} />
            <Route path="/customers/history" element={<CustomerPunchHistory />} />
            <Route path="/customers/business/:businessId" element={<BusinessDetailsScreen />} />
            <Route path="/customers/cards/:cardId" element={<PunchCardView />} />
            <Route path="/business" element={<BusinessDashboard />} />
            <Route path="/business/punch-station" element={<PunchStation />} />
            <Route path="/business/history" element={<BusinessPunchHistory />} />
            <Route path="/business/insights" element={<div className="p-4 text-center"><h1>Business Insights (Coming Soon)</h1></div>} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
