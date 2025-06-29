import React from 'react';
import { Trophy, Target } from 'lucide-react';

interface ProgressTrackerProps {
  title: string;
  current: number;
  target: number;
  unit: string;
  color?: 'primary' | 'secondary' | 'accent' | 'gold';
  reward?: string;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  title,
  current,
  target,
  unit,
  color = 'accent',
  reward
}) => {
  const percentage = Math.min((current / target) * 100, 100);
  const isComplete = current >= target;

  const colorClasses = {
    primary: 'from-primary-500 to-primary-600',
    secondary: 'from-secondary-500 to-secondary-600',
    accent: 'from-accent-500 to-gold-500',
    gold: 'from-gold-500 to-gold-600'
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Target className="h-5 w-5 text-accent-600" />
          <h4 className="font-poppins font-semibold text-primary-700">{title}</h4>
        </div>
        {isComplete && (
          <div className="animate-confetti">
            <Trophy className="h-5 w-5 text-gold-600" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-600">Progress</span>
          <span className="font-semibold text-primary-700">
            {current} / {target} {unit}
          </span>
        </div>

        <div className="progress-bar">
          <div 
            className={`progress-fill bg-gradient-to-r ${colorClasses[color]}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-neutral-500">{Math.round(percentage)}% complete</span>
          {reward && (
            <span className="text-accent-600 font-medium">🎁 {reward}</span>
          )}
        </div>
      </div>

      {isComplete && (
        <div className="mt-3 p-2 bg-secondary-50 rounded-lg border border-secondary-200">
          <div className="flex items-center space-x-2">
            <Trophy className="h-4 w-4 text-gold-600" />
            <span className="text-sm font-medium text-secondary-700">
              Goal achieved! {reward}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};