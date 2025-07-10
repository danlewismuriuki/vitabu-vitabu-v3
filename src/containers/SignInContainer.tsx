// src/containers/SignInContainer.tsx
import React, { useState, useEffect } from "react";
import SignInForm from "../components/SignInForm";

interface SignInContainerProps {
  onLogin: (
    emailOrPhone: string,
    password: string,
    rememberMe: boolean
  ) => Promise<void>;
  onSocialLogin: (provider: "google" | "facebook") => Promise<void>;
  onSwitchMode: () => void;
}

const SignInContainer: React.FC<SignInContainerProps> = ({
  onLogin,
  onSocialLogin,
  onSwitchMode,
}) => {
  const [formData, setFormData] = useState({ emailOrPhone: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [savedUsernames, setSavedUsernames] = useState<string[]>([]);
  const [showUsernameDropdown, setShowUsernameDropdown] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [validation, setValidation] = useState({
    email: false,
    password: false,
  });

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem("vitabu_saved_usernames") || "[]"
    );
    setSavedUsernames(saved);
  }, []);

  const onInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: "" });

    if (field === "emailOrPhone") {
      const isValid =
        value.includes("@") ||
        value.startsWith("+254") ||
        value.startsWith("07") ||
        value.startsWith("01");
      setValidation((prev) => ({ ...prev, email: isValid }));
    } else if (field === "password") {
      setValidation((prev) => ({ ...prev, password: value.length >= 6 }));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Optional validation
    const newErrors: Record<string, string> = {};
    if (!formData.emailOrPhone) {
      newErrors.emailOrPhone = "Please enter your email or phone.";
    } else if (
      !formData.emailOrPhone.includes("@") &&
      !formData.emailOrPhone.startsWith("+254") &&
      !formData.emailOrPhone.startsWith("07") &&
      !formData.emailOrPhone.startsWith("01")
    ) {
      newErrors.emailOrPhone = "Enter a valid email or Kenyan phone number.";
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      await onLogin(formData.emailOrPhone, formData.password, rememberMe);

      if (rememberMe) {
        localStorage.setItem(
          "vitabu_saved_usernames",
          JSON.stringify([
            ...new Set([...savedUsernames, formData.emailOrPhone]),
          ])
        );
      }
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.code === "auth/invalid-email") {
        setErrors({ emailOrPhone: "Please enter a valid email address." });
      } else if (err.code === "auth/user-not-found") {
        setErrors({ emailOrPhone: "No account found with this email." });
      } else if (err.code === "auth/wrong-password") {
        setErrors({ password: "Incorrect password." });
      } else {
        setErrors({ general: "Login failed. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    setIsLoading(true);
    try {
      await onSocialLogin(provider);
    } catch (err: any) {
      console.error(err);
      setErrors({ general: err.message || "Social login failed" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SignInForm
      formData={formData}
      validation={validation}
      errors={errors}
      savedUsernames={savedUsernames}
      showUsernameDropdown={showUsernameDropdown}
      rememberMe={rememberMe}
      isLoading={isLoading}
      showPassword={showPassword}
      onInputChange={onInputChange}
      onLogin={handleLogin}
      onTogglePassword={() => setShowPassword((prev) => !prev)}
      onRememberMeChange={setRememberMe}
      onSocialLogin={handleSocialLogin}
      onUsernameDropdownToggle={setShowUsernameDropdown}
      onSwitchMode={onSwitchMode}
    />
  );
};
export default SignInContainer;
