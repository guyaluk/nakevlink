import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PunchDataDebugger: React.FC = () => {
  const { user } = useAuth();
  const [debugging, setDebugging] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const debugPunchData = async () => {
    if (!user?.email) {
      addResult('❌ Please login as a business owner first');
      return;
    }

    setDebugging(true);
    setResults([]);
    addResult('🔍 Starting punch data debugging...');

    try {
      // 1. Check punch records structure
      addResult('📊 Checking punch records...');
      const { db } = await import('@/config/firebase');
      const { collection, query, where, getDocs, limit } = await import('firebase/firestore');

      const punchesQuery = query(
        collection(db, 'punches'),
        where('businessEmail', '==', user.email),
        limit(3) // Just get a few for debugging
      );

      const punchesSnapshot = await getDocs(punchesQuery);
      addResult(`📄 Found ${punchesSnapshot.size} punch records`);

      let userIds: string[] = [];
      punchesSnapshot.forEach(doc => {
        const data = doc.data();
        addResult(`🔍 Punch ${doc.id}:`);
        addResult(`   - userId: ${data.userId || 'MISSING'}`);
        addResult(`   - customerName: ${data.customerName || 'MISSING'}`);
        addResult(`   - customerEmail: ${data.customerEmail || 'MISSING'}`);
        addResult(`   - punchTime: ${data.punchTime?.toDate?.().toLocaleString() || 'MISSING'}`);
        
        if (data.userId) {
          userIds.push(data.userId);
        }
      });

      // 2. Check if we have any known customer user IDs to test
      addResult('👥 Will test DataConnect user lookup with found userIds...');

      // 3. Test individual user lookup
      if (userIds.length > 0) {
        addResult('🔍 Testing user lookup for each userId...');
        for (const userId of userIds.slice(0, 2)) { // Test first 2
          try {
            const { getUser } = await import('@/lib/dataconnect');
            const userResult = await getUser({ id: userId });
            
            if (userResult?.data?.user) {
              addResult(`✅ Found user ${userId}: ${userResult.data.user.name} (${userResult.data.user.email})`);
            } else {
              addResult(`❌ User ${userId} not found in DataConnect`);
            }
          } catch (userError: any) {
            addResult(`❌ Error looking up user ${userId}: ${userError.message}`);
          }
        }
      }

      addResult('✅ Debugging completed!');

    } catch (error: any) {
      addResult(`❌ Debug error: ${error.message}`);
      console.error('Debug error:', error);
    } finally {
      setDebugging(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>🔍 Punch Data Debugger</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          This tool helps debug why customer names aren't showing up in punch history.
        </p>
        
        <Button
          onClick={debugPunchData}
          disabled={debugging || !user}
          className="w-full"
        >
          {debugging ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Debugging...
            </>
          ) : (
            '🔍 Debug Punch Data'
          )}
        </Button>

        {!user && (
          <p className="text-sm text-red-600">Please login as a business owner first</p>
        )}

        {results.length > 0 && (
          <div className="bg-gray-100 rounded-lg p-4 max-h-96 overflow-y-auto">
            <h4 className="font-semibold mb-2">Debug Results:</h4>
            <div className="space-y-1 text-sm font-mono">
              {results.map((result, index) => (
                <div key={index} className={`
                  ${result.includes('✅') ? 'text-green-700' : ''}
                  ${result.includes('❌') ? 'text-red-700' : ''}
                  ${result.includes('⚠️') ? 'text-orange-700' : ''}
                  ${result.includes('🔍') || result.includes('🔄') ? 'text-blue-700 font-semibold' : ''}
                `}>
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <strong>This checks:</strong>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Structure of existing punch records</li>
            <li>What userIds are stored in punch records</li>
            <li>What users exist in DataConnect Users table</li>
            <li>Whether user lookup is working for specific userIds</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default PunchDataDebugger;