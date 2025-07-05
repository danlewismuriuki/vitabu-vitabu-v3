import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Mail, Phone, User, Lock, Check, AlertCircle, Facebook, Chrome, Shield, Heart, BookOpen, Users, DollarSign, ArrowRight, Loader2 } from 'lucide-react';

interface AuthFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: any) => void;
  initialMode?: 'login' | 'signup';
}

interface ValidationState {
  email: boolean;
  password: boolean;
  username: boolean;
}

interface PasswordRequirements {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

export const AuthFlow: React.FC<AuthFlowProps> = ({ 
  isOpen, 
  onClose, 
  onAuthSuccess,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'welcome'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    emailOrPhone: '',
    password: ''
  });
  const [validation, setValidation] = useState<ValidationState>({
    email: false,
    password: false,
    username: false
  });
  const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirements>({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [savedUsernames, setSavedUsernames] = useState<string[]>([]);
  const [showUsernameDropdown, setShowUsernameDropdown] = useState(false);

  // Load saved usernames on mount
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('vitabu_saved_usernames');
      if (saved) {
        setSavedUsernames(JSON.parse(saved));
      }
    }
  }, [isOpen]);

  // Real-time validation - removed error clearing logic to prevent infinite loop
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(\+254|0)[17]\d{8}$/;
    
    setValidation({
      email: emailRegex.test(formData.emailOrPhone) || phoneRegex.test(formData.emailOrPhone),
      password: formData.password.length >= 8,
      username: formData.username.length >= 3
    });

    // Password requirements
    setPasswordRequirements({
      length: formData.password.length >= 8,
      uppercase: /[A-Z]/.test(formData.password),
      lowercase: /[a-z]/.test(formData.password),
      number: /\d/.test(formData.password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
    });
  }, [formData]); // Only depend on formData, not errors

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear errors when user starts typing - moved here to prevent infinite loop
    if (errors[field] && value) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.emailOrPhone) {
      newErrors.emailOrPhone = 'Email or phone number is required';
    } else if (!validation.email) {
      newErrors.emailOrPhone = 'Please enter a valid email or Kenyan phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (mode === 'signup' && !validation.password) {
      newErrors.password = 'Password must meet all requirements';
    }

    if (mode === 'signup' && !formData.username) {
      newErrors.username = 'Username is required';
    } else if (mode === 'signup' && !validation.username) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveUsername = (username: string) => {
    const obscured = username.includes('@') 
      ? username.replace(/(.{2}).*(@.*)/, '$1***$2')
      : username.replace(/(.{2}).*/, '$1***');
    
    const updated = [obscured, ...savedUsernames.filter(u => u !== obscured)].slice(0, 3);
    setSavedUsernames(updated);
    localStorage.setItem('vitabu_saved_usernames', JSON.stringify(updated));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (mode === 'login') {
      // Save username if remember me is checked
      if (rememberMe) {
        saveUsername(formData.emailOrPhone);
      }

      // Mock successful login
      const user = {
        id: Date.now().toString(),
        name: 'Mary Wanjiku',
        email: formData.emailOrPhone.includes('@') ? formData.emailOrPhone : 'user@example.com',
        phone: formData.emailOrPhone.includes('@') ? '+254712345678' : formData.emailOrPhone,
        role: 'buyer',
        location: 'Nairobi',
        profilePicture: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100'
      };

      // Generate token with TTL based on remember me
      const tokenTTL = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 7 days or 24 hours
      const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      localStorage.setItem('vitabu_auth_token', token);
      localStorage.setItem('vitabu_token_expiry', (Date.now() + tokenTTL).toString());
      localStorage.setItem('vitabu_user', JSON.stringify(user));

      onAuthSuccess(user);
      onClose();
    } else {
      // For signup, show welcome screen first
      setMode('welcome');
    }

    setIsLoading(false);
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setIsLoading(true);
    
    // Simulate social login
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const user = {
      id: Date.now().toString(),
      name: provider === 'google' ? 'John Doe' : 'Mary Wanjiku',
      email: provider === 'google' ? 'john@gmail.com' : 'mary@facebook.com',
      role: 'buyer',
      location: 'Nairobi',
      profilePicture: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100',
      signupMethod: provider
    };

    const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const tokenTTL = 24 * 60 * 60 * 1000; // 24 hours default
    
    localStorage.setItem('vitabu_auth_token', token);
    localStorage.setItem('vitabu_token_expiry', (Date.now() + tokenTTL).toString());
    localStorage.setItem('vitabu_user', JSON.stringify(user));

    onAuthSuccess(user);
    onClose();
    setIsLoading(false);
  };

  const completeSignup = () => {
    // Save username
    saveUsername(formData.emailOrPhone);

    const user = {
      id: Date.now().toString(),
      name: formData.username,
      email: formData.emailOrPhone.includes('@') ? formData.emailOrPhone : 'user@example.com',
      phone: formData.emailOrPhone.includes('@') ? '+254712345678' : formData.emailOrPhone,
      role: 'buyer',
      location: 'Nairobi'
    };

    const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const tokenTTL = 24 * 60 * 60 * 1000; // 24 hours default
    
    localStorage.setItem('vitabu_auth_token', token);
    localStorage.setItem('vitabu_token_expiry', (Date.now() + tokenTTL).toString());
    localStorage.setItem('vitabu_user', JSON.stringify(user));

    onAuthSuccess(user);
    onClose();
  };

  const getInputType = () => {
    if (formData.emailOrPhone.includes('@')) return 'email';
    if (formData.emailOrPhone.startsWith('+254') || formData.emailOrPhone.startsWith('07') || formData.emailOrPhone.startsWith('01')) return 'tel';
    return 'text';
  };

  const getPasswordStrength = () => {
    const requirements = Object.values(passwordRequirements);
    const met = requirements.filter(Boolean).length;
    if (met < 2) return { strength: 'weak', color: 'bg-red-500', width: '25%' };
    if (met < 4) return { strength: 'medium', color: 'bg-yellow-500', width: '50%' };
    if (met < 5) return { strength: 'good', color: 'bg-blue-500', width: '75%' };
    return { strength: 'strong', color: 'bg-green-500', width: '100%' };
  };

  const renderWelcomeScreen = () => (
    <div className="space-y-8">
      {/* Success Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="p-4 bg-green-100 rounded-full">
            <Check className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <h2 className="text-3xl font-poppins font-bold text-primary-800 mb-4">
          🎉 Welcome to Vitabu Vitabu!
        </h2>
        <p className="text-lg text-neutral-600 mb-6">
          Your account has been created successfully. You're now part of Kenya's largest book-sharing community!
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-6 bg-secondary-50 rounded-xl">
          <div className="p-3 bg-secondary-100 rounded-full w-fit mx-auto mb-4">
            <DollarSign className="h-6 w-6 text-secondary-600" />
          </div>
          <h3 className="font-poppins font-semibold text-primary-800 mb-2">Save Money</h3>
          <p className="text-sm text-neutral-600">Save up to 70% on school books compared to buying new</p>
        </div>

        <div className="text-center p-6 bg-accent-50 rounded-xl">
          <div className="p-3 bg-accent-100 rounded-full w-fit mx-auto mb-4">
            <Users className="h-6 w-6 text-accent-600" />
          </div>
          <h3 className="font-poppins font-semibold text-primary-800 mb-2">Build Community</h3>
          <p className="text-sm text-neutral-600">Connect with other parents in your area</p>
        </div>

        <div className="text-center p-6 bg-gold-50 rounded-xl">
          <div className="p-3 bg-gold-100 rounded-full w-fit mx-auto mb-4">
            <Heart className="h-6 w-6 text-gold-600" />
          </div>
          <h3 className="font-poppins font-semibold text-primary-800 mb-2">Help Others</h3>
          <p className="text-sm text-neutral-600">Turn unused books into resources for other families</p>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-gradient-to-r from-accent-500 to-secondary-500 rounded-xl p-6 text-white">
        <h3 className="text-xl font-poppins font-bold mb-4">What's Next?</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">1</span>
            </div>
            <span>Browse thousands of available books in your area</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">2</span>
            </div>
            <span>List your unused books to help other parents</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">3</span>
            </div>
            <span>Start saving money and building connections</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <button
          onClick={completeSignup}
          className="btn-primary text-lg px-8 py-4 flex items-center space-x-2 mx-auto"
        >
          <span>Start Exploring Books</span>
          <ArrowRight className="h-5 w-5" />
        </button>
        <p className="text-sm text-neutral-500 mt-4">
          You can update your preferences and profile anytime in settings
        </p>
      </div>
    </div>
  );

  const renderAuthForm = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <BookOpen className="h-8 w-8 text-accent-500" />
          <h1 className="text-2xl font-poppins font-bold text-primary-800">Vitabu Vitabu</h1>
        </div>
        <h2 className="text-xl font-poppins font-semibold text-primary-700 mb-2">
          {mode === 'login' ? 'Welcome Back!' : 'Join Our Community'}
        </h2>
        <p className="text-neutral-600">
          {mode === 'login' 
            ? 'Sign in to continue saving money on school books'
            : 'Start saving money and helping other parents today'
          }
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex bg-neutral-100 rounded-lg p-1">
        <button
          onClick={() => setMode('login')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            mode === 'login' 
              ? 'bg-white text-primary-700 shadow-sm' 
              : 'text-neutral-600 hover:text-neutral-800'
          }`}
        >
          Log In
        </button>
        <button
          onClick={() => setMode('signup')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            mode === 'signup' 
              ? 'bg-white text-primary-700 shadow-sm' 
              : 'text-neutral-600 hover:text-neutral-800'
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Social Login */}
      <div className="space-y-3">
        <button
          onClick={() => handleSocialLogin('google')}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-neutral-200 hover:border-neutral-300 text-neutral-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Chrome className="h-5 w-5" />
          )}
          <span>Continue with Google</span>
        </button>

        <button
          onClick={() => handleSocialLogin('facebook')}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Facebook className="h-5 w-5" />
          )}
          <span>Continue with Facebook</span>
        </button>

        <div className="text-center text-xs text-neutral-500">
          <Shield className="h-3 w-3 inline mr-1" />
          We never post to your social media or share your data
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-neutral-500">or continue with email/phone</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username (Signup only) */}
        {mode === 'signup' && (
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Username *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 ${
                  errors.username ? 'border-red-500' : validation.username && formData.username ? 'border-green-500' : 'border-neutral-300'
                }`}
                placeholder="Choose a username"
              />
              {validation.username && formData.username && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
              )}
            </div>
            {errors.username && (
              <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.username}</span>
              </p>
            )}
          </div>
        )}

        {/* Email or Phone */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Email or Phone Number *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {formData.emailOrPhone.includes('@') ? (
                <Mail className="h-5 w-5 text-neutral-400" />
              ) : (
                <Phone className="h-5 w-5 text-neutral-400" />
              )}
            </div>
            <input
              type={getInputType()}
              value={formData.emailOrPhone}
              onChange={(e) => handleInputChange('emailOrPhone', e.target.value)}
              onFocus={() => setShowUsernameDropdown(savedUsernames.length > 0 && mode === 'login')}
              onBlur={() => setTimeout(() => setShowUsernameDropdown(false), 200)}
              className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 ${
                errors.emailOrPhone ? 'border-red-500' : validation.email && formData.emailOrPhone ? 'border-green-500' : 'border-neutral-300'
              }`}
              placeholder="your.email@example.com or +254712345678"
            />
            {validation.email && formData.emailOrPhone && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <Check className="h-5 w-5 text-green-500" />
              </div>
            )}
            
            {/* Saved Usernames Dropdown */}
            {showUsernameDropdown && savedUsernames.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg z-10">
                <div className="p-2 border-b border-neutral-100">
                  <p className="text-xs text-neutral-500">Previously used accounts</p>
                </div>
                {savedUsernames.map((username, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      handleInputChange('emailOrPhone', username);
                      setShowUsernameDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-neutral-50 text-sm"
                  >
                    {username}
                  </button>
                ))}
              </div>
            )}
          </div>
          {errors.emailOrPhone && (
            <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.emailOrPhone}</span>
            </p>
          )}
          {formData.emailOrPhone && !formData.emailOrPhone.includes('@') && (
            <p className="mt-1 text-xs text-neutral-500">
              💡 Use format: +254712345678 or 0712345678
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Password *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 ${
                errors.password ? 'border-red-500' : validation.password && formData.password ? 'border-green-500' : 'border-neutral-300'
              }`}
              placeholder={mode === 'login' ? 'Enter your password' : 'Create a strong password'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-neutral-400 hover:text-neutral-600" />
              ) : (
                <Eye className="h-5 w-5 text-neutral-400 hover:text-neutral-600" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.password}</span>
            </p>
          )}

          {/* Password Requirements (Signup only) */}
          {mode === 'signup' && formData.password && (
            <div className="mt-3 p-3 bg-neutral-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-neutral-700">Password Strength</span>
                <span className={`text-xs font-medium ${
                  getPasswordStrength().strength === 'weak' ? 'text-red-600' :
                  getPasswordStrength().strength === 'medium' ? 'text-yellow-600' :
                  getPasswordStrength().strength === 'good' ? 'text-blue-600' :
                  'text-green-600'
                }`}>
                  {getPasswordStrength().strength.toUpperCase()}
                </span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2 mb-3">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrength().color}`}
                  style={{ width: getPasswordStrength().width }}
                ></div>
              </div>
              <div className="grid grid-cols-1 gap-1 text-xs">
                {[
                  { key: 'length', label: 'At least 8 characters' },
                  { key: 'uppercase', label: 'One uppercase letter' },
                  { key: 'lowercase', label: 'One lowercase letter' },
                  { key: 'number', label: 'One number' },
                  { key: 'special', label: 'One special character' }
                ].map(req => (
                  <div key={req.key} className={`flex items-center space-x-2 ${
                    passwordRequirements[req.key as keyof PasswordRequirements] ? 'text-green-600' : 'text-neutral-500'
                  }`}>
                    <Check className={`h-3 w-3 ${
                      passwordRequirements[req.key as keyof PasswordRequirements] ? 'opacity-100' : 'opacity-30'
                    }`} />
                    <span>{req.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Remember Me (Login only) */}
        {mode === 'login' && (
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-neutral-300 text-accent-600 focus:ring-accent-500"
              />
              <span className="text-sm text-neutral-700">Remember me (7 days)</span>
            </label>
            <button
              type="button"
              className="text-sm text-accent-600 hover:text-accent-700"
            >
              Forgot password?
            </button>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !validateForm()}
          className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>{mode === 'login' ? 'Signing In...' : 'Creating Account...'}</span>
            </>
          ) : (
            <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="text-center text-sm text-neutral-600">
        {mode === 'login' ? (
          <p>
            Don't have an account?{' '}
            <button
              onClick={() => setMode('signup')}
              className="text-accent-600 hover:text-accent-700 font-medium"
            >
              Sign up for free
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <button
              onClick={() => setMode('login')}
              className="text-accent-600 hover:text-accent-700 font-medium"
            >
              Sign in here
            </button>
          </p>
        )}
      </div>

      {/* Terms */}
      <div className="text-center text-xs text-neutral-500">
        By continuing, you agree to our{' '}
        <a href="#" className="text-accent-600 hover:text-accent-700">Terms of Service</a>
        {' '}and{' '}
        <a href="#" className="text-accent-600 hover:text-accent-700">Privacy Policy</a>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[95vh] overflow-y-auto">
        <div className="p-6">
          {/* Close Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          {mode === 'welcome' ? renderWelcomeScreen() : renderAuthForm()}
        </div>
      </div>
    </div>
  );
};