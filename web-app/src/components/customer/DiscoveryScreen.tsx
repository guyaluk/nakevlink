import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CATEGORIES, getCategoryById } from '@/constants/categories';
import { ArrowLeft, Search, MapPin } from 'lucide-react';
import CustomerLayout from '../layouts/CustomerLayout';
import { getPersonalizedRecommendations, type RecommendationResult } from '@/services/recommendationService';

interface Business {
  id: string;
  name: string;
  description?: string;
  categoryId: number;
  image?: string;
  address?: string;
  punchNum?: number;
}

const DiscoveryScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);

  // Fetch all businesses on component mount
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { getAllBusinesses } = await import('@/lib/dataconnect');
        const result = await getAllBusinesses();
        
        if (result && result.data?.businesses) {
          setBusinesses(result.data.businesses);
          setFilteredBusinesses(result.data.businesses);
        } else {
          // Mock data for development if no businesses found
          const mockBusinesses: Business[] = [
            {
              id: '1',
              name: 'The Coffee Corner',
              description: 'Best coffee in town with artisanal blends',
              categoryId: 2,
              address: '123 Main St',
              punchNum: 10
            },
            {
              id: '2', 
              name: 'FitZone Gym',
              description: 'Complete fitness center with personal training',
              categoryId: 1,
              address: '456 Fitness Ave',
              punchNum: 8
            },
            {
              id: '3',
              name: 'Sweet Treats Ice Cream',
              description: 'Homemade ice cream and gelato',
              categoryId: 4,
              address: '789 Dessert Blvd',
              punchNum: 12
            },
            {
              id: '4',
              name: 'Bella Beauty Salon',
              description: 'Full service beauty and cosmetics',
              categoryId: 3,
              address: '321 Beauty Lane',
              punchNum: 6
            }
          ];
          setBusinesses(mockBusinesses);
          setFilteredBusinesses(mockBusinesses);
        }
      } catch (error) {
        console.error('Error fetching businesses:', error);
        setError('Failed to load businesses. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  // Fetch personalized recommendations
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user) return;
      
      try {
        setLoadingRecommendations(true);
        const recs = await getPersonalizedRecommendations(
          user.uid,
          undefined, // No location for now
          { maxResults: 8 } // Limit to 8 recommendations
        );
        setRecommendations(recs);
      } catch (error) {
        console.error('Failed to load recommendations:', error);
        // Gracefully fail - don't show error to user for recommendations
      } finally {
        setLoadingRecommendations(false);
      }
    };
    
    fetchRecommendations();
  }, [user]);

  // Filter businesses based on search query and selected category
  useEffect(() => {
    let filtered = [...businesses];

    // Filter by category
    if (selectedCategory !== null) {
      filtered = filtered.filter(business => business.categoryId === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(business =>
        business.name.toLowerCase().includes(query) ||
        business.description?.toLowerCase().includes(query) ||
        getCategoryById(business.categoryId)?.name.toLowerCase().includes(query)
      );
    }

    setFilteredBusinesses(filtered);
  }, [businesses, searchQuery, selectedCategory]);

  const handleCategorySelect = (categoryId: number) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null); // Deselect if already selected
    } else {
      setSelectedCategory(categoryId);
    }
  };

  const handleBusinessClick = (business: Business) => {
    // Navigate to business details screen
    navigate(`/customers/business/${business.id}`);
  };

  const getBusinessImage = (business: Business) => {
    if (business.image) {
      return business.image;
    }
    // Use category emoji as fallback
    const category = getCategoryById(business.categoryId);
    return category?.emoji || '🏢';
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <CustomerLayout 
      showHeader={true} 
      title="Discover"
      headerActions={
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/customers')}
          className="p-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      }
    >
      <div className="bg-white border-b border-gray-200 -mx-4 px-4 py-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            Welcome back, {user?.displayName?.split(' ')[0] || user?.email?.split('@')[0]}!
          </p>
          <Button onClick={handleLogout} variant="outline" size="sm">
            Sign Out
          </Button>
        </div>

        {/* Search Field */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search businesses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Categories</h2>
        <div className="grid grid-cols-4 gap-4">
          {CATEGORIES.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className={`h-20 flex flex-col items-center justify-center space-y-1 rounded-xl ${
                selectedCategory === category.id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-white hover:bg-gray-50'
              }`}
              onClick={() => handleCategorySelect(category.id)}
            >
              <span className="text-2xl">{category.emoji}</span>
              <span className="text-xs font-medium text-center leading-tight">
                {category.name}
              </span>
            </Button>
          ))}
        </div>
      </div>

      {/* Recommended for You Section */}
      {!selectedCategory && !searchQuery && recommendations.length > 0 && (
        <div className="mx-4 mb-4 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <span className="mr-2">✨</span>
              Recommended for You
            </h2>
            <span className="text-sm text-muted-foreground">
              Based on your preferences
            </span>
          </div>
          
          {loadingRecommendations ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="ml-3 text-sm text-muted-foreground">Loading recommendations...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recommendations.slice(0, 6).map((rec) => {
                const category = getCategoryById(rec.business.categoryId);
                return (
                  <Card 
                    key={rec.business.id}
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 border-primary/20 bg-white/95"
                    onClick={() => handleBusinessClick(rec.business)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        {/* Business Image/Logo */}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
                          {rec.business.image?.startsWith('data:') ? (
                            <img 
                              src={rec.business.image} 
                              alt={rec.business.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-2xl">{category?.emoji || '🏢'}</span>
                          )}
                        </div>
                        
                        {/* Business Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-foreground truncate">
                              {rec.business.name}
                            </h3>
                            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                              {Math.round(rec.score * 100)}% match
                            </span>
                          </div>
                          {rec.business.description && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {rec.business.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">
                              {category?.name} • {rec.business.punchNum || 10} punches
                            </span>
                            {rec.business.address && (
                              <div className="flex items-center text-xs text-muted-foreground">
                                <MapPin className="w-3 h-3 mr-1" />
                                <span className="truncate max-w-20">
                                  {rec.business.address.split(',')[0]}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Businesses Section */}
      <div className="flex-1 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {selectedCategory 
              ? `${getCategoryById(selectedCategory)?.name} Businesses`
              : searchQuery 
                ? `Search Results (${filteredBusinesses.length})`
                : 'Nearby Businesses'
            }
          </h2>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-1" />
            <span>Near you</span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">Loading businesses...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 mb-2">⚠️</div>
            <p className="text-muted-foreground">{error}</p>
          </div>
        ) : filteredBusinesses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium mb-2">No businesses found</h3>
            <p className="text-muted-foreground mb-4">
              {selectedCategory || searchQuery 
                ? 'Try adjusting your search or category filter'
                : 'No businesses are available in your area yet'
              }
            </p>
            {(selectedCategory || searchQuery) && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery('');
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredBusinesses.map((business) => {
              const category = getCategoryById(business.categoryId);
              return (
                <Card 
                  key={business.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleBusinessClick(business)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      {/* Business Image/Logo */}
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        {typeof getBusinessImage(business) === 'string' && getBusinessImage(business).startsWith('data:') ? (
                          <img 
                            src={getBusinessImage(business)} 
                            alt={business.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl">{getBusinessImage(business)}</span>
                        )}
                      </div>
                      
                      {/* Business Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">
                          {business.name}
                        </h3>
                        {business.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {business.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            {category?.name} • {business.punchNum || 10} punches
                          </span>
                          {business.address && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3 mr-1" />
                              <span className="truncate max-w-20">
                                {business.address.split(',')[0]}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

export default DiscoveryScreen;