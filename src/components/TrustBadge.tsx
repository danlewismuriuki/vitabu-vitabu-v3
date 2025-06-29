import React from 'react';
import { Badge } from '../types';
import { BadgeIcon } from './BadgeIcon';

interface TrustBadgeProps {
  badge: Badge;
  size?: 'sm' | 'md' | 'lg';
  showDescription?: boolean;
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({ 
  badge, 
  size = 'md', 
  showDescription = false 
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <div className={`inline-flex items-center space-x-1 badge ${sizeClasses[size]} bg-white border border-neutral-200 shadow-sm`}>
      <BadgeIcon icon={badge.icon} className={`${iconSizes[size]} ${badge.color}`} />
      <span className={`font-medium ${badge.color}`}>{badge.name}</span>
      {showDescription && (
        <div className="ml-2 text-xs text-neutral-600 hidden lg:block">
          {badge.description}
        </div>
      )}
    </div>
  );
};