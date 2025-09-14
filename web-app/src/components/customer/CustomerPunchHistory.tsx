import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, RefreshCw } from 'lucide-react';
import CustomerLayout from '../layouts/CustomerLayout';

interface PunchHistoryItem {
  id: string;
  userId: string;
  customerEmail: string;
  businessEmail: string;
  cardId: string;
  punchTime: Date;
  businessName: string;
}

const CustomerPunchHistory: React.FC = () => {
  const { user } = useAuth();
  const [punchHistory, setPunchHistory] = useState<PunchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPunchHistory = async (isRefresh = false) => {
    if (!user?.uid) return;

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      console.log('CustomerPunchHistory: Fetching punch history for customer:', user.uid);

      const { db } = await import('@/config/firebase');
      const { collection, query, where, orderBy, getDocs } = await import('firebase/firestore');

      // Query Firestore for punches by this customer
      const punchesQuery = query(
        collection(db, 'punches'),
        where('userId', '==', user.uid),
        orderBy('punchTime', 'desc') // Newest first
      );

      const punchesSnapshot = await getDocs(punchesQuery);

      // Create array to store punches with business names
      const punchesWithBusinessNames: PunchHistoryItem[] = [];

      // Process each punch and look up business name
      await Promise.all(
        Array.from(punchesSnapshot.docs).map(async (doc) => {
          const data = doc.data();
          let businessName = data.businessName || 'Unknown Business';

          // Try to get business name from Data Connect first
          try {
            const { getBusinessByEmail } = await import('@/lib/dataconnect');
            const businessResult = await getBusinessByEmail({ email: data.businessEmail });
            
            if (businessResult?.data?.businesses && businessResult.data.businesses.length > 0) {
              businessName = businessResult.data.businesses[0].name || businessName;
            }
          } catch (error) {
            console.log('CustomerPunchHistory: Could not fetch business name from Data Connect:', error);
            
            // Fallback: try to get business name from Firestore
            try {
              const { db } = await import('@/config/firebase');
              const { collection, query, where, getDocs } = await import('firebase/firestore');
              
              const businessQuery = query(
                collection(db, 'businesses'),
                where('email', '==', data.businessEmail)
              );
              const businessSnapshot = await getDocs(businessQuery);
              
              if (!businessSnapshot.empty) {
                const businessData = businessSnapshot.docs[0].data();
                businessName = businessData.name || businessName;
              }
            } catch (firestoreError) {
              console.log('CustomerPunchHistory: Could not fetch business name from Firestore:', firestoreError);
              // Keep default business name or email as fallback
              businessName = data.businessName || data.businessEmail || 'Unknown Business';
            }
          }

          punchesWithBusinessNames.push({
            id: doc.id,
            userId: data.userId,
            customerEmail: data.customerEmail || user.email || '',
            businessEmail: data.businessEmail,
            cardId: data.cardId,
            punchTime: data.punchTime.toDate(),
            businessName
          });
        })
      );

      console.log('CustomerPunchHistory: Found', punchesWithBusinessNames.length, 'punch records with business names');
      setPunchHistory(punchesWithBusinessNames);

    } catch (error) {
      console.error('CustomerPunchHistory: Error fetching punch history:', error);
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
      <CustomerLayout 
        showHeader={true} 
        title="Punch History"
      >
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading punch history...</p>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout 
      showHeader={true} 
      title="Punch History"
      headerActions={
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fetchPunchHistory(true)}
          disabled={refreshing}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
        </Button>
      }
    >
      <div className="py-4">
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
                You haven't received any punches yet. Visit businesses and scan your punch codes to start earning rewards!
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
                  <p className="text-sm text-muted-foreground">Total Punches Received</p>
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
                              {punch.businessName}
                            </h3>
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
    </CustomerLayout>
  );
};

export default CustomerPunchHistory;