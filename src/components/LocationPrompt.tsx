import React, { useState } from 'react';
import { MapPin, X, Loader2 } from 'lucide-react';

interface LocationPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSet: (location: { county: string; area: string; landmark?: string }) => void;
  title?: string;
  description?: string;
}

export const LocationPrompt: React.FC<LocationPromptProps> = ({
  isOpen,
  onClose,
  onLocationSet,
  title = "Set Your Delivery Location",
  description = "Help us show you books available in your area and estimate delivery options"
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [locationData, setLocationData] = useState({
    county: '',
    area: '',
    landmark: ''
  });

  if (!isOpen) return null;

  const kenyanCounties = [
    'Nairobi', 'Mombasa', 'Kiambu', 'Nakuru', 'Machakos', 'Kajiado', 'Murang\'a',
    'Kisumu', 'Uasin Gishu', 'Meru', 'Nyeri', 'Laikipia', 'Embu', 'Kakamega',
    'Kericho', 'Nyandarua', 'Kirinyaga', 'Nandi', 'Bomet', 'Kakamega'
  ];

  const requestCurrentLocation = () => {
    setIsLoading(true);
    setLocationError('');
    
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Simulate reverse geocoding to get location details
        setTimeout(() => {
          const mockLocation = {
            county: 'Nairobi',
            area: 'Kilimani',
            landmark: 'Near Yaya Centre'
          };
          setLocationData(mockLocation);
          setIsLoading(false);
        }, 2000);
      },
      (error) => {
        let errorMessage = 'Unable to get your location. ';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Location access was denied.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += 'An unknown error occurred.';
            break;
        }
        setLocationError(errorMessage + ' Please enter your location manually.');
        setIsLoading(false);
      },
      { 
        timeout: 10000, 
        enableHighAccuracy: true,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const handleSetLocation = () => {
    if (!locationData.county || !locationData.area) {
      alert('Please provide at least your county and area');
      return;
    }

    onLocationSet(locationData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-poppins font-bold text-primary-800">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <p className="text-neutral-600 mb-6">
            {description}
          </p>

          <div className="space-y-4">
            {/* Current Location Option */}
            <div className="p-4 border border-accent-200 rounded-lg bg-accent-50">
              <button
                onClick={requestCurrentLocation}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 text-accent-700 font-medium"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Getting your location...</span>
                  </>
                ) : (
                  <>
                    <MapPin className="h-5 w-5" />
                    <span>Use my current location</span>
                  </>
                )}
              </button>
              {locationError && (
                <p className="text-red-600 text-sm mt-2 text-center">{locationError}</p>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-neutral-500">or enter manually</span>
              </div>
            </div>

            {/* Manual Location Entry */}
            <div className="space-y-3">
              <select
                value={locationData.county}
                onChange={(e) => setLocationData(prev => ({ ...prev, county: e.target.value }))}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              >
                <option value="">Select County</option>
                {kenyanCounties.map(county => (
                  <option key={county} value={county}>{county}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Area/Suburb (e.g., Kilimani, Westlands)"
                value={locationData.area}
                onChange={(e) => setLocationData(prev => ({ ...prev, area: e.target.value }))}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              />

              <input
                type="text"
                placeholder="Optional: Landmark or School (e.g., Near Yaya Centre)"
                value={locationData.landmark}
                onChange={(e) => setLocationData(prev => ({ ...prev, landmark: e.target.value }))}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              />
            </div>

            {(locationData.county && locationData.area) && (
              <div className="p-3 bg-secondary-50 rounded-lg">
                <p className="text-sm text-secondary-700">
                  <strong>Selected location:</strong> {locationData.area}, {locationData.county}
                  {locationData.landmark && ` (${locationData.landmark})`}
                </p>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 btn-secondary"
              >
                Skip for now
              </button>
              <button
                onClick={handleSetLocation}
                disabled={!locationData.county || !locationData.area}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                Set Location
              </button>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-xs text-blue-700">
                💡 <strong>Why we need this:</strong> Your location helps us show books available near you, 
                suggest safe meetup spots, and estimate delivery costs. We never share your exact location with other users.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};