import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/config/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Clock, CheckCircle } from 'lucide-react';

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

  // Mock data based on cardId from dashboard
  const getMockPunchCard = (id: string) => {
    const cards = {
      'coffee-corner': {
        businessName: 'The Coffee Corner',
        image: '☕',
        currentPunches: 3,
        maxPunches: 10,
        rewardName: 'Free Coffee',
        expirationDate: '12/07/24',
        address: '123 Main St, Downtown',
        phone: '(555) 123-4567',
        hours: 'Mon-Fri 7AM-6PM'
      },
      'pizza-palace': {
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
      'fitness-zone': {
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
    };
    return cards[id as keyof typeof cards] || cards['coffee-corner'];
  };

  const mockPunchCard = getMockPunchCard(cardId || 'coffee-corner');

  // Countdown timer
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

      // For demo, we'll generate a mock code
      const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + (2 * 60 * 1000); // 2 minutes

      setGeneratedCode({
        code: mockCode,
        expiresAt: expiresAt
      });
      setTimeLeft(2 * 60 * 1000);

      // TODO: Uncomment when ready to test real Firebase Functions
      // const generatePunchCode = httpsCallable(functions, 'generatePunchCode');
      // const result = await generatePunchCode({ cardId });
      // if (result.data && typeof result.data === 'object') {
      //   const data = result.data as any;
      //   if (data.success) {
      //     setGeneratedCode({
      //       code: data.code,
      //       expiresAt: data.expires_at
      //     });
      //     setTimeLeft(data.expires_at - Date.now());
      //   }
      // }
    } catch (err: any) {
      console.error('Error generating code:', err);
      setError(err.message || 'Failed to generate code');
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

  const currentPunches = mockPunchCard.currentPunches;
  const maxPunches = mockPunchCard.maxPunches;
  const isComplete = currentPunches >= maxPunches;
  const hasActiveCode = generatedCode && timeLeft > 0;
  const punchesNeeded = maxPunches - currentPunches;

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

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="w-full max-w-md mx-auto space-y-6">
        {/* Header with Back Button */}
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

        <Card className="w-full">
          <CardContent className="p-6 space-y-6">
            {/* Business Image */}
            <div className="w-full h-40 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg flex items-center justify-center overflow-hidden">
              {/* TODO: Replace with actual business image when available */}
              <span className="text-6xl">{mockPunchCard.image}</span>
            </div>

            {/* Business Name */}
            <div className="text-center">
              <h1 className="text-2xl font-bold">{mockPunchCard.businessName}</h1>
            </div>

            {/* Progress Text */}
            <div className="text-center">
              {punchesNeeded > 0 ? (
                <p className="text-lg text-muted-foreground">
                  Missing <span className="font-bold text-primary">{punchesNeeded}</span> punches for{' '}
                  <span className="font-bold text-primary">{mockPunchCard.rewardName}</span>
                </p>
              ) : (
                <p className="text-lg text-green-600 font-bold">
                  Ready to claim your {mockPunchCard.rewardName}! 🎉
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
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                {error}
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
                disabled={generating || hasActiveCode}
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
                Claim Your {mockPunchCard.rewardName} 🎁
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
    </div>
  );
};

export default PunchCardView;