import React from 'react';
import { LogIn, ArrowRight, BookOpen, Users } from 'lucide-react';

interface SignInPromptProps {
  onSignInClick: () => void;
}

export const SignInPrompt: React.FC<SignInPromptProps> = ({ onSignInClick }) => {
  return (
    <div className="card bg-gradient-to-r from-accent-50 to-secondary-50 border-2 border-accent-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-accent-100 rounded-full">
            <BookOpen className="h-6 w-6 text-accent-600" />
          </div>
          <div>
            <h3 className="font-poppins font-semibold text-primary-800 mb-1">
              Already exchanging books?
            </h3>
            <p className="text-sm text-neutral-600">
              Sign in to track your exchanges, view messages, and manage your listings
            </p>
          </div>
        </div>
        
        <button
          onClick={onSignInClick}
          className="flex items-center space-x-2 bg-accent-500 hover:bg-accent-600 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg group"
        >
          <LogIn className="h-4 w-4" />
          <span>Sign In</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
        </button>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 pt-4 border-t border-accent-200">
        <div className="flex items-center justify-center space-x-8 text-sm">
          <div className="flex items-center space-x-2 text-accent-700">
            <Users className="h-4 w-4" />
            <span className="font-medium">127 active exchangers nearby</span>
          </div>
          <div className="text-neutral-600">
            <span className="font-medium">15 new matches</span> this week
          </div>
        </div>
      </div>
    </div>
  );
};