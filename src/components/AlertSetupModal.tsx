import React, { useState } from 'react';
import { X, Bell, BookOpen, MapPin, Mail, Phone, Users, CheckCircle } from 'lucide-react';

interface AlertSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSetupAlert: (alertData: any) => void;
  searchQuery?: string;
  filters?: any;
  location?: string;
}

export const AlertSetupModal: React.FC<AlertSetupModalProps> = ({
  isOpen,
  onClose,
  onSetupAlert,
  searchQuery,
  filters,
  location = "Nairobi"
}) => {
  const [alertData, setAlertData] = useState({
    email: '',
    phone: '',
    name: '',
    radius: '10'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!alertData.email) {
      alert('Email is required for notifications');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const alertInfo = {
      ...alertData,
      searchQuery,
      filters,
      location,
      createdAt: new Date().toISOString()
    };
    
    onSetupAlert(alertInfo);
    setIsLoading(false);
    setShowSuccess(true);
    
    // Auto-close after success
    setTimeout(() => {
      onClose();
      setShowSuccess(false);
      setAlertData({ email: '', phone: '', name: '', radius: '10' });
    }, 3000);
  };

  const getSearchDescription = () => {
    let description = '';
    
    if (filters?.grade) {
      description += `Grade ${filters.grade} `;
    }
    if (filters?.subject) {
      description += `${filters.subject} `;
    }
    if (searchQuery) {
      description += `"${searchQuery}" `;
    }
    
    return description.trim() || 'books matching your search';
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
          <div className="p-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-secondary-100 rounded-full">
                <CheckCircle className="h-12 w-12 text-secondary-600" />
              </div>
            </div>
            
            <h2 className="text-2xl font-poppins font-bold text-primary-800 mb-4">
              🔔 Alert Set Up!
            </h2>
            
            <p className="text-neutral-600 mb-4">
              We'll notify you when {getSearchDescription()} become available in {location}.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700">
                📧 Check your email for confirmation
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-accent-100 rounded-lg">
                <Bell className="h-6 w-6 text-accent-600" />
              </div>
              <div>
                <h2 className="text-xl font-poppins font-bold text-primary-800">
                  Get Notified When Available
                </h2>
                <p className="text-sm text-neutral-600">
                  We'll email you when books match your search
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Search Summary */}
          <div className="bg-accent-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium text-accent-700 mb-2">You're looking for:</h3>
            <div className="space-y-1 text-sm">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-accent-600" />
                <span className="text-primary-700 font-medium">{getSearchDescription()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-accent-600" />
                <span className="text-primary-700">In {location} area</span>
              </div>
            </div>
          </div>

          {/* Alert Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  type="email"
                  value={alertData.email}
                  onChange={(e) => setAlertData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your.email@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  type="tel"
                  value={alertData.phone}
                  onChange={(e) => setAlertData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+254 7XX XXX XXX"
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                />
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                For WhatsApp notifications (optional)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                What should we call you? (Optional)
              </label>
              <input
                type="text"
                value={alertData.name}
                onChange={(e) => setAlertData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your first name"
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Search Radius
              </label>
              <select
                value={alertData.radius}
                onChange={(e) => setAlertData(prev => ({ ...prev, radius: e.target.value }))}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              >
                <option value="5">Within 5km of {location}</option>
                <option value="10">Within 10km of {location}</option>
                <option value="25">Within 25km of {location}</option>
                <option value="50">Within 50km of {location}</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading || !alertData.email}
              className="w-full btn-primary py-4 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Setting up alert...</span>
                </>
              ) : (
                <>
                  <Bell className="h-5 w-5" />
                  <span>Set Up Alert</span>
                </>
              )}
            </button>
          </form>

          {/* Social Proof */}
          <div className="mt-6 p-4 bg-secondary-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="h-4 w-4 text-secondary-600" />
              <span className="text-sm font-medium text-secondary-700">
                Join 247 other parents waiting for books in this area
              </span>
            </div>
            <p className="text-xs text-secondary-600">
              We'll only email you when matching books are found. No spam, promise!
            </p>
          </div>

          {/* Multiple Alerts Option */}
          <div className="mt-4 text-center">
            <button className="text-accent-600 hover:text-accent-700 text-sm font-medium">
              + Set up alerts for other books
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};