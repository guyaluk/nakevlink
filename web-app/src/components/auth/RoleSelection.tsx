import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Store } from 'lucide-react';

const RoleSelection: React.FC = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role: 'customer' | 'business') => {
    if (role === 'customer') {
      navigate('/signup/customer');
    } else {
      navigate('/signup/business');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground">NakevLink</h1>
          <p className="mt-2 text-muted-foreground">Choose your account type</p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Card */}
          <Card 
            className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-primary/50"
            onClick={() => handleRoleSelect('customer')}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl">I'm a Customer</CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <p className="text-muted-foreground mb-6">
                I want to collect punch cards and earn rewards from local businesses
              </p>
              <Button 
                className="w-full" 
                size="lg"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRoleSelect('customer');
                }}
              >
                Continue as Customer
              </Button>
            </CardContent>
          </Card>

          {/* Business Owner Card */}
          <Card 
            className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 hover:border-primary/50"
            onClick={() => handleRoleSelect('business')}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Store className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl">I'm a Business Owner</CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <p className="text-muted-foreground mb-6">
                I want to create punch cards and reward loyal customers
              </p>
              <Button 
                className="w-full" 
                size="lg"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRoleSelect('business');
                }}
              >
                Continue as Business Owner
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Back to Login */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <button
              className="font-medium text-primary hover:underline"
              onClick={() => navigate('/login')}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;