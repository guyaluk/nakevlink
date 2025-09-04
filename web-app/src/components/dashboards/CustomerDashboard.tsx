import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getCategoryById } from '../../constants/categories';
import BottomNavigation from '../customer/BottomNavigation';

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
  const [stats, setStats] = useState({
    activeCards: 0,
    totalPunches: 0,
    rewardsEarned: 0
  });

  // Fetch user's active punch cards
  useEffect(() => {
    const fetchPunchCards = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);
        console.log('CustomerDashboard: Fetching punch cards for user:', user.uid);

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

        // Get punch counts for each active card
        const cardsWithPunches = await Promise.all(
          activeCards.map(async (card) => {
            try {
              const punchesResult = await getPunchesForCard({ cardId: card.id });
              const currentPunches = punchesResult?.data?.punches?.length || 0;
              
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
      }
    };

    fetchPunchCards();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
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

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">NakevLink</h1>
              <span className="ml-3 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                Customer
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Welcome back, {user?.displayName || user?.email}!
              </h2>
              <p className="text-sm text-gray-600">
                Collect punch cards from your favorite businesses and earn rewards.
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">🎫</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Active Punch Cards
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.activeCards}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">🏆</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Rewards Earned
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.rewardsEarned}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">⭐</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Punches
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.totalPunches}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Punch Cards Section */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Your Punch Cards
              </h3>

              {loading ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading your punch cards...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">⚠️</div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    Something went wrong
                  </h4>
                  <p className="text-sm text-gray-600 mb-6">
                    {error}
                  </p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Try Again
                  </button>
                </div>
              ) : punchCards.length === 0 ? (
                // Empty state
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">🎫</div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    No punch cards yet
                  </h4>
                  <p className="text-sm text-gray-600 mb-6">
                    Start collecting punch cards from your favorite businesses to earn rewards!
                  </p>
                  <button 
                    onClick={handleDiscoveryClick}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Find Businesses
                  </button>
                </div>
              ) : (
                // Active punch cards display
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {punchCards.map((card) => {
                    const category = getCategoryById(card.business.categoryId);
                    const progress = Math.min((card.currentPunches / card.maxPunches) * 100, 100);
                    const isComplete = card.currentPunches >= card.maxPunches;
                    const punchesNeeded = Math.max(0, card.maxPunches - card.currentPunches);
                    
                    return (
                      <div
                        key={card.id}
                        onClick={() => handleCardClick(card.id)}
                        className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow bg-white"
                      >
                        {/* Business Image/Icon */}
                        <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                          {card.business.image && card.business.image.startsWith('data:image/') ? (
                            <img 
                              src={card.business.image}
                              alt={card.business.name}
                              className="w-full h-full object-contain bg-white"
                              loading="lazy"
                            />
                          ) : (
                            <span className="text-4xl">{category?.emoji || '🏢'}</span>
                          )}
                        </div>

                        {/* Business Name */}
                        <h4 className="font-semibold text-gray-900 mb-2 truncate">
                          {card.business.name}
                        </h4>

                        {/* Progress */}
                        <div className="mb-3">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>{card.currentPunches} / {card.maxPunches} punches</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                isComplete ? 'bg-green-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Status */}
                        <div className="text-sm">
                          {isComplete ? (
                            <span className="text-green-600 font-medium">🎉 Ready to redeem!</span>
                          ) : (
                            <span className="text-gray-600">
                              {punchesNeeded} punch{punchesNeeded !== 1 ? 'es' : ''} to go
                            </span>
                          )}
                        </div>

                        {/* Expiry Date */}
                        <div className="text-xs text-gray-500 mt-2">
                          Expires: {new Date(card.expiresAt).toLocaleDateString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default CustomerDashboard;