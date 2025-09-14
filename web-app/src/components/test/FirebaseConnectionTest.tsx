import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { httpsCallable } from 'firebase/functions';
import { functions, db } from '@/config/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FirebaseConnectionTest: React.FC = () => {
  const { user } = useAuth();
  const [results, setResults] = useState<string[]>([]);
  const [testing, setTesting] = useState(false);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testFirebaseConnection = async () => {
    setTesting(true);
    setResults([]);
    addResult('🔄 Starting Firebase connection tests...');

    try {
      // Test 1: Firestore Connection
      addResult('📊 Testing Firestore connection...');
      try {
        const testCollection = collection(db, 'connectionTest');
        const testDoc = await addDoc(testCollection, {
          message: 'Connection test',
          timestamp: new Date()
        });
        addResult(`✅ Firestore: Successfully wrote document ${testDoc.id}`);

        // Read back the data
        const snapshot = await getDocs(testCollection);
        addResult(`✅ Firestore: Successfully read ${snapshot.size} documents`);
      } catch (firestoreError: any) {
        addResult(`❌ Firestore Error: ${firestoreError.message}`);
        console.error('Firestore test error:', firestoreError);
      }

      // Test 2: Functions Connection
      if (!user) {
        addResult('⚠️ Functions: User not authenticated - skipping function test');
      } else {
        addResult('🔧 Testing Functions connection...');
        try {
          const generatePunchCode = httpsCallable(functions, 'generatePunchCode');
          const result = await generatePunchCode({ cardId: 'test-card-id' });
          
          if (result.data) {
            addResult('✅ Functions: Successfully called generatePunchCode');
            addResult(`📄 Functions Response: ${JSON.stringify(result.data)}`);
          } else {
            addResult('⚠️ Functions: Got empty response');
          }
        } catch (functionError: any) {
          addResult(`❌ Functions Error: ${functionError.code} - ${functionError.message}`);
          console.error('Functions test error:', functionError);
        }
      }

      // Test 3: Authentication
      addResult('🔐 Testing Authentication...');
      if (user) {
        addResult(`✅ Auth: User authenticated as ${user.email}`);
        addResult(`👤 Auth: User UID: ${user.uid}`);
        addResult(`🏷️ Auth: User Role: ${user.role}`);
      } else {
        addResult('❌ Auth: No user authenticated');
      }

    } catch (error: any) {
      addResult(`❌ General Error: ${error.message}`);
      console.error('Test error:', error);
    }

    setTesting(false);
    addResult('✅ Firebase connection tests completed!');
  };

  useEffect(() => {
    // Auto-run test on component mount
    testFirebaseConnection();
  }, [user]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>🔍 Firebase Connection Diagnostics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={testFirebaseConnection}
          disabled={testing}
          className="w-full"
        >
          {testing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Running Tests...
            </>
          ) : (
            '🧪 Run Firebase Connection Test'
          )}
        </Button>

        {results.length > 0 && (
          <div className="bg-gray-100 rounded-lg p-4 max-h-96 overflow-y-auto">
            <h4 className="font-semibold mb-2">Test Results:</h4>
            <div className="space-y-1 text-sm font-mono">
              {results.map((result, index) => (
                <div key={index} className={`
                  ${result.includes('✅') ? 'text-green-700' : ''}
                  ${result.includes('❌') ? 'text-red-700' : ''}
                  ${result.includes('⚠️') ? 'text-orange-700' : ''}
                  ${result.includes('🔄') ? 'text-blue-700 font-semibold' : ''}
                `}>
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          This test checks:
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Firestore emulator connection (read/write)</li>
            <li>Firebase Functions emulator connection</li>
            <li>User authentication status</li>
            <li>generatePunchCode function availability</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default FirebaseConnectionTest;