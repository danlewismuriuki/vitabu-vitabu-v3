import React from 'react';
import { RefreshCw, ArrowRightLeft, Users } from 'lucide-react';

export const SwapBanner: React.FC = () => {
  return (
    <div className="card bg-gradient-to-r from-secondary-500 to-accent-500 text-white mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-white/20 rounded-full">
            <ArrowRightLeft className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-2xl font-poppins font-bold mb-2">
              Save Money – Swap Books With Parents Near You
            </h3>
            <p className="text-lg opacity-90">
              Exchange books instead of buying new ones. Perfect for budget-conscious families!
            </p>
            <div className="flex items-center space-x-4 mt-3 text-sm opacity-80">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>127 active swappers in your area</span>
              </div>
              <div className="flex items-center space-x-1">
                <RefreshCw className="h-4 w-4" />
                <span>15 new matches this week</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-3">
          <button className="btn-primary bg-white text-secondary-700 hover:bg-neutral-100 px-6 py-3">
            Start a Swap
          </button>
          <button className="text-white hover:text-neutral-200 text-sm underline">
            How swapping works →
          </button>
        </div>
      </div>
    </div>
  );
};