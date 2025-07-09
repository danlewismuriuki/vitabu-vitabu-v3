import React, { useState } from "react";
import { BookOpen, X } from "lucide-react";
import SignInContainer from "../containers/SignInContainer";
import SignUpContainer from "../containers/SignUpContainer";

interface AuthFlowProps {
  isOpen: boolean;
  initialMode: "login" | "signup";
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
}

const AuthFlow: React.FC<AuthFlowProps> = ({
  initialMode,
  onClose,
  onLogin,
  onSignup,
  onSocialLogin,
}) => {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);

  React.useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[95vh] overflow-y-auto">
        <div className="p-6">
          {/* Close */}
          <div className="flex justify-end mb-4">
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-600"
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

          {/* Form */}
          <div className="mt-6">
            {mode === "login" ? (
              <SignInContainer
                onLogin={onLogin}
                onSocialLogin={onSocialLogin}
                onSwitchMode={() => setMode("signup")}
              />
            ) : (
              <SignUpContainer
                onSignup={onSignup}
                onSocialLogin={onSocialLogin}
                onVerify={async () => {}}
                onComplete={() => setMode("login")}
                onSwitchToLogin={() => setMode("login")}
              />
            )}
          </div>

          {/* Switch */}
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
