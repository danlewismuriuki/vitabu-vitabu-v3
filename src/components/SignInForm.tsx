import React from "react";
import {
  Mail,
  Phone,
  Eye,
  EyeOff,
  AlertCircle,
  Facebook,
  Chrome,
  Loader2,
  BookOpen,
} from "lucide-react";

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
  onSocialLogin: (provider: "google" | "facebook") => void;
  onUsernameDropdownToggle: (show: boolean) => void;
  onSwitchMode: () => void;
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
  onSwitchMode,
}) => {
  // 🧠 Helper to detect input type based on the email/phone pattern
  const getInputType = (value: string): string => {
    if (value.includes("@")) return "email";
    if (
      value.startsWith("+254") ||
      value.startsWith("07") ||
      value.startsWith("01")
    ) {
      return "tel";
    }
    return "text";
  };

  return (
    <div className="space-y-6">
      {/* Login Form */}
      <form onSubmit={onLogin} className="space-y-4">
        {/* Email or Phone Input */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Email or Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {getInputType(formData.emailOrPhone) === "email" ? (
                <Mail className="h-5 w-5 text-neutral-400" />
              ) : (
                <Phone className="h-5 w-5 text-neutral-400" />
              )}
            </div>
            <input
              type={getInputType(formData.emailOrPhone)}
              value={formData.emailOrPhone}
              onChange={(e) => onInputChange("emailOrPhone", e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 ${
                errors.emailOrPhone ? "border-red-500" : "border-neutral-300"
              }`}
              placeholder="your.email@example.com or +254712345678"
            />
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
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => onInputChange("password", e.target.value)}
              className={`w-full pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 ${
                errors.password ? "border-red-500" : "border-neutral-300"
              }`}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-neutral-400" />
              ) : (
                <Eye className="h-5 w-5 text-neutral-400" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.password}</span>
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Signing In...</span>
            </div>
          ) : (
            "Log In"
          )}
        </button>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => onRememberMeChange(e.target.checked)}
              className="rounded border-neutral-300 text-accent-600 focus:ring-accent-500"
            />
            <span className="text-sm text-neutral-700">
              Remember me (7 days)
            </span>
          </label>
          <button
            type="button"
            className="text-sm text-accent-600 hover:text-accent-700 font-medium"
          >
            Forgot password?
          </button>
        </div>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-neutral-500">
            or continue with
          </span>
        </div>
      </div>

      {/* Social Buttons */}
      <div className="space-y-3">
        <button
          onClick={() => onSocialLogin("google")}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-neutral-200 hover:border-neutral-300 text-neutral-700 font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
        >
          <Chrome className="h-5 w-5" />
          <span>Continue with Google</span>
        </button>

        <button
          onClick={() => onSocialLogin("facebook")}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
        >
          <Facebook className="h-5 w-5" />
          <span>Continue with Facebook</span>
        </button>
      </div>
    </div>
  );
};

export default SignInForm;
