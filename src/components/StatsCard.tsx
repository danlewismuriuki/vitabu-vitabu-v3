import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'primary' | 'secondary' | 'accent' | 'gold';
  trend?: {
    value: number;
    label: string;
  };
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'primary',
  trend
}) => {
  const colorClasses = {
    primary: 'text-primary-600 bg-primary-100',
    secondary: 'text-secondary-600 bg-secondary-100',
    accent: 'text-accent-600 bg-accent-100',
    gold: 'text-gold-600 bg-gold-100'
  };

  return (
    <div className="card hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-neutral-600">{title}</h3>
              <div className="flex items-baseline space-x-2">
                <p className="text-2xl font-bold text-primary-800">{value}</p>
                {subtitle && (
                  <p className="text-sm text-neutral-500">{subtitle}</p>
                )}
              </div>
            </div>
          </div>
          
          {trend && (
            <div className="flex items-center space-x-2 mt-2">
              <div className={`text-xs px-2 py-1 rounded-full ${
                trend.value > 0 
                  ? 'bg-secondary-100 text-secondary-700' 
                  : 'bg-neutral-100 text-neutral-600'
              }`}>
                {trend.value > 0 ? '+' : ''}{trend.value}%
              </div>
              <span className="text-xs text-neutral-500">{trend.label}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};