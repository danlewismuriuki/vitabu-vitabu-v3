import React, { useState } from "react";
import {
  X,
  Facebook,
  Phone,
  Mail,
  MapPin,
  Loader2,
  ShoppingBag,
  Store,
  BookOpen,
  Camera,
  DollarSign,
  Chrome,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (
    email: string,
    password: string,
    rememberMe: boolean
  ) => Promise<void>;
  onSignup: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  onSocialLogin: (provider: "google" | "facebook") => Promise<void>;
  initialMode?: "login" | "signup";
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onSignup,
  onSocialLogin,
  initialMode = "login",
}) => {
  const [authMode, setAuthMode] = useState<"login" | "signup">(initialMode);
  const [signupStep, setSignupStep] = useState<
    "initial" | "form" | "verification"
  >("initial");
  const [signupMethod, setSignupMethod] = useState<"email" | "phone" | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    emailOrPhone: "",
    password: "",
    otp: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  // Helper functions
  const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);
  const isValidPhone = (value: string) =>
    /^\+?254[0-9]{9}$|^0[0-9]{9}$/.test(value);
  const getInputType = (value: string) => {
    if (isValidEmail(value)) return "email";
    if (
      value.startsWith("+254") ||
      value.startsWith("07") ||
      value.startsWith("01")
    )
      return "phone";
    return "text";
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (authMode === "login") {
      if (!formData.emailOrPhone) {
        newErrors.emailOrPhone = "Email or phone number is required";
      } else if (
        !isValidEmail(formData.emailOrPhone) &&
        !isValidPhone(formData.emailOrPhone)
      ) {
        newErrors.emailOrPhone = "Please enter a valid email or phone number";
      }
      if (!formData.password) {
        newErrors.password = "Password is required";
      }
    } else if (authMode === "signup" && signupStep === "form") {
      if (!formData.username || formData.username.length < 3) {
        newErrors.username = "Username must be at least 3 characters";
      }
      if (!formData.emailOrPhone) {
        newErrors.emailOrPhone = "Email or phone number is required";
      } else if (
        !isValidEmail(formData.emailOrPhone) &&
        !isValidPhone(formData.emailOrPhone)
      ) {
        newErrors.emailOrPhone = "Please enter a valid email or phone number";
      }
      if (!formData.password || formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onLogin(formData.emailOrPhone, formData.password, rememberMe);
      onClose();
    } catch (err) {
      setErrors({ password: "Login failed. Please check your credentials." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    setIsLoading(true);
    try {
      await onSocialLogin(provider);
      onClose();
    } catch (err) {
      console.error("Social login failed", err);
      // optionally show a message
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupInitial = () => {
    setSignupStep("form");
  };

  const handleSignupForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setSignupMethod(isValidEmail(formData.emailOrPhone) ? "email" : "phone");

    // Simulate API call
    setTimeout(() => {
      setSignupStep("verification");
      setIsLoading(false);
    }, 1500);
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      signupMethod === "phone" &&
      (!formData.otp || formData.otp.length !== 6)
    ) {
      setErrors({ otp: "Please enter a valid 6-digit code" });
      return;
    }

    setIsLoading(true);

    // Simulate verification
    setTimeout(() => {
      const mockUser = {
        id: "new_user_123",
        name: formData.username,
        email: formData.emailOrPhone,
        role: "buyer",
        location: "Nairobi",
      };

      const expiryTime = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem("vitabu_auth_token", "new_token_123");
      localStorage.setItem("vitabu_token_expiry", expiryTime.toString());
      localStorage.setItem("vitabu_user", JSON.stringify(mockUser));

      setIsLoading(false);
      onClose();
    }, 1500);
  };

  const resetForm = () => {
    setFormData({ username: "", emailOrPhone: "", password: "", otp: "" });
    setErrors({});
    setSignupStep("initial");
    setSignupMethod(null);
    setIsLoading(false);
    setShowPassword(false);
    setRememberMe(false);
  };

  const switchMode = (mode: "login" | "signup") => {
    setAuthMode(mode);
    resetForm();
  };

  // Render Login Form
  const renderLogin = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <BookOpen className="h-8 w-8 text-accent-500" />
          <h1 className="text-2xl font-poppins font-bold text-primary-800">
            Vitabu Vitabu
          </h1>
        </div>
        <h2 className="text-xl font-poppins font-semibold text-primary-700 mb-2">
          Welcome Back!
        </h2>
        <p className="text-neutral-600">
          Sign in to continue saving money on school books
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
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
              onChange={(e) =>
                handleInputChange("emailOrPhone", e.target.value)
              }
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

        {/* Password Input */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className={`w-full pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 ${
                errors.password ? "border-red-500" : "border-neutral-300"
              }`}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
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

        {/* Log In Button */}
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
              onChange={(e) => setRememberMe(e.target.checked)}
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

      {/* Social Login */}
      <div className="space-y-3">
        <button
          onClick={() => handleSocialLogin("google")}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-neutral-200 hover:border-neutral-300 text-neutral-700 font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
        >
          <Chrome className="h-5 w-5" />
          <span>Continue with Google</span>
        </button>

        <button
          onClick={() => handleSocialLogin("facebook")}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
        >
          <Facebook className="h-5 w-5" />
          <span>Continue with Facebook</span>
        </button>
      </div>

      {/* Sign Up Link */}
      <div className="text-center space-y-2">
        <p className="text-sm text-neutral-600">
          Don't have an account?{" "}
          <button
            onClick={() => switchMode("signup")}
            className="text-accent-600 hover:text-accent-700 font-medium"
          >
            Sign up for free
          </button>
        </p>
        <p className="text-xs text-neutral-500">
          By continuing, you agree to our{" "}
          <a href="#" className="text-accent-600 hover:text-accent-700">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-accent-600 hover:text-accent-700">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );

  // Render Signup Initial Screen
  const renderSignupInitial = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <BookOpen className="h-8 w-8 text-accent-500" />
          <h1 className="text-2xl font-poppins font-bold text-primary-800">
            Vitabu Vitabu
          </h1>
        </div>
        <h2 className="text-xl font-poppins font-semibold text-primary-700 mb-2">
          Join Our Community
        </h2>
        <p className="text-neutral-600">
          Start saving money and helping other parents today
        </p>
      </div>

      <div className="space-y-4">
        {/* Primary Signup Button */}
        <button
          onClick={handleSignupInitial}
          disabled={isLoading}
          className="w-full btn-primary py-4 text-lg font-semibold"
        >
          Continue with Email or Phone
        </button>

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

        {/* Social Login */}
        <div className="space-y-3">
          <button
            onClick={() => handleSocialLogin("google")}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-neutral-200 hover:border-neutral-300 text-neutral-700 font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
          >
            <Chrome className="h-5 w-5" />
            <span>Continue with Google</span>
          </button>

          <button
            onClick={() => handleSocialLogin("facebook")}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
          >
            <Facebook className="h-5 w-5" />
            <span>Continue with Facebook</span>
          </button>
        </div>
      </div>

      {/* Login Link */}
      <div className="text-center">
        <p className="text-sm text-neutral-600">
          Already have an account?{" "}
          <button
            onClick={() => switchMode("login")}
            className="text-accent-600 hover:text-accent-700 font-medium"
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );

  // Render Signup Form
  const renderSignupForm = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-poppins font-semibold text-primary-700 mb-2">
          Create Your Account
        </h2>
        <p className="text-neutral-600">
          Just a few details to get you started
        </p>
      </div>

      <form onSubmit={handleSignupForm} className="space-y-4">
        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Username
          </label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => handleInputChange("username", e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 ${
              errors.username ? "border-red-500" : "border-neutral-300"
            }`}
            placeholder="Choose a username"
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.username}</span>
            </p>
          )}
        </div>

        {/* Email or Phone */}
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
              onChange={(e) =>
                handleInputChange("emailOrPhone", e.target.value)
              }
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
            Create Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className={`w-full pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 ${
                errors.password ? "border-red-500" : "border-neutral-300"
              }`}
              placeholder="Create a secure password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
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

        {/* Sign Up Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Creating Account...</span>
            </div>
          ) : (
            "Sign Up"
          )}
        </button>
      </form>

      {/* Back Button */}
      <div className="text-center">
        <button
          onClick={() => setSignupStep("initial")}
          className="text-sm text-accent-600 hover:text-accent-700 font-medium"
        >
          ← Back to options
        </button>
      </div>
    </div>
  );

  // Render Verification Screen
  const renderVerification = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-poppins font-semibold text-primary-700 mb-2">
          {signupMethod === "phone" ? "Verify Your Phone" : "Check Your Email"}
        </h2>
        <p className="text-neutral-600">
          {signupMethod === "phone"
            ? `We sent a 6-digit code to ${formData.emailOrPhone}`
            : `We sent a verification link to ${formData.emailOrPhone}`}
        </p>
      </div>

      {signupMethod === "phone" ? (
        <form onSubmit={handleVerification} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Verification Code
            </label>
            <input
              type="text"
              value={formData.otp}
              onChange={(e) =>
                handleInputChange(
                  "otp",
                  e.target.value.replace(/\D/g, "").slice(0, 6)
                )
              }
              className={`w-full px-4 py-3 text-center text-2xl font-mono border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 ${
                errors.otp ? "border-red-500" : "border-neutral-300"
              }`}
              placeholder="000000"
              maxLength={6}
            />
            {errors.otp && (
              <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.otp}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || formData.otp.length !== 6}
            className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Verifying...</span>
              </div>
            ) : (
              "Verify & Complete"
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              className="text-sm text-accent-600 hover:text-accent-700 font-medium"
            >
              Didn't receive the code? Resend
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto">
            <Mail className="h-8 w-8 text-accent-600" />
          </div>
          <div className="space-y-2">
            <p className="text-neutral-700">
              Click the verification link in your email to complete your account
              setup.
            </p>
            <p className="text-sm text-neutral-500">
              Check your spam folder if you don't see it in your inbox.
            </p>
          </div>
          <button
            onClick={() =>
              handleVerification({ preventDefault: () => {} } as any)
            }
            disabled={isLoading}
            className="btn-primary px-6 py-3"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Checking...</span>
              </div>
            ) : (
              "I've verified my email"
            )}
          </button>
        </div>
      )}

      {/* Back Button */}
      <div className="text-center">
        <button
          onClick={() => setSignupStep("form")}
          className="text-sm text-accent-600 hover:text-accent-700 font-medium"
        >
          ← Back to form
        </button>
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
          {authMode === "login" && renderLogin()}
          {authMode === "signup" &&
            signupStep === "initial" &&
            renderSignupInitial()}
          {authMode === "signup" && signupStep === "form" && renderSignupForm()}
          {authMode === "signup" &&
            signupStep === "verification" &&
            renderVerification()}
        </div>
      </div>
    </div>
  );
};
