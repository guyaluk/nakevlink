import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/customers') {
      return location.pathname === '/customers';
    }
    return location.pathname.startsWith(path);
  };

  const getButtonClass = (path: string) => 
    `flex-col h-auto py-2 ${isActive(path) ? 'text-primary' : 'text-gray-500'}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50 safe-area-inset-bottom">
      <div className="flex justify-around items-center max-w-md mx-auto">
        <Button 
          variant="ghost" 
          className={getButtonClass('/customers')}
          onClick={() => navigate('/customers')}
        >
          <div className="w-6 h-6 mb-1">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
          </div>
          <span className="text-xs">Home</span>
        </Button>
        
        <Button 
          variant="ghost" 
          className={getButtonClass('/customers/discovery')}
          onClick={() => navigate('/customers/discovery')}
        >
          <div className="w-6 h-6 mb-1">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <span className="text-xs">Search</span>
        </Button>
        
        <Button 
          variant="ghost" 
          className={getButtonClass('/customers/one-punch-left')}
          onClick={() => navigate('/customers/one-punch-left')}
        >
          <div className="w-6 h-6 mb-1">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xs leading-tight">One Punch<br/>Left</span>
        </Button>
        
        <Button 
          variant="ghost" 
          className={getButtonClass('/customers/history')}
          onClick={() => {
            // TODO: Navigate to history screen when implemented
            console.log('History navigation not yet implemented');
          }}
        >
          <div className="w-6 h-6 mb-1">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-xs">History</span>
        </Button>
      </div>
    </div>
  );
};

export default BottomNavigation;