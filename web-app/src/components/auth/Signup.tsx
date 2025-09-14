import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { UserRole } from '../../contexts/AuthContext';
import CustomerSignupForm from './CustomerSignupForm';
import BusinessSignupForm from './BusinessSignupForm';

type SignupStep = 'role-selection' | 'details';

const Signup: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<SignupStep>('role-selection');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleRoleSelection = (role: UserRole) => {
    setSelectedRole(role);
    setCurrentStep('details');
  };

  const handleBackToRoleSelection = () => {
    setCurrentStep('role-selection');
    setSelectedRole(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <h1 className="text-3xl font-bold text-gray-900">NakevLink</h1>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {currentStep === 'role-selection' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 text-center mb-6">
                  Choose your account type
                </h3>
                
                <div className="space-y-4">
                  <button
                    onClick={() => handleRoleSelection('customer')}
                    className="w-full p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <div className="flex flex-col items-center">
                      <div className="text-4xl mb-2">👤</div>
                      <h4 className="text-lg font-semibold text-gray-900">Customer</h4>
                      <p className="text-sm text-gray-600 text-center mt-2">
                        Collect punch cards from your favorite businesses and enjoy rewards
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleRoleSelection('business_owner')}
                    className="w-full p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <div className="flex flex-col items-center">
                      <div className="text-4xl mb-2">🏪</div>
                      <h4 className="text-lg font-semibold text-gray-900">Business Owner</h4>
                      <p className="text-sm text-gray-600 text-center mt-2">
                        Create and manage digital punch cards for your business
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="text-center">
                <span className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Sign in
                  </Link>
                </span>
              </div>
            </div>
          )}

          {currentStep === 'details' && selectedRole && (
            <div>
              <div className="mb-6">
                <button
                  onClick={handleBackToRoleSelection}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-500"
                >
                  ← Back to account type
                </button>
              </div>

              {selectedRole === 'customer' ? (
                <CustomerSignupForm />
              ) : (
                <BusinessSignupForm />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;