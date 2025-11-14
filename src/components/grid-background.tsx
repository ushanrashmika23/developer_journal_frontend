import React, { useEffect, useState } from 'react';

interface GridBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

export const GridBackground: React.FC<GridBackgroundProps> = ({
  children,
  className = ""
}) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate grid offset based on scroll position
  const gridOffset = scrollY * 0.025; // Adjust multiplier for speed

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
          backgroundSize: '59px 59px',
          backgroundPosition: `${gridOffset}px ${gridOffset}px`,
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
          backgroundSize: '59px 59px',
          backgroundPosition: `${gridOffset}px ${gridOffset}px`,
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