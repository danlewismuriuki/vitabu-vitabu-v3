// src/components/SignUpForm.tsx
import React from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Chrome,
  Facebook,
  Shield,
  Loader2,
} from "lucide-react";

interface PasswordRequirements {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

interface SignUpFormProps {
  formData: {
    username: string;
    emailOrPhone: string;
    password: string;
  };
  validation: {
    username: boolean;
    email: boolean;
    password: boolean;
  };
  passwordRequirements: PasswordRequirements;
  errors: {
    [key: string]: string;
  };
  isLoading: boolean;
  showPassword: boolean;
  onInputChange: (field: string, value: string) => void;
  onTogglePassword: () => void;
  onSignup: (e: React.FormEvent) => void;
  onSocialLogin: (provider: "google" | "facebook") => void;
}

const getInputType = (emailOrPhone: string) => {
  if (emailOrPhone.includes("@")) return "email";
  if (
    emailOrPhone.startsWith("+254") ||
    emailOrPhone.startsWith("07") ||
    emailOrPhone.startsWith("01")
  )
    return "tel";
  return "text";
};

const getPasswordStrength = (requirements: PasswordRequirements) => {
  const met = Object.values(requirements).filter(Boolean).length;
  if (met < 2) return { strength: "weak", color: "bg-red-500", width: "25%" };
  if (met < 4)
    return { strength: "medium", color: "bg-yellow-500", width: "50%" };
  if (met < 5) return { strength: "good", color: "bg-blue-500", width: "75%" };
  return { strength: "strong", color: "bg-green-500", width: "100%" };
};

const SignUpForm: React.FC<SignUpFormProps> = ({
  formData,
  validation,
  passwordRequirements,
  errors,
  isLoading,
  showPassword,
  onInputChange,
  onTogglePassword,
  onSignup,
  onSocialLogin,
}) => {
  const strength = getPasswordStrength(passwordRequirements);

  return (
    <form className="space-y-6" onSubmit={onSignup}>
      {/* Username */}
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
            onChange={(e) => onInputChange("username", e.target.value)}
            className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 ${
              errors.username
                ? "border-red-500"
                : validation.username
                ? "border-green-500"
                : "border-neutral-300"
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

      {/* Email or Phone */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Email or Phone Number *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {formData.emailOrPhone.includes("@") ? (
              <Mail className="h-5 w-5 text-neutral-400" />
            ) : (
              <Phone className="h-5 w-5 text-neutral-400" />
            )}
          </div>
          <input
            type={getInputType(formData.emailOrPhone)}
            value={formData.emailOrPhone}
            onChange={(e) => onInputChange("emailOrPhone", e.target.value)}
            className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 ${
              errors.emailOrPhone
                ? "border-red-500"
                : validation.email
                ? "border-green-500"
                : "border-neutral-300"
            }`}
            placeholder="your.email@example.com or +254712345678"
          />
          {validation.email && formData.emailOrPhone && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <Check className="h-5 w-5 text-green-500" />
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
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Password *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => onInputChange("password", e.target.value)}
            className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 ${
              errors.password
                ? "border-red-500"
                : validation.password
                ? "border-green-500"
                : "border-neutral-300"
            }`}
            placeholder="Create a strong password"
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

      {/* Password Strength */}
      {formData.password && (
        <div className="mt-3 p-3 bg-neutral-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-700">
              Password Strength
            </span>
            <span
              className={`text-xs font-medium ${
                strength.strength === "weak"
                  ? "text-red-600"
                  : strength.strength === "medium"
                  ? "text-yellow-600"
                  : strength.strength === "good"
                  ? "text-blue-600"
                  : "text-green-600"
              }`}
            >
              {strength.strength.toUpperCase()}
            </span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2 mb-3">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
              style={{ width: strength.width }}
            ></div>
          </div>
          <div className="grid grid-cols-1 gap-1 text-xs">
            {[
              { key: "length", label: "At least 8 characters" },
              { key: "uppercase", label: "One uppercase letter" },
              { key: "lowercase", label: "One lowercase letter" },
              { key: "number", label: "One number" },
              { key: "special", label: "One special character" },
            ].map((req) => (
              <div
                key={req.key}
                className={`flex items-center space-x-2 ${
                  passwordRequirements[req.key as keyof PasswordRequirements]
                    ? "text-green-600"
                    : "text-neutral-500"
                }`}
              >
                <Check
                  className={`h-3 w-3 ${
                    passwordRequirements[req.key as keyof PasswordRequirements]
                      ? "opacity-100"
                      : "opacity-30"
                  }`}
                />
                <span>{req.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Social login */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => onSocialLogin("google")}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-neutral-200 text-neutral-700 font-medium py-3 px-6 rounded-lg disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Chrome className="h-5 w-5" />
          )}
          <span>Continue with Google</span>
        </button>

        <button
          type="button"
          onClick={() => onSocialLogin("facebook")}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-3 bg-blue-600 text-white font-medium py-3 px-6 rounded-lg disabled:opacity-50"
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

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full btn-primary text-lg py-4 disabled:opacity-50 flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Creating Account...</span>
          </>
        ) : (
          <span>Sign Up</span>
        )}
      </button>
    </form>
  );
};

export default SignUpForm;
