import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle, RefreshCw } from 'lucide-react';

interface PunchHistoryItem {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  businessEmail: string;
  cardId: string;
  punchTime: Date;
  businessName: string;
}

const BusinessPunchHistory: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [punchHistory, setPunchHistory] = useState<PunchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get customer info from DataConnect
  const getCustomerInfo = async (userId: string) => {
    try {
      // Try to get customer from DataConnect User table
      const { getUser } = await import('@/lib/dataconnect');
      const userResult = await getUser({ id: userId });
      
      if (userResult?.data?.user) {
        return {
          name: userResult.data.user.name,
          email: userResult.data.user.email
        };
      }
    } catch (error) {
      console.warn('Could not fetch customer from DataConnect:', error);
    }
    
    return {
      name: 'Unknown Customer',
      email: 'unknown@example.com'
    };
  };

  const fetchPunchHistory = async (isRefresh = false) => {
    if (!user?.email) return;

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      console.log('BusinessPunchHistory: Fetching punch history for business:', user.email);

      const { db } = await import('@/config/firebase');
      const { collection, query, where, orderBy, getDocs } = await import('firebase/firestore');

      // Query Firestore for punches by this business
      const punchesQuery = query(
        collection(db, 'punches'),
        where('businessEmail', '==', user.email),
        orderBy('punchTime', 'desc') // Newest first
      );

      const punchesSnapshot = await getDocs(punchesQuery);
      const punches: PunchHistoryItem[] = [];

      // Process each punch and get customer info
      for (const doc of punchesSnapshot.docs) {
        const data = doc.data();
        
        // If customer info is already available, use it
        let customerName = data.customerName;
        let customerEmail = data.customerEmail;
        
        // If missing customer info, try to fetch it
        if (!customerName || customerName === 'Unknown Customer') {
          if (data.userId) {
            console.log('BusinessPunchHistory: Looking up customer info for userId:', data.userId);
            const customerInfo = await getCustomerInfo(data.userId);
            customerName = customerInfo.name;
            customerEmail = customerInfo.email;
          }
        }
        
        punches.push({
          id: doc.id,
          userId: data.userId,
          customerName: customerName || 'Unknown Customer',
          customerEmail: customerEmail || 'unknown@example.com',
          businessEmail: data.businessEmail,
          cardId: data.cardId,
          punchTime: data.punchTime.toDate(),
          businessName: data.businessName || 'Your Business'
        });
      }

      console.log('BusinessPunchHistory: Found', punches.length, 'punch records');
      setPunchHistory(punches);

    } catch (error) {
      console.error('BusinessPunchHistory: Error fetching punch history:', error);
      setError('Failed to load punch history. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPunchHistory();
  }, [user]);

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between p-4 max-w-md mx-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/business')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <h1 className="text-lg font-semibold">Punch History</h1>
            <div className="w-16" /> {/* Spacer */}
          </div>
        </div>

        {/* Loading */}
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading punch history...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4 max-w-md mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/business')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-lg font-semibold">Punch History</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchPunchHistory(true)}
            disabled={refreshing}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-safe max-w-md mx-auto">
        {error ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={() => fetchPunchHistory()} variant="outline">
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : punchHistory.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-40" />
              <h3 className="text-lg font-semibold mb-2">No Punch History</h3>
              <p className="text-muted-foreground text-sm">
                No punches have been validated yet. When customers scan their punch codes, they'll appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {/* Summary */}
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{punchHistory.length}</p>
                  <p className="text-sm text-muted-foreground">Total Punches Validated</p>
                </div>
              </CardContent>
            </Card>

            {/* Punch History List */}
            <div className="space-y-2">
              {punchHistory.map((punch) => (
                <Card key={punch.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-foreground truncate">
                              {punch.customerName}
                            </h3>
                            <p className="text-xs text-muted-foreground truncate">
                              {punch.customerEmail}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatDateTime(punch.punchTime)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessPunchHistory;