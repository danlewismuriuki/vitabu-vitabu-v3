import React from 'react';
import { ActivityFeedItem } from '../types';
import { MapPin, Clock, ArrowRightLeft } from 'lucide-react';

interface ActivityFeedProps {
  activities: ActivityFeedItem[];
  title?: string;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ 
  activities, 
  title = "Community Activity" 
}) => {
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'sale': return 'text-secondary-600';
      case 'listing': return 'text-accent-600';
      case 'badge': return 'text-gold-600';
      case 'review': return 'text-primary-600';
      case 'exchange': return 'text-secondary-600';
      default: return 'text-neutral-600';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'exchange': return <ArrowRightLeft className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-poppins font-semibold text-primary-700">
          {title}
        </h3>
        <div className="flex items-center space-x-1 text-sm text-secondary-600">
          <div className="w-2 h-2 bg-secondary-600 rounded-full animate-pulse"></div>
          <span>Live</span>
        </div>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 animate-fade-in">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-100">
              {getActivityIcon(activity.type) || (
                <div className="w-2 h-2 bg-neutral-400 rounded-full"></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-primary-700">{activity.user.name}</span>
                <span className={`text-sm ${getActivityColor(activity.type)}`}>
                  {activity.message}
                </span>
              </div>
              {activity.type === 'exchange' && activity.exchangeMatch && (
                <div className="text-xs text-neutral-600 mb-1">
                  {activity.exchangeMatch.userABook.title} ↔ {activity.exchangeMatch.userBBook.title}
                </div>
              )}
              <div className="flex items-center space-x-3 text-xs text-neutral-500">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{activity.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{activity.timestamp}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-neutral-200">
        <button className="text-sm text-accent-600 hover:text-accent-700 font-medium">
          View all activity →
        </button>
      </div>
    </div>
  );
}