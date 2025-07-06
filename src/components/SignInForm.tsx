// src/components/SignInForm.tsx
import React from 'react';
import { Mail, Phone, Lock, Eye, EyeOff, Check, AlertCircle, Facebook, Chrome, Shield, Loader2 } from 'lucide-react';

interface SignInFormProps {
  formData: {
    emailOrPhone: string;
    password: string;
  };
  validation: {
    email: boolean;
    password: boolean;
  };
  errors: {
    [key: string]: string;
  };
  savedUsernames: string[];
  showUsernameDropdown: boolean;
  rememberMe: boolean;
  isLoading: boolean;
  showPassword: boolean;
  onInputChange: (field: string, value: string) => void;
  onLogin: (e: React.FormEvent) => void;
  onTogglePassword: () => void;
  onRememberMeChange: (checked: boolean) => void;
  onSocialLogin: (provider: 'google' | 'facebook') => void;
  onUsernameDropdownToggle: (show: boolean) => void;
}

const SignInForm: React.FC<SignInFormProps> = ({
  formData,
  validation,
  errors,
  savedUsernames,
  showUsernameDropdown,
  rememberMe,
  isLoading,
  showPassword,
  onInputChange,
  onLogin,
  onTogglePassword,
  onRememberMeChange,
  onSocialLogin,
  onUsernameDropdownToggle,
}) => {
  const getInputType = () => {
    if (formData.emailOrPhone.includes('@')) return 'email';
    if (formData.emailOrPhone.startsWith('+254') || formData.emailOrPhone.startsWith('07') || formData.emailOrPhone.startsWith('01')) return 'tel';
    return 'text';
  };

  return (
    <form className="space-y-6" onSubmit={onLogin}>
      {/* Email or Phone */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">Email or Phone Number *</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {formData.emailOrPhone.includes('@') ? <Mail className="h-5 w-5 text-neutral-400" /> : <Phone className="h-5 w-5 text-neutral-400" />}
          </div>
          <input
            type={getInputType()}
            value={formData.emailOrPhone}
            onChange={(e) => onInputChange('emailOrPhone', e.target.value)}
            onFocus={() => onUsernameDropdownToggle(savedUsernames.length > 0)}
            onBlur={() => setTimeout(() => onUsernameDropdownToggle(false), 200)}
            className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 ${
              errors.emailOrPhone
                ? 'border-red-500'
                : validation.email && formData.emailOrPhone
                ? 'border-green-500'
                : 'border-neutral-300'
            }`}
            placeholder="your.email@example.com or +254712345678"
          />
          {validation.email && formData.emailOrPhone && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <Check className="h-5 w-5 text-green-500" />
            </div>
          )}

          {/* Username dropdown */}
          {showUsernameDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg z-10">
              <div className="p-2 border-b border-neutral-100">
                <p className="text-xs text-neutral-500">Previously used accounts</p>
              </div>
              {savedUsernames.map((username, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => onInputChange('emailOrPhone', username)}
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
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">Password *</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => onInputChange('password', e.target.value)}
            className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 ${
              errors.password
                ? 'border-red-500'
                : validation.password && formData.password
                ? 'border-green-500'
                : 'border-neutral-300'
            }`}
            placeholder="Enter your password"
          />
          <button type="button" onClick={onTogglePassword} className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {showPassword ? <EyeOff className="h-5 w-5 text-neutral-400" /> : <Eye className="h-5 w-5 text-neutral-400" />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
            <AlertCircle className="h-4 w-4" />
            <span>{errors.password}</span>
          </p>
        )}
      </div>

      {/* Remember me */}
      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => onRememberMeChange(e.target.checked)}
            className="rounded border-neutral-300 text-accent-600 focus:ring-accent-500"
          />
          <span className="text-sm text-neutral-700">Remember me (7 days)</span>
        </label>
        <button type="button" className="text-sm text-accent-600 hover:text-accent-700">Forgot password?</button>
      </div>

      {/* Social login */}
      <div className="space-y-3">
        <button
          onClick={() => onSocialLogin('google')}
          disabled={isLoading}
          type="button"
          className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-neutral-200 text-neutral-700 font-medium py-3 px-6 rounded-lg disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Chrome className="h-5 w-5" />}
          <span>Continue with Google</span>
        </button>

        <button
          onClick={() => onSocialLogin('facebook')}
          disabled={isLoading}
          type="button"
          className="w-full flex items-center justify-center space-x-3 bg-blue-600 text-white font-medium py-3 px-6 rounded-lg disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Facebook className="h-5 w-5" />}
          <span>Continue with Facebook</span>
        </button>

        <div className="text-center text-xs text-neutral-500">
          <Shield className="h-3 w-3 inline mr-1" />
          We never post to your social media or share your data
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full btn-primary text-lg py-4 disabled:opacity-50 flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Logging In...</span>
          </>
        ) : (
          <span>Log In</span>
        )}
      </button>
    </form>
  );
};

export default SignInForm;
