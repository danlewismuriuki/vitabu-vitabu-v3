import React from 'react';
import { ExchangeMatch } from '../types';
import { ArrowRightLeft, MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface ExchangeMatchCardProps {
  exchangeMatch: ExchangeMatch;
  onAcceptExchange?: (matchId: string) => void;
  onDeclineExchange?: (matchId: string) => void;
}

export const ExchangeMatchCard: React.FC<ExchangeMatchCardProps> = ({ 
  exchangeMatch, 
  onAcceptExchange, 
  onDeclineExchange 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-accent-600 bg-accent-100';
      case 'accepted': return 'text-secondary-600 bg-secondary-100';
      case 'completed': return 'text-secondary-700 bg-secondary-200';
      case 'cancelled': return 'text-neutral-600 bg-neutral-100';
      default: return 'text-neutral-600 bg-neutral-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="card border-2 border-accent-200 hover:border-accent-300 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className={`badge ${getStatusColor(exchangeMatch.status)} flex items-center space-x-1`}>
          {getStatusIcon(exchangeMatch.status)}
          <span className="capitalize">{exchangeMatch.status}</span>
        </div>
        <div className="text-sm text-neutral-500">
          {exchangeMatch.createdDate}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Your Book */}
        <div className="space-y-2">
          <h4 className="font-medium text-primary-700">Your Book</h4>
          <div className="p-3 bg-neutral-50 rounded-lg">
            <img
              src={exchangeMatch.userABook.images[0]}
              alt={exchangeMatch.userABook.title}
              className="w-full h-24 object-cover rounded mb-2"
            />
            <h5 className="font-semibold text-sm line-clamp-2">{exchangeMatch.userABook.title}</h5>
            <p className="text-xs text-neutral-600">
              Grade {exchangeMatch.userABook.grade} • {exchangeMatch.userABook.subject}
            </p>
            <p className="text-xs text-accent-600 font-medium">
              Worth KES {exchangeMatch.userABook.price}
            </p>
          </div>
        </div>

        {/* Exchange Arrow */}
        <div className="flex justify-center">
          <div className="p-3 bg-accent-100 rounded-full">
            <ArrowRightLeft className="h-6 w-6 text-accent-600" />
          </div>
        </div>

        {/* Their Book */}
        <div className="space-y-2">
          <h4 className="font-medium text-primary-700">Their Book</h4>
          <div className="p-3 bg-neutral-50 rounded-lg">
            <img
              src={exchangeMatch.userBBook.images[0]}
              alt={exchangeMatch.userBBook.title}
              className="w-full h-24 object-cover rounded mb-2"
            />
            <h5 className="font-semibold text-sm line-clamp-2">{exchangeMatch.userBBook.title}</h5>
            <p className="text-xs text-neutral-600">
              Grade {exchangeMatch.userBBook.grade} • {exchangeMatch.userBBook.subject}
            </p>
            <p className="text-xs text-accent-600 font-medium">
              Worth KES {exchangeMatch.userBBook.price}
            </p>
          </div>
        </div>
      </div>

      {/* Exchange Partner Info */}
      <div className="mt-4 p-3 bg-secondary-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-accent-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-accent-700">
                {exchangeMatch.userB.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <p className="font-medium text-primary-700">{exchangeMatch.userB.name}</p>
              <div className="flex items-center space-x-2 text-xs text-neutral-600">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{exchangeMatch.userB.location}</span>
                </div>
                <span>•</span>
                <span>⭐ {exchangeMatch.userB.rating}/5.0</span>
                <span>•</span>
                <span>{exchangeMatch.userB.totalExchanges} exchanges</span>
              </div>
            </div>
          </div>
          
          {exchangeMatch.status === 'pending' && (
            <div className="flex space-x-2">
              <button 
                onClick={() => onDeclineExchange?.(exchangeMatch.id)}
                className="btn-secondary text-sm px-3 py-1"
              >
                Decline
              </button>
              <button 
                onClick={() => onAcceptExchange?.(exchangeMatch.id)}
                className="btn-primary text-sm px-3 py-1"
              >
                Accept Exchange
              </button>
            </div>
          )}
        </div>
      </div>

      {exchangeMatch.status === 'completed' && (
        <div className="mt-3 p-2 bg-secondary-100 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-secondary-600" />
            <span className="text-sm text-secondary-700">
              Exchange completed! You saved KES {Math.abs(exchangeMatch.userABook.price - exchangeMatch.userBBook.price)} compared to buying new.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};