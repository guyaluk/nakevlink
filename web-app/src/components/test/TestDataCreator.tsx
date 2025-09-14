import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TestDataCreator: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const createTestData = async () => {
    if (!user) {
      setMessage('Please login first');
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      // Import DataConnect functions
      const { createBusiness, createPunchCard } = await import('@/lib/dataconnect');
      
      // Create a test business
      console.log('Creating test business...');
      const businessResult = await createBusiness({
        name: 'Test Coffee Shop',
        contactName: 'Test Manager',
        email: 'test@coffeeshop.com',
        phoneNumber: '555-0123',
        address: '123 Test Street, Test City',
        categoryId: 1, // Coffee/Cafe
        description: 'A test coffee shop for punch card testing',
        punchNum: 10,
        expirationDurationInDays: 30,
        createdDatetime: new Date().toISOString()
      });

      if (!businessResult?.data?.business_insert) {
        throw new Error('Failed to create test business');
      }

      const businessId = businessResult.data.business_insert.id;
      console.log('Created test business with ID:', businessId);

      // Create a test punch card for the current user
      console.log('Creating test punch card...');
      const punchCardResult = await createPunchCard({
        businessId: businessId,
        userId: user.uid,
        maxPunches: 10,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        createdAt: new Date().toISOString()
      });

      if (!punchCardResult?.data?.punchCard_insert) {
        throw new Error('Failed to create test punch card');
      }

      const punchCardId = punchCardResult.data.punchCard_insert.id;
      console.log('Created test punch card with ID:', punchCardId);

      setMessage(`✅ Test data created successfully!
      
Business: "${businessResult.data.business_insert.name}" (ID: ${businessId})
Punch Card: (ID: ${punchCardId})

You can now:
1. Go to Customer Dashboard
2. See your new punch card
3. Click on it to view details
4. Generate punch codes for testing!`);

    } catch (error: any) {
      console.error('Error creating test data:', error);
      setMessage(`❌ Error creating test data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>🧪 Test Data Creator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          This will create test business and punch card data so you can test the punch code generation functionality.
        </p>
        
        <Button
          onClick={createTestData}
          disabled={loading || !user}
          className="w-full"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Creating Test Data...
            </>
          ) : (
            'Create Test Data'
          )}
        </Button>

        {!user && (
          <p className="text-sm text-red-600">Please login as a customer first</p>
        )}

        {message && (
          <div className={`p-3 rounded-lg text-sm whitespace-pre-wrap ${
            message.startsWith('✅') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TestDataCreator;