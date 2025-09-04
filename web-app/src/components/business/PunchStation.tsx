import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/config/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, X, User, Clock, Trophy, Zap, ArrowLeft, TrendingUp } from 'lucide-react';

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
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PunchResult | null>(null);
  const [recentPunches, setRecentPunches] = useState<RecentPunch[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<{
    name: string;
    currentPunches: number;
    maxPunches: number;
    lastPunch: string;
  } | null>(null);

  // Auto-focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Clear result after delay
  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => {
        setResult(null);
        setCurrentCustomer(null);
        if (result.success) {
          setCode('');
          inputRef.current?.focus(); // Refocus for next code
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
          customerName: data.customer?.name || 'Customer'
        };

        setResult(punchResult);

        // Set current customer info for display
        if (punchResult.success && punchResult.punches && punchResult.maxPunches) {
          setCurrentCustomer({
            name: punchResult.customerName || 'Customer',
            currentPunches: punchResult.punches,
            maxPunches: punchResult.maxPunches,
            lastPunch: 'Just now'
          });
        }

        // Add to recent punches (both success and failure for tracking)
        const newPunch: RecentPunch = {
          customerName: punchResult.customerName || 'Customer',
          timestamp: new Date(),
          punches: punchResult.punches || 0,
          maxPunches: punchResult.maxPunches || 10,
          isComplete: punchResult.isComplete || false
        };
        
        setRecentPunches(prev => [newPunch, ...prev.slice(0, 9)]); // Keep last 10
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
    // Only allow digits, max 6 characters
    const value = e.target.value.replace(/\D/g, '').substring(0, 6);
    setCode(value);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && code.length === 6 && !loading) {
      handleValidateCode(e as any);
    }
  };

  const handleClear = () => {
    setCode('');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header with Navigation */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/business')}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">🎯 Punch Station</h1>
            <p className="text-sm text-muted-foreground">Validate customer punch codes</p>
          </div>
        </div>
      </div>

      {/* Success Animation Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 bg-green-500/20 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white rounded-full p-8 shadow-lg animate-bounce">
            <CheckCircle className="w-20 h-20 text-green-500" />
            <div className="text-4xl animate-pulse mt-2">🎉</div>
          </div>
        </div>
      )}

      <div className="p-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content - Central Input */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Central Input Card */}
            <Card className="bg-white shadow-lg">
              <CardContent className="p-8 text-center space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-gray-800">Enter 6-Digit Code</h2>
                  
                  {/* Large Input Field */}
                  <div className="space-y-4">
                    <Input
                      ref={inputRef}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      placeholder="123456"
                      value={code}
                      onChange={handleCodeChange}
                      onKeyPress={handleKeyPress}
                      disabled={loading}
                      className="text-4xl text-center tracking-widest font-mono h-20 border-2 focus:border-primary"
                      autoComplete="off"
                      autoFocus
                    />
                    
                    {/* Big Action Button */}
                    <Button
                      onClick={(e) => handleValidateCode(e as any)}
                      disabled={code.length !== 6 || loading}
                      size="lg"
                      className="w-full h-16 text-2xl font-bold"
                    >
                      {loading ? (
                        <>
                          <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin mr-3" />
                          Checking...
                        </>
                      ) : (
                        '🎯 Punch'
                      )}
                    </Button>
                  </div>
                </div>
                
                {/* Immediate Feedback */}
                {result && (
                  <div className={`flex items-center justify-center space-x-3 p-6 rounded-xl transition-all duration-300 ${
                    result.success 
                      ? 'bg-green-100 text-green-800 border-2 border-green-300' 
                      : 'bg-red-100 text-red-800 border-2 border-red-300'
                  } ${showSuccess ? 'animate-pulse' : ''}`}>
                    {result.success ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <X className="w-6 h-6" />
                    )}
                    <span className="font-semibold text-lg">{result.message}</span>
                    {showSuccess && result.success && (
                      <span className="text-2xl animate-bounce">✨</span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Customer Info Panel */}
            {currentCustomer && (
              <Card className="border-green-300 bg-green-50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-green-800">
                    <User className="w-5 h-5" />
                    <span>Customer Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-green-600">Customer Name</p>
                      <p className="font-bold text-lg text-green-900">{currentCustomer.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-green-600">Last Punch</p>
                      <p className="font-bold text-lg text-green-900">{currentCustomer.lastPunch}</p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-sm font-medium text-green-700">Punch Card Progress</p>
                      <p className="font-bold text-xl text-green-800">
                        {currentCustomer.currentPunches}/{currentCustomer.maxPunches}
                      </p>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-4">
                      <div 
                        className="bg-green-600 h-4 rounded-full transition-all duration-700 shadow-inner"
                        style={{ 
                          width: `${(currentCustomer.currentPunches / currentCustomer.maxPunches) * 100}%` 
                        }}
                      ></div>
                    </div>
                    {currentCustomer.currentPunches >= currentCustomer.maxPunches ? (
                      <p className="text-center text-green-700 font-bold mt-3 text-lg">
                        🏆 Reward Earned! Card Complete!
                      </p>
                    ) : (
                      <p className="text-center text-green-700 font-medium mt-2">
                        {currentCustomer.maxPunches - currentCustomer.currentPunches} punches until reward
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Recent Punch Log */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Recent Punches</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentPunches.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Clock className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p className="font-medium">No Recent Activity</p>
                    <p className="text-xs">Punch validations will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {recentPunches.slice(0, 8).map((punch, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10">
                            {punch.isComplete ? (
                              <Trophy className="w-5 h-5 text-yellow-600" />
                            ) : punch.punches > 0 ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <X className="w-5 h-5 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{punch.customerName}</p>
                            <p className="text-xs text-muted-foreground">
                              {punch.timestamp.toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold">
                            {punch.punches}/{punch.maxPunches}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {punch.isComplete ? (
                              <span className="text-yellow-600 font-medium">Complete!</span>
                            ) : punch.punches > 0 ? (
                              <span className="text-green-600">✓ Success</span>
                            ) : (
                              <span className="text-red-600">✗ Failed</span>
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardContent className="p-4 text-center">
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-green-600">
                    {recentPunches.filter(p => p.punches > 0).length}
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">
                    Successful Punches Today
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                    <div className="bg-yellow-50 p-2 rounded">
                      <div className="font-bold text-yellow-700">
                        {recentPunches.filter(p => p.isComplete).length}
                      </div>
                      <div className="text-yellow-600">Completed</div>
                    </div>
                    <div className="bg-red-50 p-2 rounded">
                      <div className="font-bold text-red-700">
                        {recentPunches.filter(p => p.punches === 0).length}
                      </div>
                      <div className="text-red-600">Failed</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="text-center space-y-2">
                  <h3 className="font-semibold text-blue-800">How It Works</h3>
                  <div className="text-xs text-blue-700 space-y-1 text-left">
                    <p>• Customer generates 6-digit code on their phone</p>
                    <p>• Enter code above and press Punch or Enter</p>
                    <p>• Codes expire after 2 minutes for security</p>
                    <p>• Field resets automatically for next customer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PunchStation;