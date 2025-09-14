import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getCategoryById } from '../../constants/categories';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CustomerLayout from '../layouts/CustomerLayout';
import TestDataCreator from '../test/TestDataCreator';
import FirebaseConnectionTest from '../test/FirebaseConnectionTest';

interface PunchCard {
  id: string;
  businessId: string;
  userId: string;
  maxPunches: number;
  createdAt?: string | null;
  expiresAt: string;
  currentPunches: number;
  business: {
    id: string;
    name: string;
    categoryId: number;
    image?: string | null;
    description?: string | null;
    address?: string | null;
  };
}

const CustomerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [punchCards, setPunchCards] = useState<PunchCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    activeCards: 0,
    totalPunches: 0,
    rewardsEarned: 0
  });

  // Fetch user's active punch cards
  const fetchPunchCards = async (isRefresh = false) => {
    if (!user) return;

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      console.log(`CustomerDashboard: ${isRefresh ? 'Refreshing' : 'Fetching'} punch cards for user:`, user.uid);

      const { getUserPunchCards, getPunchesForCard } = await import('../../lib/dataconnect');
      
      // Get all punch cards for the user
      const cardsResult = await getUserPunchCards({ userId: user.uid });
      console.log('CustomerDashboard: Raw cards result:', cardsResult);

      if (!cardsResult?.data?.punchCards) {
        console.log('CustomerDashboard: No punch cards found');
        setPunchCards([]);
        return;
      }

      const allCards = cardsResult.data.punchCards;
      console.log('CustomerDashboard: Found cards:', allCards);

      // Filter active cards (non-expired)
      const now = new Date();
      const activeCards = allCards.filter(card => new Date(card.expiresAt) > now);
      console.log('CustomerDashboard: Active cards after filtering:', activeCards);

      // Get punch counts for each active card from both Data Connect and Firestore
      const cardsWithPunches = await Promise.all(
        activeCards.map(async (card) => {
          try {
            // Get punch count from Data Connect
            const punchesResult = await getPunchesForCard({ cardId: card.id });
            const dataConnectPunches = punchesResult?.data?.punches?.length || 0;
            
            // Also get punch count from Firestore (where Cloud Functions write punches)
            const { db } = await import('../../config/firebase');
            const { collection, query, where, getDocs } = await import('firebase/firestore');
            
            const firestorePunchesQuery = query(
              collection(db, 'punches'),
              where('cardId', '==', card.id)
            );
            const firestorePunchesSnapshot = await getDocs(firestorePunchesQuery);
            const firestorePunches = firestorePunchesSnapshot.size;
            
            // Use the higher count (handles both data sources)
            const currentPunches = Math.max(dataConnectPunches, firestorePunches);
            
            console.log(`CustomerDashboard: Card ${card.id} - Data Connect: ${dataConnectPunches}, Firestore: ${firestorePunches}, Using: ${currentPunches}`);
            
            return {
              ...card,
              currentPunches
            };
          } catch (error) {
            console.error(`Error fetching punches for card ${card.id}:`, error);
            return {
              ...card,
              currentPunches: 0
            };
          }
        })
      );

      console.log('CustomerDashboard: Cards with punch counts:', cardsWithPunches);

      setPunchCards(cardsWithPunches);

      // Calculate stats
      const totalPunches = cardsWithPunches.reduce((sum, card) => sum + card.currentPunches, 0);
      const rewardsEarned = cardsWithPunches.filter(card => card.currentPunches >= card.maxPunches).length;

      setStats({
        activeCards: cardsWithPunches.length,
        totalPunches,
        rewardsEarned
      });

      } catch (error) {
        console.error('CustomerDashboard: Error fetching punch cards:', error);
        setError('Failed to load your punch cards. Please try again.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

  useEffect(() => {
    fetchPunchCards();
  }, [user]);

  // Page visibility - refresh when user comes back to the page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && !loading && !refreshing && punchCards.length > 0) {
        console.log('CustomerDashboard: Page became visible, refreshing...');
        fetchPunchCards(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [loading, refreshing, punchCards.length]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const handleCardClick = (cardId: string) => {
    navigate(`/customers/cards/${cardId}`);
  };

  const handleDiscoveryClick = () => {
    navigate('/customers/discovery');
  };

  const handleRefresh = () => {
    fetchPunchCards(true);
  };

  return (
    <CustomerLayout 
      showHeader={true} 
      title="NakevLink"
      headerActions={
        <>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Customer
          </span>
          <button
            onClick={handleRefresh}
            disabled={loading || refreshing}
            className="inline-flex items-center px-4 py-2 border border-gray-200 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${(loading || refreshing) ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <Button onClick={handleLogout} variant="outline" size="sm" className="shadow-sm">
            Sign Out
          </Button>
        </>
      }
    >
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content Area - 2/3 width */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Hero Section */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg overflow-hidden">
                <div className="px-8 py-12">
                  <h1 className="text-3xl font-bold text-white mb-4 break-words">
                    Welcome back, {user?.displayName || 'Customer'}!
                  </h1>
                  <p className="text-xl text-blue-100 mb-6 break-words">
                    Collect punch cards from your favorite businesses and earn amazing rewards.
                  </p>
                  <button 
                    onClick={handleDiscoveryClick}
                    className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    🔍 Find New Businesses
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-w-0">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-lg">🎫</span>
                      </div>
                    </div>
                    <div className="ml-4 flex-1 min-w-0 overflow-hidden">
                      <p className="text-sm font-medium text-gray-600 mb-1 truncate">Active Cards</p>
                      <p className="text-2xl font-bold text-gray-900 truncate">{stats.activeCards}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-w-0">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-lg">🏆</span>
                      </div>
                    </div>
                    <div className="ml-4 flex-1 min-w-0 overflow-hidden">
                      <p className="text-sm font-medium text-gray-600 mb-1 truncate">Rewards Earned</p>
                      <p className="text-2xl font-bold text-gray-900 truncate">{stats.rewardsEarned}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-w-0">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-lg">⭐</span>
                      </div>
                    </div>
                    <div className="ml-4 flex-1 min-w-0 overflow-hidden">
                      <p className="text-sm font-medium text-gray-600 mb-1 truncate">Total Punches</p>
                      <p className="text-2xl font-bold text-gray-900 truncate">{stats.totalPunches}</p>
                    </div>
                  </div>
                </div>
              </div>

          {/* Punch Cards Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-8 py-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Your Punch Cards</h2>
                <button 
                  onClick={() => navigate('/customers/history')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View History →
                </button>
              </div>
            </div>

            <div className="p-8">
              {loading ? (
                <div className="text-center py-16">
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
                  <p className="text-lg text-gray-600">Loading your punch cards...</p>
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">⚠️</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : punchCards.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">🎫</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No punch cards yet</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Start collecting punch cards from your favorite businesses to earn rewards!
                  </p>
                  
                  {/* Firebase Connection Test */}
                  <div className="mb-8">
                    <FirebaseConnectionTest />
                  </div>
                  
                  {/* Test Data Creator */}
                  <div className="mb-8">
                    <TestDataCreator />
                  </div>
                  
                  <button 
                    onClick={handleDiscoveryClick}
                    className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    🔍 Find Businesses
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {punchCards.map((card) => {
                    const category = getCategoryById(card.business.categoryId);
                    const progress = Math.min((card.currentPunches / card.maxPunches) * 100, 100);
                    const isComplete = card.currentPunches >= card.maxPunches;
                    const punchesNeeded = Math.max(0, card.maxPunches - card.currentPunches);
                    
                    return (
                      <div
                        key={card.id}
                        onClick={() => handleCardClick(card.id)}
                        className="group bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
                      >
                        <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center relative overflow-hidden">
                          {card.business.image && card.business.image.startsWith('data:image/') ? (
                            <img 
                              src={card.business.image}
                              alt={card.business.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <span className="text-5xl group-hover:scale-110 transition-transform duration-200">
                              {category?.emoji || '🏢'}
                            </span>
                          )}
                          {isComplete && (
                            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                              Complete!
                            </div>
                          )}
                        </div>

                        <div className="p-6">
                          <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors truncate">
                            {card.business.name}
                          </h3>

                          <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-gray-600">
                                {card.currentPunches} / {card.maxPunches} punches
                              </span>
                              <span className="text-sm font-bold text-gray-900">
                                {Math.round(progress)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  isComplete 
                                    ? 'bg-gradient-to-r from-green-500 to-green-600' 
                                    : 'bg-gradient-to-r from-blue-500 to-blue-600'
                                }`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-sm">
                              {isComplete ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  🎉 Ready to redeem!
                                </span>
                              ) : (
                                <span className="text-gray-600 truncate">
                                  {punchesNeeded} more punch{punchesNeeded !== 1 ? 'es' : ''}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100 truncate">
                            Expires: {new Date(card.expiresAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

            {/* Sidebar - 1/3 width */}
            <div className="space-y-6">
              {/* Quick Stats Summary */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 truncate">Quick Summary</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 truncate">Active Cards</span>
                    <span className="text-xl font-bold text-blue-600">{stats.activeCards}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 truncate">Total Punches</span>
                    <span className="text-xl font-bold text-purple-600">{stats.totalPunches}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 truncate">Rewards Earned</span>
                    <span className="text-xl font-bold text-green-600">{stats.rewardsEarned}</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 truncate">Recent Activity</h3>
                <div className="space-y-3">
                  {punchCards.slice(0, 3).map((card) => {
                    const category = getCategoryById(card.business.categoryId);
                    const isComplete = card.currentPunches >= card.maxPunches;
                    return (
                      <div key={card.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <span className="text-xl">{category?.emoji || '🏢'}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{card.business.name}</p>
                          <p className="text-xs text-gray-500 truncate">
                            {card.currentPunches}/{card.maxPunches} punches
                            {isComplete && ' - Complete!'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  {punchCards.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default CustomerDashboard;