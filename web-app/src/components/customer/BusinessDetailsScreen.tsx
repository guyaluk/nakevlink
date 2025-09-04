import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getCategoryById } from '@/constants/categories';
import { ArrowLeft, MapPin, ExternalLink } from 'lucide-react';
import BottomNavigation from './BottomNavigation';

interface Business {
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
}

interface PunchCard {
  id: string;
  businessId: string;
  userId: string;
  maxPunches: number;
  createdAt?: string | null;
  expiresAt: string;
  business: {
    id: string;
    name: string;
    categoryId: number;
    image?: string | null;
    description?: string | null;
    address?: string | null;
    phoneNumber?: string | null;
    punchNum?: number | null;
  };
}

const BusinessDetailsScreen: React.FC = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [business, setBusiness] = useState<Business | null>(null);
  const [existingCard, setExistingCard] = useState<PunchCard | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [distance, setDistance] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creatingCard, setCreatingCard] = useState(false);

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Get user's current location
  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lng: longitude });
            
            // Mock business coordinates for distance calculation
            // In a real app, these would come from the business data
            const mockBusinessLat = latitude + (Math.random() - 0.5) * 0.01; // Nearby mock location
            const mockBusinessLng = longitude + (Math.random() - 0.5) * 0.01;
            
            const dist = calculateDistance(latitude, longitude, mockBusinessLat, mockBusinessLng);
            setDistance(dist < 1 ? `${Math.round(dist * 1000)}m` : `${dist.toFixed(1)}km`);
          },
          (error) => {
            console.log('Location access denied:', error);
            setDistance('Location unavailable');
          }
        );
      } else {
        setDistance('Location not supported');
      }
    };

    getUserLocation();
  }, []);

  // Fetch business data and check for existing punch card
  useEffect(() => {
    const fetchBusinessData = async () => {
      if (!businessId || !user) return;

      try {
        setLoading(true);
        setError(null);

        const { getBusiness } = await import('@/lib/dataconnect');

        // Get business details
        const businessResult = await getBusiness({ id: businessId });
        if (businessResult?.data?.business) {
          setBusiness(businessResult.data.business);
        } else {
          setError('Business not found');
          return;
        }

        // Check if user already has an active punch card for this business
        console.log('Checking for existing active punch card:', {
          userId: user.uid,
          businessId: businessId
        });
        
        const { getActiveUserPunchCardForBusiness } = await import('@/lib/dataconnect');
        
        const cardResult = await getActiveUserPunchCardForBusiness({ 
          userId: user.uid, 
          businessId: businessId,
          now: new Date().toISOString()
        });
        
        console.log('Active punch card query result:', cardResult);
        
        if (cardResult?.data?.punchCards && cardResult.data.punchCards.length > 0) {
          console.log('Found existing active punch card:', cardResult.data.punchCards);
          setExistingCard(cardResult.data.punchCards[0]);
        } else {
          console.log('No existing active punch cards found');
        }

      } catch (error) {
        console.error('Error fetching business data:', error);
        setError('Failed to load business details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, [businessId, user]);

  const handleCreatePunchCard = async () => {
    if (!business || !user || existingCard) return;

    try {
      setCreatingCard(true);
      console.log('Creating punch card for:', {
        businessId: business.id,
        userId: user.uid,
        maxPunches: business.punchNum || 10,
        businessName: business.name
      });

      const { createPunchCard } = await import('@/lib/dataconnect');

      // Calculate expiration date
      const expirationDays = business.expirationDurationInDays || 30;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expirationDays);

      console.log('Calling createPunchCard with:', {
        businessId: business.id,
        userId: user.uid,
        maxPunches: business.punchNum || 10,
        expiresAt: expiresAt.toISOString()
      });

      // Create punch card (ID will be auto-generated as UUID)
      const result = await createPunchCard({
        businessId: business.id,
        userId: user.uid,
        maxPunches: business.punchNum || 10,
        expiresAt: expiresAt.toISOString()
      });

      console.log('CreatePunchCard result:', result);

      if (result?.data?.punchCard_insert) {
        console.log('Success! Navigating to card:', result.data.punchCard_insert.id);
        // Navigate to the punch card view
        navigate(`/customers/cards/${result.data.punchCard_insert.id}`);
      } else {
        console.error('CreatePunchCard failed - no result data:', result);
        setError('Failed to create punch card. No data returned.');
      }
    } catch (error) {
      console.error('Error creating punch card:', error);
      setError(`Failed to create punch card. Please try again. Error: ${error}`);
    } finally {
      setCreatingCard(false);
    }
  };

  const handleViewCard = () => {
    if (existingCard) {
      navigate(`/customers/cards/${existingCard.id}`);
    }
  };

  const handleOpenMaps = () => {
    if (business?.address) {
      const encodedAddress = encodeURIComponent(business.address);
      window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank');
    }
  };

  const getBusinessImage = () => {
    if (business?.image && business.image.startsWith('data:image/')) {
      return business.image;
    }
    return null;
  };

  const category = business ? getCategoryById(business.categoryId) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col pb-20">
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/customers/discovery')}
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-bold">Business Details</h1>
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground">Loading business details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-background flex flex-col pb-20">
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/customers/discovery')}
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-bold">Business Details</h1>
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center space-y-4 max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Something went wrong</h3>
              <p className="text-gray-600 mt-2">{error || 'Business not found'}</p>
            </div>
            <Button onClick={() => navigate('/customers/discovery')} className="mt-4">
              Back to Discovery
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const businessImage = getBusinessImage();

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/customers/discovery')}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-bold">Business Details</h1>
        </div>
      </div>


      {/* Main Content */}
      <div className="flex-1 p-4 space-y-6">
        {/* Business Image Card */}
        <Card>
          <CardContent className="p-4">
            <div className="w-full h-48 bg-gradient-to-r from-primary/20 to-primary/30 rounded-lg overflow-hidden flex items-center justify-center">
              {businessImage ? (
                <img 
                  src={businessImage}
                  alt={business.name}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <span className="text-6xl">{category?.emoji || '🏢'}</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Business Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-3">{business.name}</h1>
          {category && (
            <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-medium">
              <span>{category.emoji}</span>
              <span>{category.name}</span>
            </span>
          )}
        </div>

        {/* Business Description */}
        {business.description && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-3">About the business</h2>
              <p className="text-muted-foreground leading-relaxed">
                {business.description}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Location Section */}
        {business.address && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-3">Location</h2>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-foreground">{business.address}</p>
                    {distance && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {distance} away
                      </p>
                    )}
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleOpenMaps}
                  className="w-full"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in Maps
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Punch Card Info */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-3">Punch Card Program</h2>
            <div className="space-y-2 mb-4">
              <p className="text-muted-foreground">
                Collect <span className="font-semibold text-foreground">{business.punchNum || 10} punches</span> to earn a reward
              </p>
              <p className="text-sm text-muted-foreground">
                Cards expire after {business.expirationDurationInDays || 30} days
              </p>
            </div>

            {/* Primary Action Button */}
            {existingCard ? (
              <Button 
                onClick={handleViewCard}
                className="w-full"
                size="lg"
              >
                View Card
              </Button>
            ) : (
              <Button 
                onClick={handleCreatePunchCard}
                disabled={creatingCard}
                className="w-full"
                size="lg"
              >
                {creatingCard ? 'Creating Card...' : 'Punch me in'}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default BusinessDetailsScreen;