import React from 'react';

interface GridBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

export const GridBackground: React.FC<GridBackgroundProps> = ({
  children,
  className = ""
}) => {
  return (
    <div className={`relative min-h-screen ${className}`}>
      {/* Grid Lines Only - Light Mode */}
      <div
        className="fixed inset-0 pointer-events-none z-0 dark:hidden"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 0, 0, 0.065) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.065) 1px, transparent 1px)
          `,
          backgroundSize: '59px 59px'
        }}
        data-theme="light"
      />
      {/* Grid Lines Only - Dark Mode */}
      <div
        className="fixed inset-0 pointer-events-none z-0 dark:block"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '59px 59px'
        }}
        data-theme="dark"
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};