import React from 'react';
import BottomNavigation from '@/components/customer/BottomNavigation';

interface CustomerLayoutProps {
  children: React.ReactNode;
  showBottomNav?: boolean;
  title?: string;
  showHeader?: boolean;
  headerActions?: React.ReactNode;
  fullHeight?: boolean;
  contentWidth?: 'narrow' | 'wide';
}

const CustomerLayout: React.FC<CustomerLayoutProps> = ({
  children,
  showBottomNav = true,
  title,
  showHeader = false,
  headerActions,
  fullHeight = false
}) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header (optional) */}
      {showHeader && (
        <div className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
            {title ? (
              <h1 className="text-lg font-semibold text-foreground">{title}</h1>
            ) : (
              <div />
            )}
            {headerActions && (
              <div className="flex items-center gap-2">
                {headerActions}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main 
        className={`
          ${fullHeight ? 'flex-1' : ''}
          ${showBottomNav ? 'pb-20' : 'pb-4'}
          ${showHeader ? '' : 'pt-4'}
        `}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      {showBottomNav && <BottomNavigation />}
    </div>
  );
};

export default CustomerLayout;