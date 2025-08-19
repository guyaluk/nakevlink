import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import RoleSelection from '@/components/auth/RoleSelection';
import SimpleCustomerSignup from '@/components/auth/SimpleCustomerSignup';
import SimpleBusinessSignup from '@/components/auth/SimpleBusinessSignup';
import PunchCardView from '@/components/customer/PunchCardView';
import ErrorBoundary from '@/components/ErrorBoundary';
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
      console.log('User authenticated, navigating based on role:', user.role);
      if (user.role === 'business_owner') {
        navigate('/business');
      } else {
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

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Mock punch cards with business data
  const mockPunchCards = [
    {
      id: 'coffee-corner',
      businessName: 'The Coffee Corner',
      image: '☕', // Using emoji as placeholder for business photo
      currentPunches: 3,
      maxPunches: 10,
      rewardName: 'Free Coffee',
      expirationDate: '12/07/24',
      address: '123 Main St, Downtown',
      phone: '(555) 123-4567',
      hours: 'Mon-Fri 7AM-6PM'
    },
    {
      id: 'pizza-palace',
      businessName: 'Pizza Palace',
      image: '🍕',
      currentPunches: 7,
      maxPunches: 8,
      rewardName: 'Free Pizza',
      expirationDate: '15/08/24',
      address: '456 Food Ave, City Center',
      phone: '(555) 987-6543',
      hours: 'Daily 11AM-11PM'
    },
    {
      id: 'fitness-zone',
      businessName: 'FitZone Gym',
      image: '💪',
      currentPunches: 5,
      maxPunches: 10,
      rewardName: 'Free Training Session',
      expirationDate: '20/09/24',
      address: '789 Health Blvd, Fitness District',
      phone: '(555) 456-7890',
      hours: 'Mon-Sun 5AM-11PM'
    }
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="w-full max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard - Welcome {user?.displayName || 'Customer'}</h1>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm">
            Sign Out
          </Button>
        </div>

        {/* Active Punch Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockPunchCards.map((card) => (
            <Card 
              key={card.id} 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              onClick={() => navigate(`/customers/cards/${card.id}`)}
            >
              <CardContent className="p-0">
                {/* Business Photo/Logo */}
                <div className="w-full h-40 bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center rounded-t-lg overflow-hidden">
                  {/* TODO: Replace with actual business image when database integration is complete */}
                  <span className="text-5xl">{card.image}</span>
                </div>
                
                {/* Business Name */}
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-lg">{card.businessName}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {card.currentPunches}/{card.maxPunches} punches
                  </p>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-secondary rounded-full h-2 mt-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(card.currentPunches / card.maxPunches) * 100}%` }}
                    ></div>
                  </div>
                  
                  {/* Almost Complete Badge */}
                  {card.currentPunches >= card.maxPunches - 2 && card.currentPunches < card.maxPunches && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                        Almost there! 🔥
                      </span>
                    </div>
                  )}
                  
                  {/* Complete Badge */}
                  {card.currentPunches >= card.maxPunches && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        Ready to redeem! 🎉
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {mockPunchCards.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-4xl mb-4">🏪</div>
              <h3 className="text-lg font-medium mb-2">No punch cards yet</h3>
              <p className="text-muted-foreground mb-4">Start collecting punches at your favorite businesses!</p>
              <Button>Find Businesses</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

// Business Dashboard  
const BusinessDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="w-full max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Business Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back, {user?.displayName || user?.email}!</p>
        </div>

        <Card>
          <CardContent className="p-6 text-center space-y-4">
            <p className="text-muted-foreground">Punch validation system is ready!</p>
            <Button onClick={() => navigate('/business/punch-station')} className="mr-4">
              Open Punch Station
            </Button>
            <Button onClick={handleLogout} variant="outline">
              Sign Out
            </Button>
          </CardContent>
        </Card>
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
