import React, { useState } from 'react';
import { X, Facebook, Phone, Mail, MapPin, Loader2, ShoppingBag, Store, BookOpen, Camera, DollarSign } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [authStep, setAuthStep] = useState<'role-selection' | 'signup' | 'phone-verify' | 'preferences' | 'seller-setup'>('role-selection');
  const [userRole, setUserRole] = useState<'buyer' | 'seller' | null>(null);
  const [signupMethod, setSignupMethod] = useState<'facebook' | 'phone' | 'email' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    otp: '',
    password: '',
    confirmPassword: ''
  });
  const [preferences, setPreferences] = useState({
    childGrades: [] as number[],
    subjects: [] as string[],
    location: { county: '', area: '', landmark: '' },
    notifications: {
      priceDrops: true,
      newListings: true,
      swapMatches: true
    }
  });
  const [sellerData, setSellerData] = useState({
    bio: '',
    deliveryMethods: [] as string[],
    estimatedEarnings: 0
  });
  const [locationError, setLocationError] = useState('');

  if (!isOpen) return null;

  const kenyanCounties = [
    'Nairobi', 'Mombasa', 'Kiambu', 'Nakuru', 'Machakos', 'Kajiado', 'Murang\'a',
    'Kisumu', 'Uasin Gishu', 'Meru', 'Nyeri', 'Laikipia', 'Embu', 'Kakamega'
  ];

  const subjects = [
    'Mathematics', 'English', 'Kiswahili', 'Science', 'Social Studies', 
    'Religious Education', 'Creative Arts', 'Physical Education'
  ];

  const deliveryOptions = [
    'Meet in person', 'Home delivery', 'School pickup', 'Public meetup spots'
  ];

  const handleRoleSelection = (role: 'buyer' | 'seller') => {
    setUserRole(role);
    setAuthStep('signup');
  };

  const handleFacebookSignup = async () => {
    setIsLoading(true);
    setSignupMethod('facebook');
    
    // Simulate Facebook OAuth flow
    setTimeout(() => {
      const mockFacebookUser = {
        id: 'fb_123',
        name: 'Mary Wanjiku',
        email: 'mary@facebook.com',
        profilePicture: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100',
        signupMethod: 'facebook'
      };
      setFormData(prev => ({ ...prev, name: mockFacebookUser.name, email: mockFacebookUser.email }));
      setAuthStep(userRole === 'seller' ? 'seller-setup' : 'preferences');
      setIsLoading(false);
    }, 2000);
  };

  const handlePhoneSignup = async () => {
    if (!formData.phone || !formData.name) {
      alert('Please fill in all required fields');
      return;
    }
    
    setIsLoading(true);
    setSignupMethod('phone');
    
    // Simulate sending OTP
    setTimeout(() => {
      setAuthStep('phone-verify');
      setIsLoading(false);
    }, 1500);
  };

  const handleOTPVerification = async () => {
    if (!formData.otp || formData.otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate OTP verification
    setTimeout(() => {
      setAuthStep(userRole === 'seller' ? 'seller-setup' : 'preferences');
      setIsLoading(false);
    }, 1500);
  };

  const handleEmailSignup = async () => {
    if (!formData.email || !formData.name || !formData.password || formData.password !== formData.confirmPassword) {
      alert('Please fill in all fields correctly');
      return;
    }
    
    setIsLoading(true);
    setSignupMethod('email');
    
    // Simulate email signup
    setTimeout(() => {
      setAuthStep(userRole === 'seller' ? 'seller-setup' : 'preferences');
      setIsLoading(false);
    }, 1500);
  };

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
        // Simulate reverse geocoding
        setTimeout(() => {
          setPreferences(prev => ({
            ...prev,
            location: {
              county: 'Nairobi',
              area: 'Kilimani',
              landmark: 'Near Yaya Centre'
            }
          }));
          setIsLoading(false);
        }, 2000);
      },
      (error) => {
        setLocationError('Unable to get your location. Please enter manually.');
        setIsLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleCompleteSignup = () => {
    if (!preferences.location.county || !preferences.location.area) {
      alert('Please provide your location information');
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: userRole,
      location: `${preferences.location.area}, ${preferences.location.county}`,
      signupMethod,
      profilePicture: signupMethod === 'facebook' ? 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100' : undefined,
      preferences: userRole === 'buyer' ? preferences : undefined,
      sellerData: userRole === 'seller' ? sellerData : undefined
    };

    onAuthSuccess(newUser);
    onClose();
  };

  const renderRoleSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <BookOpen className="h-8 w-8 text-accent-500" />
          <h1 className="text-2xl font-poppins font-bold text-primary-800">Vitabu Vitabu</h1>
        </div>
        <h2 className="text-xl font-poppins font-semibold text-primary-700 mb-2">
          What brings you here today?
        </h2>
        <p className="text-neutral-600">
          Choose your path to start saving money on school books
        </p>
      </div>

      <div className="space-y-4">
        {/* Buyer Option */}
        <button
          onClick={() => handleRoleSelection('buyer')}
          className="w-full p-6 border-2 border-neutral-200 rounded-xl hover:border-accent-500 hover:bg-accent-50 transition-all duration-200 text-left group"
        >
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-accent-100 rounded-lg group-hover:bg-accent-200 transition-colors">
              <ShoppingBag className="h-6 w-6 text-accent-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-poppins font-semibold text-primary-800 mb-2">
                I want to Buy Books
              </h3>
              <p className="text-neutral-600 text-sm mb-3">
                Find affordable used textbooks for your child's grade and subjects
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-secondary-100 text-secondary-700 px-2 py-1 rounded">Save up to 70%</span>
                <span className="text-xs bg-accent-100 text-accent-700 px-2 py-1 rounded">Local sellers</span>
                <span className="text-xs bg-gold-100 text-gold-700 px-2 py-1 rounded">Swap options</span>
              </div>
            </div>
          </div>
        </button>

        {/* Seller Option */}
        <button
          onClick={() => handleRoleSelection('seller')}
          className="w-full p-6 border-2 border-neutral-200 rounded-xl hover:border-secondary-500 hover:bg-secondary-50 transition-all duration-200 text-left group"
        >
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-secondary-100 rounded-lg group-hover:bg-secondary-200 transition-colors">
              <Store className="h-6 w-6 text-secondary-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-poppins font-semibold text-primary-800 mb-2">
                I want to Sell Books
              </h3>
              <p className="text-neutral-600 text-sm mb-3">
                Turn your used textbooks into cash and help other parents save money
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-secondary-100 text-secondary-700 px-2 py-1 rounded">Earn KES 6,000+</span>
                <span className="text-xs bg-accent-100 text-accent-700 px-2 py-1 rounded">Easy listing</span>
                <span className="text-xs bg-gold-100 text-gold-700 px-2 py-1 rounded">Trusted buyers</span>
              </div>
            </div>
          </div>
        </button>
      </div>

      <p className="text-xs text-center text-neutral-500 mt-6">
        Don't worry - you can always switch between buying and selling later!
      </p>
    </div>
  );

  const renderSignupOptions = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-poppins font-bold text-primary-800 mb-2">
          {userRole === 'buyer' ? '📚 Join as a Book Buyer' : '💰 Join as a Book Seller'}
        </h2>
        <p className="text-neutral-600">
          {userRole === 'buyer' 
            ? 'Start saving money on your child\'s textbooks today'
            : 'Turn your unused books into cash and help other parents'
          }
        </p>
      </div>

      {/* Facebook Signup */}
      <button
        onClick={handleFacebookSignup}
        disabled={isLoading}
        className="w-full flex items-center justify-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50"
      >
        {isLoading && signupMethod === 'facebook' ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Facebook className="h-5 w-5" />
        )}
        <span>Continue with Facebook</span>
        <span className="text-xs bg-blue-500 px-2 py-1 rounded">Fastest</span>
      </button>

      {/* Phone Signup */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3">
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
          />
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="tel"
              placeholder="Phone Number (e.g., +254 7XX XXX XXX)"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
            />
          </div>
        </div>
        <button
          onClick={handlePhoneSignup}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-2 bg-secondary-600 hover:bg-secondary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50"
        >
          {isLoading && signupMethod === 'phone' ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Phone className="h-5 w-5" />
          )}
          <span>Sign up with Phone Number</span>
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-neutral-500">or</span>
        </div>
      </div>

      {/* Email Signup */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3">
          {!formData.name && (
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
            />
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
            />
          </div>
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
          />
        </div>
        <button
          onClick={handleEmailSignup}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-2 bg-neutral-600 hover:bg-neutral-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50"
        >
          {isLoading && signupMethod === 'email' ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Mail className="h-5 w-5" />
          )}
          <span>Sign up with Email</span>
        </button>
      </div>

      <button
        onClick={() => setAuthStep('role-selection')}
        className="w-full text-accent-600 hover:text-accent-700 text-sm mt-4"
      >
        ← Back to role selection
      </button>
    </div>
  );

  const renderPhoneVerification = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-poppins font-bold text-primary-800 mb-2">
          Verify Your Phone
        </h2>
        <p className="text-neutral-600">
          We sent a 6-digit code to {formData.phone}
        </p>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={formData.otp}
          onChange={(e) => setFormData(prev => ({ ...prev, otp: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
          className="w-full px-4 py-3 text-center text-2xl font-mono border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
          maxLength={6}
        />

        <button
          onClick={handleOTPVerification}
          disabled={isLoading || formData.otp.length !== 6}
          className="w-full btn-primary disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Verifying...</span>
            </div>
          ) : (
            'Verify & Continue'
          )}
        </button>

        <button
          onClick={() => setAuthStep('signup')}
          className="w-full text-accent-600 hover:text-accent-700 text-sm"
        >
          ← Back to signup options
        </button>
      </div>
    </div>
  );

  const renderBuyerPreferences = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-poppins font-bold text-primary-800 mb-2">
          Let's personalize your experience
        </h2>
        <p className="text-neutral-600">
          Help us show you the most relevant books for your child
        </p>
      </div>

      <div className="space-y-6">
        {/* Child's Grade */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-3">
            What grade(s) are you looking for? (Select all that apply)
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(grade => (
              <button
                key={grade}
                onClick={() => {
                  setPreferences(prev => ({
                    ...prev,
                    childGrades: prev.childGrades.includes(grade)
                      ? prev.childGrades.filter(g => g !== grade)
                      : [...prev.childGrades, grade]
                  }));
                }}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  preferences.childGrades.includes(grade)
                    ? 'border-accent-500 bg-accent-50 text-accent-700'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                Grade {grade}
              </button>
            ))}
          </div>
        </div>

        {/* Subjects */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-3">
            Which subjects are you most interested in?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {subjects.map(subject => (
              <button
                key={subject}
                onClick={() => {
                  setPreferences(prev => ({
                    ...prev,
                    subjects: prev.subjects.includes(subject)
                      ? prev.subjects.filter(s => s !== subject)
                      : [...prev.subjects, subject]
                  }));
                }}
                className={`p-3 rounded-lg border-2 transition-colors text-sm ${
                  preferences.subjects.includes(subject)
                    ? 'border-accent-500 bg-accent-50 text-accent-700'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-3">
            Where are you located?
          </label>
          
          <div className="space-y-3">
            {/* Current Location Option */}
            <div className="p-3 border border-accent-200 rounded-lg bg-accent-50">
              <button
                onClick={requestCurrentLocation}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 text-accent-700 font-medium"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Getting your location...</span>
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4" />
                    <span>Use my current location</span>
                  </>
                )}
              </button>
              {locationError && (
                <p className="text-red-600 text-xs mt-2 text-center">{locationError}</p>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-neutral-500">or enter manually</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <select
                value={preferences.location.county}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  location: { ...prev.location, county: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              >
                <option value="">Select County</option>
                {kenyanCounties.map(county => (
                  <option key={county} value={county}>{county}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Area/Suburb (e.g., Kilimani)"
                value={preferences.location.area}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  location: { ...prev.location, area: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-3">
            Get notified about:
          </label>
          <div className="space-y-2">
            {[
              { key: 'priceDrops', label: 'Price drops on books you\'re watching' },
              { key: 'newListings', label: 'New books in your grade/subject' },
              { key: 'swapMatches', label: 'Potential book swap matches' }
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={preferences.notifications[key as keyof typeof preferences.notifications]}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    notifications: {
                      ...prev.notifications,
                      [key]: e.target.checked
                    }
                  }))}
                  className="rounded border-neutral-300 text-accent-600 focus:ring-accent-500"
                />
                <span className="text-sm text-neutral-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleCompleteSignup}
          disabled={!preferences.location.county || !preferences.location.area}
          className="w-full btn-primary disabled:opacity-50"
        >
          Complete Setup & Start Browsing
        </button>

        <div className="bg-secondary-50 p-4 rounded-lg">
          <p className="text-sm text-secondary-700">
            🎉 <strong>Welcome bonus:</strong> Get alerts for your first 5 book matches for free!
          </p>
        </div>
      </div>
    </div>
  );

  const renderSellerSetup = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-poppins font-bold text-primary-800 mb-2">
          Set up your seller profile
        </h2>
        <p className="text-neutral-600">
          Let's get you ready to start earning from your books
        </p>
      </div>

      <div className="space-y-6">
        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-3">
            Where are you located?
          </label>
          
          <div className="space-y-3">
            <div className="p-3 border border-accent-200 rounded-lg bg-accent-50">
              <button
                onClick={requestCurrentLocation}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 text-accent-700 font-medium"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Getting your location...</span>
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4" />
                    <span>Use my current location</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <select
                value={preferences.location.county}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  location: { ...prev.location, county: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              >
                <option value="">Select County</option>
                {kenyanCounties.map(county => (
                  <option key={county} value={county}>{county}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Area/Suburb"
                value={preferences.location.area}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  location: { ...prev.location, area: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              />
            </div>
          </div>
        </div>

        {/* Seller Bio */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-3">
            Tell buyers about yourself (optional)
          </label>
          <textarea
            placeholder="e.g., Parent of 2 kids, selling books they've outgrown. All books well-maintained and from smoke-free home."
            value={sellerData.bio}
            onChange={(e) => setSellerData(prev => ({ ...prev, bio: e.target.value }))}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
            rows={3}
          />
        </div>

        {/* Delivery Methods */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-3">
            How would you prefer to deliver books?
          </label>
          <div className="grid grid-cols-1 gap-2">
            {deliveryOptions.map(option => (
              <button
                key={option}
                onClick={() => {
                  setSellerData(prev => ({
                    ...prev,
                    deliveryMethods: prev.deliveryMethods.includes(option)
                      ? prev.deliveryMethods.filter(m => m !== option)
                      : [...prev.deliveryMethods, option]
                  }));
                }}
                className={`p-3 rounded-lg border-2 transition-colors text-sm text-left ${
                  sellerData.deliveryMethods.includes(option)
                    ? 'border-accent-500 bg-accent-50 text-accent-700'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Earnings Estimate */}
        <div className="bg-gold-50 p-4 rounded-lg border border-gold-200">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="h-5 w-5 text-gold-600" />
            <h3 className="font-medium text-gold-800">Potential Earnings</h3>
          </div>
          <p className="text-sm text-gold-700 mb-3">
            Based on average book prices in your area, you could earn:
          </p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white p-2 rounded">
              <div className="font-bold text-gold-800">KES 2,000</div>
              <div className="text-xs text-gold-600">5-10 books</div>
            </div>
            <div className="bg-white p-2 rounded">
              <div className="font-bold text-gold-800">KES 6,000</div>
              <div className="text-xs text-gold-600">15-20 books</div>
            </div>
            <div className="bg-white p-2 rounded">
              <div className="font-bold text-gold-800">KES 12,000+</div>
              <div className="text-xs text-gold-600">30+ books</div>
            </div>
          </div>
        </div>

        <button
          onClick={handleCompleteSignup}
          disabled={!preferences.location.county || !preferences.location.area}
          className="w-full btn-primary disabled:opacity-50"
        >
          Complete Setup & List Your First Book
        </button>

        <div className="bg-secondary-50 p-4 rounded-lg">
          <p className="text-sm text-secondary-700">
            🚀 <strong>Seller bonus:</strong> List your first book within 24 hours and get featured placement for free!
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="w-6"></div>
            <div className="text-center">
              {authStep !== 'role-selection' && (
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">VV</span>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {authStep === 'role-selection' && renderRoleSelection()}
          {authStep === 'signup' && renderSignupOptions()}
          {authStep === 'phone-verify' && renderPhoneVerification()}
          {authStep === 'preferences' && userRole === 'buyer' && renderBuyerPreferences()}
          {authStep === 'seller-setup' && userRole === 'seller' && renderSellerSetup()}
        </div>
      </div>
    </div>
  );
};