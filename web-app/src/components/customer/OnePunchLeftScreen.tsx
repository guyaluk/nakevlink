import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getCategoryById } from '@/constants/categories';
import CustomerLayout from '../layouts/CustomerLayout';

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

const OnePunchLeftScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [punchCards, setPunchCards] = useState<PunchCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's punch cards that are one punch away from completion
  useEffect(() => {
    const fetchOnePunchLeftCards = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);
        console.log('OnePunchLeftScreen: Fetching punch cards for user:', user.uid);

        const { getUserPunchCards, getPunchesForCard } = await import('@/lib/dataconnect');
        
        // Get all punch cards for the user
        const cardsResult = await getUserPunchCards({ userId: user.uid });
        console.log('OnePunchLeftScreen: Raw cards result:', cardsResult);

        if (!cardsResult?.data?.punchCards) {
          console.log('OnePunchLeftScreen: No punch cards found');
          setPunchCards([]);
          return;
        }

        const allCards = cardsResult.data.punchCards;
        console.log('OnePunchLeftScreen: Found cards:', allCards);

        // Filter active cards (non-expired)
        const now = new Date();
        const activeCards = allCards.filter(card => new Date(card.expiresAt) > now);
        console.log('OnePunchLeftScreen: Active cards after filtering:', activeCards);

        // Get punch counts for each active card from both Data Connect and Firestore
        const cardsWithPunches = await Promise.all(
          activeCards.map(async (card) => {
            try {
              // Get punch count from Data Connect
              const punchesResult = await getPunchesForCard({ cardId: card.id });
              const dataConnectPunches = punchesResult?.data?.punches?.length || 0;
              
              // Also get punch count from Firestore (where Cloud Functions write punches)
              const { db } = await import('@/config/firebase');
              const { collection, query, where, getDocs } = await import('firebase/firestore');
              
              const firestorePunchesQuery = query(
                collection(db, 'punches'),
                where('cardId', '==', card.id)
              );
              const firestorePunchesSnapshot = await getDocs(firestorePunchesQuery);
              const firestorePunches = firestorePunchesSnapshot.size;
              
              // Use the higher count (handles both data sources)
              const currentPunches = Math.max(dataConnectPunches, firestorePunches);
              
              console.log(`OnePunchLeftScreen: Card ${card.id} (${card.business.name}) - Data Connect: ${dataConnectPunches}, Firestore: ${firestorePunches}, Using: ${currentPunches}`);
              
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

        // Filter cards that are exactly one punch away from completion
        const onePunchLeftCards = cardsWithPunches.filter(card => {
          const punchesNeeded = card.maxPunches - card.currentPunches;
          return punchesNeeded === 1;
        });

        console.log('OnePunchLeftScreen: Cards with one punch left:', onePunchLeftCards);
        setPunchCards(onePunchLeftCards);

      } catch (error) {
        console.error('OnePunchLeftScreen: Error fetching punch cards:', error);
        setError('Failed to load your punch cards. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOnePunchLeftCards();
  }, [user]);

  const handleCardClick = (cardId: string) => {
    navigate(`/customers/cards/${cardId}`);
  };

  const handleDiscoveryClick = () => {
    navigate('/customers/discovery');
  };

  return (
    <CustomerLayout 
      showHeader={true} 
      title="One Punch Left"
      headerActions={
        <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
          Almost There!
        </span>
      }
    >
      <div className="py-6">
          {/* Info Section */}
          <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                You're Almost There! ⚡
              </h2>
              <p className="text-sm text-gray-600">
                These punch cards need just one more punch to earn your reward.
              </p>
            </div>
          </div>

          {/* Punch Cards Section */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                One Punch Left Cards
              </h3>

              {loading ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading your almost-complete cards...</p>
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
                  <div className="text-4xl mb-4">⚡</div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    No cards are one punch away yet
                  </h4>
                  <p className="text-sm text-gray-600 mb-6">
                    Keep collecting punches from your favorite businesses. When you're one punch away from a reward, they'll appear here!
                  </p>
                  <button 
                    onClick={handleDiscoveryClick}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Find More Businesses
                  </button>
                </div>
              ) : (
                // Cards that are one punch away from completion
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {punchCards.map((card) => {
                    const category = getCategoryById(card.business.categoryId);
                    const progress = Math.min((card.currentPunches / card.maxPunches) * 100, 100);
                    
                    return (
                      <div
                        key={card.id}
                        onClick={() => handleCardClick(card.id)}
                        className="border border-orange-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow bg-gradient-to-br from-orange-50 to-yellow-50 relative overflow-hidden"
                      >
                        {/* "Almost There" Badge */}
                        <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          Almost There!
                        </div>

                        {/* Business Image/Icon */}
                        <div className="w-full h-32 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
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
                          <div className="flex justify-between text-sm text-gray-700 mb-1">
                            <span>{card.currentPunches} / {card.maxPunches} punches</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Status */}
                        <div className="text-sm">
                          <span className="text-orange-600 font-medium flex items-center">
                            ⚡ Next punch is FREE reward!
                          </span>
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
    </CustomerLayout>
  );
};

export default OnePunchLeftScreen;