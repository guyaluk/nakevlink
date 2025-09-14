import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PunchDataMigrator: React.FC = () => {
  const { user } = useAuth();
  const [migrating, setMigrating] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const migratePunchData = async () => {
    if (!user?.email) {
      addResult('❌ Please login as a business owner first');
      return;
    }

    setMigrating(true);
    setResults([]);
    addResult('🔄 Starting punch data migration...');

    try {
      const { db } = await import('@/config/firebase');
      const { collection, query, where, getDocs, doc, updateDoc } = await import('firebase/firestore');
      const { auth } = await import('@/config/firebase');
      const { getAuth } = await import('firebase/auth');

      // Get all punch records for this business that need migration
      addResult('📊 Fetching punch records...');
      const punchesQuery = query(
        collection(db, 'punches'),
        where('businessEmail', '==', user.email)
      );

      const punchesSnapshot = await getDocs(punchesQuery);
      addResult(`📄 Found ${punchesSnapshot.size} punch records`);

      let updated = 0;
      let skipped = 0;
      let errors = 0;

      for (const punchDoc of punchesSnapshot.docs) {
        const punchData = punchDoc.data();
        
        // Skip if already has customer info
        if (punchData.customerName && punchData.customerName !== 'Unknown Customer') {
          skipped++;
          continue;
        }

        try {
          // Get customer info from userId
          if (!punchData.userId) {
            addResult(`⚠️ Punch ${punchDoc.id} has no userId, skipping`);
            skipped++;
            continue;
          }

          addResult(`🔍 Looking up customer for userId: ${punchData.userId}`);
          
          // Try to get customer info from Auth
          const response = await fetch(`http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:lookup?key=fake-api-key`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              localId: [punchData.userId]
            })
          });

          if (response.ok) {
            const authData = await response.json();
            if (authData.users && authData.users.length > 0) {
              const customerUser = authData.users[0];
              const customerName = customerUser.displayName || customerUser.email || 'Unknown Customer';
              const customerEmail = customerUser.email || 'unknown@example.com';

              // Update the punch record
              await updateDoc(doc(db, 'punches', punchDoc.id), {
                customerName: customerName,
                customerEmail: customerEmail
              });

              addResult(`✅ Updated punch ${punchDoc.id}: ${customerName}`);
              updated++;
            } else {
              addResult(`⚠️ No auth data found for userId: ${punchData.userId}`);
              skipped++;
            }
          } else {
            addResult(`❌ Failed to fetch auth data for userId: ${punchData.userId}`);
            errors++;
          }
        } catch (error: any) {
          addResult(`❌ Error updating punch ${punchDoc.id}: ${error.message}`);
          errors++;
        }
      }

      addResult(`✅ Migration completed:`);
      addResult(`   - Updated: ${updated} records`);
      addResult(`   - Skipped: ${skipped} records`);
      addResult(`   - Errors: ${errors} records`);

    } catch (error: any) {
      addResult(`❌ Migration error: ${error.message}`);
      console.error('Migration error:', error);
    } finally {
      setMigrating(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>🔧 Punch Data Migration Tool</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          This tool will update existing punch records to include customer names instead of "Unknown Customer".
        </p>
        
        <Button
          onClick={migratePunchData}
          disabled={migrating || !user}
          className="w-full"
        >
          {migrating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Migrating Punch Data...
            </>
          ) : (
            '🔄 Migrate Existing Punch Records'
          )}
        </Button>

        {!user && (
          <p className="text-sm text-red-600">Please login as a business owner first</p>
        )}

        {results.length > 0 && (
          <div className="bg-gray-100 rounded-lg p-4 max-h-96 overflow-y-auto">
            <h4 className="font-semibold mb-2">Migration Results:</h4>
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
          <strong>What this does:</strong>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Finds all punch records with "Unknown Customer"</li>
            <li>Looks up the actual customer name from Firebase Auth</li>
            <li>Updates the records with real customer names</li>
            <li>Shows detailed progress and results</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default PunchDataMigrator;