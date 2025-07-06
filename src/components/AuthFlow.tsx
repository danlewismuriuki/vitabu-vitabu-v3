// src/components/AuthFlow.tsx
import React, { useState } from "react";
import { BookOpen, X } from "lucide-react";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

interface AuthFlowProps {
  mode: "login" | "signup";
  onClose: () => void;
  onAuthSuccess: (user: any) => void;
}

const AuthFlow: React.FC<AuthFlowProps> = ({
  mode: initialMode,
  onClose,
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [formData, setFormData] = useState({
    username: "",
    emailOrPhone: "",
    password: "",
  });

  const [validation, setValidation] = useState({
    username: false,
    email: false,
    password: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showUsernameDropdown, setShowUsernameDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [savedUsernames] = useState<string[]>([
    "jane.doe@gmail.com",
    "+254712345678",
  ]);

  const passwordRequirements = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password),
    special: /[^A-Za-z0-9]/.test(formData.password),
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "emailOrPhone") {
      const isValidEmail = /\S+@\S+\.\S+/.test(value);
      const isValidPhone = /^\+?\d{10,}$/.test(value);
      setValidation((prev) => ({
        ...prev,
        email: isValidEmail || isValidPhone,
      }));
    }

    if (field === "username") {
      setValidation((prev) => ({ ...prev, username: value.length >= 3 }));
    }

    if (field === "password") {
      const passValid = Object.values(passwordRequirements).every(Boolean);
      setValidation((prev) => ({ ...prev, password: passValid }));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.emailOrPhone || !formData.password) {
      setErrors({
        emailOrPhone: !formData.emailOrPhone ? "This field is required" : "",
        password: !formData.password ? "This field is required" : "",
      });
      setIsLoading(false);
      return;
    }

    onAuthSuccess({ username: formData.emailOrPhone });
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.username || !formData.emailOrPhone || !formData.password) {
      setErrors({
        username: !formData.username ? "Username is required" : "",
        emailOrPhone: !formData.emailOrPhone
          ? "Email or phone is required"
          : "",
        password: !formData.password ? "Password is required" : "",
      });
      setIsLoading(false);
      return;
    }

    onAuthSuccess({
      username: formData.username,
      email: formData.emailOrPhone,
    });
    setIsLoading(false);
  };

  const handleSocialLogin = (provider: "google" | "facebook") => {
    console.log(`Logging in with ${provider}`);
  };

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

          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <BookOpen className="h-8 w-8 text-accent-500" />
              <h1 className="text-2xl font-bold text-primary-800">
                Vitabu Vitabu
              </h1>
            </div>
            <h2 className="text-xl font-semibold text-primary-700 mb-2">
              {mode === "login" ? "Welcome Back!" : "Join Our Community"}
            </h2>
            <p className="text-neutral-600">
              {mode === "login"
                ? "Sign in to continue saving money on school books"
                : "Start saving money and helping other parents today"}
            </p>
          </div>

          {/* Auth Form */}
          <div className="mt-6">
            {mode === "login" ? (
              <SignInForm
                formData={formData}
                validation={validation}
                errors={errors}
                rememberMe={rememberMe}
                savedUsernames={savedUsernames}
                showUsernameDropdown={showUsernameDropdown}
                showPassword={showPassword}
                isLoading={isLoading}
                onInputChange={handleInputChange}
                onLogin={handleLogin}
                onTogglePassword={() => setShowPassword(!showPassword)}
                onRememberMeChange={setRememberMe}
                onSocialLogin={handleSocialLogin}
                onUsernameDropdownToggle={setShowUsernameDropdown}
              />
            ) : (
              <SignUpForm
                formData={formData}
                validation={validation}
                passwordRequirements={passwordRequirements}
                errors={errors}
                isLoading={isLoading}
                showPassword={showPassword}
                onInputChange={handleInputChange}
                onTogglePassword={() => setShowPassword(!showPassword)}
                onSignup={handleSignup}
                onSocialLogin={handleSocialLogin}
              />
            )}
          </div>

          {/* Switch Link */}
          <div className="text-center text-sm text-neutral-600 mt-4">
            {mode === "login" ? (
              <p>
                Don’t have an account?{" "}
                <button
                  onClick={() => setMode("signup")}
                  className="text-accent-600 hover:text-accent-700 font-medium"
                >
                  Sign up for free
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-accent-600 hover:text-accent-700 font-medium"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>

          {/* Terms */}
          <div className="text-center text-xs text-neutral-500 mt-2">
            By continuing, you agree to our{" "}
            <a href="#" className="text-accent-600 hover:text-accent-700">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-accent-600 hover:text-accent-700">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthFlow;
