import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/config/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, X, User, Clock, Trophy, Zap } from 'lucide-react';

interface PunchResult {
  success: boolean;
  message: string;
  punches?: number;
  maxPunches?: number;
  isComplete?: boolean;
  customerName?: string;
}

interface RecentPunch {
  customerName: string;
  timestamp: Date;
  punches: number;
  maxPunches: number;
  isComplete: boolean;
}

const PunchStation: React.FC = () => {
  const { user } = useAuth();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PunchResult | null>(null);
  const [recentPunches, setRecentPunches] = useState<RecentPunch[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  // Clear result after delay
  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => {
        setResult(null);
        if (result.success) {
          setCode('');
        }
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [result]);

  // Success animation trigger
  useEffect(() => {
    if (result?.success) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [result]);

  const handleValidateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) return;
    
    // Clean the code (remove spaces and ensure 6 digits)
    const cleanCode = code.replace(/\s/g, '');
    if (cleanCode.length !== 6 || !/^\d{6}$/.test(cleanCode)) {
      setResult({
        success: false,
        message: 'Please enter a valid 6-digit code'
      });
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const validateAndPunch = httpsCallable(functions, 'validateAndPunch');
      const response = await validateAndPunch({ code: cleanCode });
      
      if (response.data && typeof response.data === 'object') {
        const data = response.data as any;
        
        const punchResult: PunchResult = {
          success: data.success || false,
          message: data.message || 'Unknown result',
          punches: data.punches,
          maxPunches: data.maxPunches,
          isComplete: data.isComplete,
          customerName: data.customerName || 'Customer'
        };

        setResult(punchResult);

        // Add to recent punches if successful
        if (punchResult.success) {
          const newPunch: RecentPunch = {
            customerName: punchResult.customerName || 'Customer',
            timestamp: new Date(),
            punches: punchResult.punches || 0,
            maxPunches: punchResult.maxPunches || 10,
            isComplete: punchResult.isComplete || false
          };
          
          setRecentPunches(prev => [newPunch, ...prev.slice(0, 9)]); // Keep last 10
        }
      }
    } catch (err: any) {
      console.error('Error validating code:', err);
      
      let errorMessage = 'Failed to validate code';
      
      // Handle Firebase Functions errors
      if (err.code) {
        switch (err.code) {
          case 'functions/not-found':
            errorMessage = 'Invalid or already used code';
            break;
          case 'functions/deadline-exceeded':
            errorMessage = 'Code has expired (2 minutes max)';
            break;
          case 'functions/permission-denied':
            errorMessage = 'This code is not for your business';
            break;
          case 'functions/failed-precondition':
            errorMessage = 'Punch card is already complete';
            break;
          case 'functions/unauthenticated':
            errorMessage = 'Please log in to validate codes';
            break;
          default:
            errorMessage = err.message || errorMessage;
        }
      }

      setResult({
        success: false,
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format as user types (add spaces every digit for readability)
    const value = e.target.value.replace(/\D/g, '').substring(0, 6);
    const formatted = value.split('').join(' ').trim();
    setCode(formatted);
  };

  const handleClear = () => {
    setCode('');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="w-full max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Punch Station</h1>
          <p className="text-muted-foreground">Enter customer punch codes to validate</p>
        </div>

        {/* Success Animation Overlay */}
        {showSuccess && (
          <div className="fixed inset-0 bg-green-500/20 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-white rounded-full p-8 shadow-lg animate-pulse">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
          </div>
        )}

        {/* Main Input Card */}
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Enter Punch Code</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleValidateCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="punchCode" className="sr-only">6-Digit Punch Code</Label>
                <Input
                  id="punchCode"
                  type="text"
                  placeholder="1 2 3 4 5 6"
                  value={code}
                  onChange={handleCodeChange}
                  className="text-center text-2xl font-mono tracking-wider py-4 h-16"
                  autoFocus
                  maxLength={11} // 6 digits + 5 spaces
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  type="submit"
                  disabled={loading || code.replace(/\s/g, '').length !== 6}
                  className="flex-1"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                      Validating...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Validate Punch
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClear}
                  disabled={loading}
                  size="lg"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </form>

            {/* Result Display */}
            {result && (
              <div className={`p-4 rounded-lg border-2 ${
                result.success 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  {result.success ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <X className="w-5 h-5 text-red-600" />
                  )}
                  <span className="font-medium">{result.message}</span>
                </div>
                
                {result.success && result.punches && result.maxPunches && (
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Progress:</span>
                      <span className="font-medium">
                        {result.punches}/{result.maxPunches}
                        {result.isComplete && (
                          <span className="ml-2 text-yellow-600">🏆 Complete!</span>
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        {recentPunches.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentPunches.slice(0, 5).map((punch, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-muted last:border-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{punch.customerName}</p>
                        <p className="text-xs text-muted-foreground">
                          {punch.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">
                          {punch.punches}/{punch.maxPunches}
                        </span>
                        {punch.isComplete && (
                          <Trophy className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {punch.isComplete ? 'Complete!' : `${punch.maxPunches - punch.punches} left`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="bg-muted/30">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <h3 className="font-medium">How it works:</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>1. Customer generates a 6-digit code on their phone</p>
                <p>2. Enter the code above to validate and record the punch</p>
                <p>3. Codes expire after 2 minutes for security</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PunchStation;