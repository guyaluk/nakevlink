import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import RoleSelection from '@/components/auth/RoleSelection';
import SimpleCustomerSignup from '@/components/auth/SimpleCustomerSignup';
import SimpleBusinessSignup from '@/components/auth/SimpleBusinessSignup';
import PunchCardView from '@/components/customer/PunchCardView';
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
        uid: user.uid
      });
      
      if (user.role === 'business_owner') {
        console.log('SimpleLogin: Navigating to business dashboard');
        navigate('/business');
      } else {
        console.log('SimpleLogin: Navigating to customer dashboard');
        navigate('/customers');
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
      
    } catch (err: any) {
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

// Customer Dashboard
const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [nearbyBusinesses, setNearbyBusinesses] = useState<any[]>([]);
  const [frequentlyUsed, setFrequentlyUsed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Function to get business display image (emoji or first letter)
  const getBusinessImage = (business: any) => {
    if (business.image) {
      // If it's a base64 image, return a placeholder emoji based on category
      if (business.image.startsWith('data:image/')) {
        return getCategoryEmoji(business.category_id);
      }
      return business.image;
    }
    return business.name.charAt(0).toUpperCase();
  };

  // Function to get emoji based on category ID
  const getCategoryEmoji = (categoryId: number) => {
    const categoryEmojis: { [key: number]: string } = {
      1: '💪', // Fitness Studios
      2: '☕', // Coffee Shops  
      3: '🍽️', // Restaurants
      4: '🛍️', // Retail Stores
      5: '💅', // Beauty & Wellness
      6: '⚙️'  // Services
    };
    return categoryEmojis[categoryId] || '🏢';
  };

  // Function to get category name
  const getCategoryName = (categoryId: number) => {
    const categoryNames: { [key: number]: string } = {
      1: 'Fitness',
      2: 'Coffee Shop',
      3: 'Restaurant', 
      4: 'Retail',
      5: 'Beauty & Wellness',
      6: 'Services'
    };
    return categoryNames[categoryId] || 'Business';
  };

  // Function to format time ago
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
  };

  // Fetch nearby businesses and user's punch cards
  React.useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Import data functions
        const { getAllBusinesses, getUserPunchCards, getCardPunches } = await import('@/lib/dataconnect');
        
        // Fetch all businesses for nearby cards
        console.log('CustomerDashboard: Fetching all businesses...');
        const businesses = await getAllBusinesses();
        console.log('CustomerDashboard: Found businesses:', businesses.length);
        
        // Transform businesses for nearby cards display
        const nearbyData = businesses.map(business => ({
          id: business.id,
          businessName: business.name,
          image: getBusinessImage(business),
          distance: '0.5 km', // TODO: Calculate real distance based on location
          category: getCategoryName(business.category_id),
          categoryId: business.category_id
        })).slice(0, 8); // Limit to 8 for display
        
        console.log('CustomerDashboard: Nearby businesses prepared:', nearbyData.length);
        setNearbyBusinesses(nearbyData);
        
        // Fetch user's punch cards for frequently used section
        console.log('CustomerDashboard: Fetching user punch cards...');
        const userCards = await getUserPunchCards(user.uid);
        console.log('CustomerDashboard: Found user cards:', userCards.length);
        
        // Get punch counts for each card and transform for display
        const frequentlyUsedData = await Promise.all(
          userCards.map(async (card) => {
            try {
              // Find the business for this card
              const business = businesses.find(b => b.id === card.business_id);
              if (!business) {
                console.log('CustomerDashboard: No business found for card:', card.business_id);
                return null;
              }
              
              // Get punches for this card
              const punches = await getCardPunches(card.id || 0);
              const currentPunches = punches.length;
              
              return {
                id: business.id,
                businessName: business.name,
                image: getBusinessImage(business),
                currentPunches,
                maxPunches: card.max_punches,
                lastVisit: formatTimeAgo(card.created_at),
                cardId: card.id
              };
            } catch (error) {
              console.error('CustomerDashboard: Error processing card:', error);
              return null;
            }
          })
        );
        
        // Filter out null results and sort by most recent
        const validFrequentlyUsed = frequentlyUsedData
          .filter(item => item !== null)
          .slice(0, 5); // Limit to 5 for display
        
        console.log('CustomerDashboard: Frequently used prepared:', validFrequentlyUsed.length);
        setFrequentlyUsed(validFrequentlyUsed);
        
      } catch (error) {
        console.error('CustomerDashboard: Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Filter businesses based on search query
  const filteredNearbyBusinesses = nearbyBusinesses.filter(business => 
    business.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    business.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFrequentlyUsed = frequentlyUsed.filter(business => 
    business.businessName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                {(user?.displayName || user?.email || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm text-gray-500">Hello</p>
                <p className="font-semibold text-gray-900">{user?.displayName || user?.email || 'Customer'}</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="ghost" size="sm">
              Sign Out
            </Button>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Input
              type="text"
              placeholder="Search businesses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Loading Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                {(user?.displayName || user?.email || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm text-gray-500">Hello</p>
                <p className="font-semibold text-gray-900">{user?.displayName || user?.email || 'Customer'}</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="ghost" size="sm">
              Sign Out
            </Button>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Input
              type="text"
              placeholder="Search businesses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Error Content */}
        <div className="flex-1 flex items-center justify-center p-4">
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
            <Button onClick={() => window.location.reload()} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            {/* Profile Avatar */}
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
              {(user?.displayName || user?.email || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm text-gray-500">Hello</p>
              <p className="font-semibold text-gray-900">{user?.displayName || user?.email || 'Customer'}</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="ghost" size="sm">
            Sign Out
          </Button>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Input
            type="text"
            placeholder="Search businesses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Content - Split Screen */}
      <div className="flex-1 overflow-y-auto">
        {/* Top Half: Nearby Cards */}
        <div className="px-4 py-4">
          <h2 className="text-lg font-semibold mb-3">
            {searchQuery ? `Search Results (${filteredNearbyBusinesses.length + filteredFrequentlyUsed.length})` : 'Nearby Cards'}
          </h2>
          
          {filteredNearbyBusinesses.length === 0 && searchQuery ? (
            <div className="text-center py-8 text-gray-500">
              <p>No nearby businesses found for "{searchQuery}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredNearbyBusinesses.map((business) => (
                <Card 
                  key={business.id} 
                  className="cursor-pointer hover:shadow-md transition-all duration-200"
                  onClick={() => navigate(`/customers/cards/${business.id}`)}
                >
                  <CardContent className="p-0">
                    {/* Business Image */}
                    <div className="w-full h-24 bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center rounded-t-lg">
                      <span className="text-2xl">{business.image}</span>
                    </div>
                    
                    {/* Business Info */}
                    <div className="p-3">
                      <h3 className="font-medium text-sm truncate">{business.businessName}</h3>
                      <p className="text-xs text-gray-500 mt-1">{business.distance} • {business.category}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Divider - only show if both sections have content */}
        {(!searchQuery || (filteredNearbyBusinesses.length > 0 && filteredFrequentlyUsed.length > 0)) && (
          <div className="border-t border-gray-200 mx-4"></div>
        )}

        {/* Bottom Half: Frequently Used Cards */}
        {(!searchQuery || filteredFrequentlyUsed.length > 0) && (
          <div className="px-4 py-4">
            <h2 className="text-lg font-semibold mb-3">
              {searchQuery ? 'Your Cards' : 'Frequently Used Cards'}
            </h2>
            
            {filteredFrequentlyUsed.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchQuery ? (
                  <p>No punch cards found for "{searchQuery}"</p>
                ) : (
                  <p>You don't have any punch cards yet. Visit a business to get started!</p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {filteredFrequentlyUsed.map((business) => (
                  <Card 
                    key={business.id} 
                    className="cursor-pointer hover:shadow-md transition-all duration-200"
                    onClick={() => navigate(`/customers/cards/${business.cardId}`)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        {/* Business Image */}
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-xl">{business.image}</span>
                        </div>
                        
                        {/* Business Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{business.businessName}</h3>
                          <p className="text-sm text-gray-500">Last visit: {business.lastVisit}</p>
                          
                          {/* Progress */}
                          <div className="flex items-center space-x-2 mt-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(business.currentPunches / business.maxPunches) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {business.currentPunches}/{business.maxPunches}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          <Button variant="ghost" className="flex-col h-auto py-2 text-primary">
            <div className="w-6 h-6 mb-1">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </div>
            <span className="text-xs">Home</span>
          </Button>
          
          <Button variant="ghost" className="flex-col h-auto py-2 text-gray-500">
            <div className="w-6 h-6 mb-1">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <span className="text-xs">Search</span>
          </Button>
          
          <Button variant="ghost" className="flex-col h-auto py-2 text-gray-500">
            <div className="w-6 h-6 mb-1">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <span className="text-xs">Cards</span>
          </Button>
          
          <Button variant="ghost" className="flex-col h-auto py-2 text-gray-500">
            <div className="w-6 h-6 mb-1">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs">History</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

// Business Dashboard  
const BusinessDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  console.log('BusinessDashboard render:', {
    email: user?.email,
    role: user?.role,
    displayName: user?.displayName
  });

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="w-full max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">🏢 Business Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Welcome back, {user?.displayName || user?.email}!
            </p>
            <p className="text-sm text-green-600 font-medium">
              ✅ Role: Business Owner
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm">
            Sign Out
          </Button>
        </div>

        {/* Business Tools */}
        <div className="grid gap-4">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Punch Card Management</h2>
              <p className="text-muted-foreground mb-4">
                Validate customer punch codes and manage your punch card system.
              </p>
              <Button onClick={() => navigate('/business/punch-station')} className="w-full">
                🎯 Open Punch Station
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Business Settings</h2>
              <p className="text-muted-foreground mb-4">
                Manage your business profile, punch card settings, and rewards.
              </p>
              <Button variant="outline" className="w-full">
                ⚙️ Business Settings
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
            <Route path="/customers/cards/:cardId" element={<PunchCardView />} />
            <Route path="/business" element={<BusinessDashboard />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
