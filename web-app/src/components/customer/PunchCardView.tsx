import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/config/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Clock, CheckCircle, RefreshCw } from 'lucide-react';
import BottomNavigation from './BottomNavigation';
import { retryFirebaseOperation, RetryError } from '@/utils/retry';

interface GeneratedCode {
  code: string;
  expiresAt: number;
}

const PunchCardView: React.FC = () => {
  const { cardId } = useParams<{ cardId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [punchCardData, setPunchCardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  
  // Check for existing active punch code
  const checkForActivePunchCode = async () => {
    if (!cardId || !user) return null;

    try {
      const { db } = await import('@/config/firebase');
      const { collection, query, where, getDocs } = await import('firebase/firestore');
      
      const now = new Date();
      const activeCodesQuery = query(
        collection(db, 'punchCodes'),
        where('userId', '==', user.uid),
        where('cardId', '==', cardId),
        where('isUsed', '==', false),
        where('expiresAt', '>', now)
      );

      const activeCodesSnapshot = await getDocs(activeCodesQuery);
      
      if (!activeCodesSnapshot.empty) {
        const activeCodeDoc = activeCodesSnapshot.docs[0];
        const activeCodeData = activeCodeDoc.data();
        
        console.log('Found active punch code:', activeCodeData);
        
        return {
          code: activeCodeData.code,
          expiresAt: activeCodeData.expiresAt.toMillis ? activeCodeData.expiresAt.toMillis() : activeCodeData.expiresAt.getTime()
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error checking for active punch code:', error);
      return null;
    }
  };

  // Data fetching function with retry logic
  const fetchPunchCardData = async (isRetryAttempt = false) => {
    if (!cardId) return;
    
    try {
      if (isRetryAttempt) {
        setIsRetrying(true);
        setRetryAttempt(prev => prev + 1);
      } else {
        setLoading(true);
        setRetryAttempt(0);
      }
      setError('');
      
      console.log('PunchCardView: Fetching punch card data for ID:', cardId);
      
      // Wrap the data fetching in retry logic
      const result = await retryFirebaseOperation(async () => {
        const { getPunchCardById, getPunchesForCard } = await import('@/lib/dataconnect');
        
        const cardResult = await getPunchCardById({ id: cardId });
        
        if (!cardResult?.data?.punchCard) {
          throw new Error('Punch card not found.');
        }
        
        const card = cardResult.data.punchCard;
        console.log('PunchCardView: Found punch card:', card);
        
        // Get punch count from Data Connect
        const punchesResult = await getPunchesForCard({ cardId: cardId });
        const dataConnectPunches = punchesResult?.data?.punches?.length || 0;
        
        // Also get punch count from Firestore (where Cloud Functions write punches)
        const { db } = await import('@/config/firebase');
        const { collection, query, where, getDocs } = await import('firebase/firestore');
        
        const firestorePunchesQuery = query(
          collection(db, 'punches'),
          where('cardId', '==', cardId)
        );
        const firestorePunchesSnapshot = await getDocs(firestorePunchesQuery);
        const firestorePunches = firestorePunchesSnapshot.size;
        
        // Use the higher count (handles both data sources)
        const currentPunches = Math.max(dataConnectPunches, firestorePunches);
        
        console.log('PunchCardView: Found', dataConnectPunches, 'Data Connect punches and', firestorePunches, 'Firestore punches for card. Using:', currentPunches);
        
        return { card, currentPunches };
      }, {
        maxAttempts: 3,
        baseDelay: 1000,
        maxDelay: 5000
      });
      
      const { card, currentPunches } = result;
      
      // Format expiration date
      const expirationDate = new Date(card.expiresAt).toLocaleDateString();
      
      // Get category emoji for business image fallback
      const { getCategoryById } = await import('@/constants/categories');
      const category = getCategoryById(card.business.categoryId);
      
      const punchCard = {
        id: card.id,
        businessName: card.business.name,
        image: category?.emoji || '🏢',
        currentPunches: currentPunches,
        maxPunches: card.maxPunches,
        rewardName: `Free ${card.business.name} Reward`,
        expirationDate: expirationDate,
        address: card.business.address || 'No address provided',
        phone: card.business.phoneNumber || 'No phone provided',
        hours: 'Business hours not available',
        business: {
          id: card.business.id,
          name: card.business.name,
          image: card.business.image,
          categoryId: card.business.categoryId
        }
      };
      
      setPunchCardData(punchCard);
      console.log('PunchCardView: Loaded real punch card data:', punchCard);
      
      // Check for existing active punch code
      const activeCode = await checkForActivePunchCode();
      if (activeCode) {
        setGeneratedCode(activeCode);
        setTimeLeft(Math.max(0, activeCode.expiresAt - Date.now()));
        console.log('PunchCardView: Found existing active code:', activeCode.code);
      }
      
    } catch (error) {
      console.error('Error fetching punch card:', error);
      
      let errorMessage = 'Failed to load punch card data.';
      
      if (error instanceof RetryError) {
        errorMessage = `Failed to load punch card data after ${error.attemptsMade} attempts. `;
        
        if (error.lastError?.message?.includes('Bad Request')) {
          errorMessage += 'There may be a connection issue with the database.';
        } else if (error.lastError?.code?.includes('not-found')) {
          errorMessage = 'Punch card not found.';
        } else if (error.lastError?.code?.includes('permission-denied')) {
          errorMessage = "You don't have permission to view this punch card.";
        } else {
          errorMessage += 'Please check your internet connection and try again.';
        }
      } else if (error instanceof Error) {
        if (error.message.includes('Punch card not found')) {
          errorMessage = 'Punch card not found.';
        } else {
          errorMessage = error.message || errorMessage;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  };

  // Load data on mount only
  useEffect(() => {
    fetchPunchCardData();
  }, [cardId]);

  // Simple countdown timer
  useEffect(() => {
    if (!generatedCode) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, generatedCode.expiresAt - now);
      setTimeLeft(remaining);

      if (remaining === 0) {
        setGeneratedCode(null);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [generatedCode]);

  const handleGenerateCode = async () => {
    if (!cardId || !user) return;

    try {
      setGenerating(true);
      setError('');

      console.log('PunchCardView: Generating code for card:', cardId);

      const generatePunchCode = httpsCallable(functions, 'generatePunchCode');
      const result = await generatePunchCode({ cardId });
      
      console.log('PunchCardView: Generate code result:', result);

      if (result.data && typeof result.data === 'object') {
        const data = result.data as any;
        if (data.success) {
          setGeneratedCode({
            code: data.code,
            expiresAt: data.expires_at
          });
          setTimeLeft(data.expires_at - Date.now());
          console.log('PunchCardView: Code generated successfully:', data.code);
        } else {
          throw new Error(data.message || 'Failed to generate code');
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err: any) {
      console.error('Error generating code:', err);
      
      if (err.code === 'functions/failed-precondition') {
        setError('A code is already active for this card. Please wait for it to expire.');
      } else if (err.code === 'functions/not-found') {
        setError('Punch card not found or expired.');
      } else if (err.code === 'functions/permission-denied') {
        setError("You don't have permission to generate codes for this card.");
      } else if (err.code === 'functions/unauthenticated') {
        setError('Please sign in to generate codes.');
      } else {
        setError(err.message || 'Failed to generate code. Please try again.');
      }
    } finally {
      setGenerating(false);
    }
  };

  const formatTime = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCode = (code: string): string => {
    return code.split('').join(' ');
  };

  // Manual refresh function
  const handleRefresh = () => {
    fetchPunchCardData(false);
  };

  // Manual retry function
  const handleRetry = () => {
    fetchPunchCardData(true);
  };

  // Use real data or fallback
  const mockPunchCard = punchCardData || {
    businessName: 'Loading...',
    image: '⏳',
    currentPunches: 0,
    maxPunches: 10,
    rewardName: 'Loading...',
    expirationDate: 'Loading...',
    address: 'Loading...',
    phone: 'Loading...',
    hours: 'Loading...'
  };

  const currentPunches = mockPunchCard.currentPunches;
  const maxPunches = mockPunchCard.maxPunches;
  const isComplete = currentPunches >= maxPunches;
  const hasActiveCode = generatedCode && timeLeft > 0;
  const punchesNeededForReward = Math.max(0, maxPunches - 1 - currentPunches);

  // Create array of punch circles
  const punchCircles = [];
  for (let i = 0; i < maxPunches; i++) {
    const isFilled = i < currentPunches;
    const isReward = i === maxPunches - 1;
    
    punchCircles.push({
      index: i,
      isFilled,
      isReward
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 pb-20">
        <div className="w-full max-w-md mx-auto space-y-6">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/customers')}
              className="flex items-center space-x-2 p-2 hover:bg-primary/10"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </Button>
          </div>
          
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-muted-foreground">
                {isRetrying ? `Retrying... (Attempt ${retryAttempt})` : 'Loading your punch card...'}
              </p>
            </div>
          </div>
        </div>

        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="w-full max-w-md mx-auto space-y-6">
        {/* Header with Back Button and Refresh */}
        <div className="flex items-center justify-between space-x-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/customers')}
            className="flex items-center space-x-2 p-2 hover:bg-primary/10"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading || isRetrying}
            className="text-sm flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${(loading || isRetrying) ? 'animate-spin' : ''}`} />
            <span>
              {loading || isRetrying ? 'Loading...' : 'Refresh'}
            </span>
          </Button>
        </div>

        <Card className="w-full">
          <CardContent className="p-6 space-y-6">
            {/* Business Image */}
            <div className="w-full h-40 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg overflow-hidden">
              {punchCardData?.business?.image && punchCardData.business.image.startsWith('data:image/') ? (
                <img 
                  src={punchCardData.business.image}
                  alt={punchCardData.business.name}
                  className="w-full h-full object-contain bg-white"
                  loading="lazy"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.style.display = 'none';
                    const fallback = img.parentElement?.querySelector('.fallback-emoji') as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className={`w-full h-full flex items-center justify-center fallback-emoji ${punchCardData?.business?.image && punchCardData.business.image.startsWith('data:image/') ? 'hidden' : ''}`}>
                <span className="text-6xl">{mockPunchCard.image}</span>
              </div>
            </div>

            {/* Business Name */}
            <div className="text-center">
              <h1 className="text-2xl font-bold">{mockPunchCard.businessName}</h1>
            </div>

            {/* Progress Text */}
            <div className="text-center">
              {punchesNeededForReward > 0 ? (
                <p className="text-lg text-muted-foreground">
                  Missing <span className="font-bold text-primary">{punchesNeededForReward}</span> punches for{' '}
                  <span className="font-bold text-primary">Free {mockPunchCard.businessName} Reward</span>
                </p>
              ) : (
                <p className="text-lg text-green-600 font-bold">
                  Ready to claim your Free {mockPunchCard.businessName} Reward! 🎉
                </p>
              )}
            </div>

            {/* Visual Punch Display - Circles in Rows */}
            <div className="space-y-4">
              <div className="grid grid-cols-5 gap-3 justify-items-center">
                {punchCircles.map((circle) => (
                  <div
                    key={circle.index}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg transition-all duration-300 ${
                      circle.isReward 
                        ? 'border-yellow-400 bg-yellow-50' 
                        : circle.isFilled 
                          ? 'border-primary bg-primary text-primary-foreground' 
                          : 'border-muted bg-background'
                    }`}
                  >
                    {circle.isReward ? (
                      '🎁'
                    ) : circle.isFilled ? (
                      '✓'
                    ) : (
                      '○'
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Card Expiration */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Card expires: <span className="font-medium">{mockPunchCard.expirationDate}</span>
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md space-y-3">
                <p>{error}</p>
                {retryAttempt > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Tried {retryAttempt} time{retryAttempt > 1 ? 's' : ''}
                  </p>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetry}
                  disabled={isRetrying || loading}
                  className="text-xs flex items-center space-x-2"
                >
                  <RefreshCw className={`w-3 h-3 ${isRetrying ? 'animate-spin' : ''}`} />
                  <span>{isRetrying ? 'Retrying...' : 'Try Again'}</span>
                </Button>
              </div>
            )}

            {/* Generated Code Display */}
            {hasActiveCode && (
              <div className="bg-primary/10 border-2 border-primary/20 rounded-lg p-6 text-center space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Your Punch Code:</p>
                  <div className="text-2xl sm:text-3xl font-mono font-bold text-primary whitespace-nowrap overflow-x-auto">
                    <span className="inline-block tracking-[0.3em] px-2">
                      {formatCode(generatedCode.code)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-center space-x-2 text-orange-600">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">{formatTime(timeLeft)}</span>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Show this code to the business to get your punch
                </p>
              </div>
            )}

            {/* Big Generate Code Button */}
            {!isComplete && (
              <Button
                onClick={handleGenerateCode}
                disabled={generating || !!hasActiveCode}
                className="w-full py-4 text-lg font-semibold"
                size="lg"
              >
                {generating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                    Generating Code...
                  </>
                ) : hasActiveCode ? (
                  'Code Active - Show to Business'
                ) : (
                  'Generate Code for Next Purchase'
                )}
              </Button>
            )}

            {/* Complete Card Button */}
            {isComplete && (
              <Button
                className="w-full py-4 text-lg font-semibold bg-green-600 hover:bg-green-700"
                size="lg"
              >
                Claim Your Free {mockPunchCard.businessName} Reward 🎁
              </Button>
            )}

            {/* Business Contact Info */}
            <div className="border-t pt-4 space-y-2">
              <h3 className="font-medium text-sm">Business Information</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>📍 {mockPunchCard.address}</p>
                <p>📞 {mockPunchCard.phone}</p>
                <p>🕒 {mockPunchCard.hours}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default PunchCardView;