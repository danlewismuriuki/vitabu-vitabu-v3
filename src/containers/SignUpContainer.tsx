// src/containers/SignUpContainer.tsx
import React, { useState } from "react";
import SignUpForm from "../components/SignUpForm";

interface SignUpContainerProps {
  onSignup: (
    username: string,
    emailOrPhone: string,
    password: string
  ) => Promise<void>;
  onVerify: (otp: string) => Promise<void>;
  onSocialLogin: (provider: "google" | "facebook") => Promise<void>;
  onComplete: () => void;
  onSwitchToLogin: () => void;
}

const SignUpContainer: React.FC<SignUpContainerProps> = ({
  onSignup,
  onVerify,
  onSocialLogin,
  onComplete,
  onSwitchToLogin,
}) => {
  const [step, setStep] = useState<"intro" | "form" | "verification">("intro");
  const [signupMethod, setSignupMethod] = useState<"email" | "phone" | null>(
    null
  );
  const [formData, setFormData] = useState({
    username: "",
    emailOrPhone: "",
    password: "",
    otp: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);
  const isValidPhone = (value: string) =>
    /^\+?254[0-9]{9}$|^0[0-9]{9}$/.test(value);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const startSignup = () => {
    setStep("form");
  };

  const submitSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate form
    const newErrors: Record<string, string> = {};
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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Determine signup method
    const method = isValidEmail(formData.emailOrPhone) ? "email" : "phone";
    setSignupMethod(method);

    try {
      await onSignup(
        formData.username,
        formData.emailOrPhone,
        formData.password
      );
      setStep("verification");
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setErrors({
          emailOrPhone: "This email is already in use. Try logging in.",
        });
      } else {
        setErrors({ general: "Signup failed. Please try again." });
        console.error("Signup error:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.otp || formData.otp.length !== 6) {
      setErrors({ otp: "Please enter a valid 6-digit code" });
      return;
    }

    setIsLoading(true);
    try {
      await onVerify(formData.otp);
      onComplete();
    } catch (err) {
      setErrors({ otp: "Verification failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = async (provider: "google" | "facebook") => {
    setIsLoading(true);
    try {
      await onSocialLogin(provider);
      onComplete();
    } catch (err) {
      setErrors({ general: "Social signup failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SignUpForm
      step={step}
      signupMethod={signupMethod}
      formData={formData}
      errors={errors}
      isLoading={isLoading}
      onInputChange={handleInputChange}
      onSignupStart={startSignup}
      onSignupSubmit={submitSignup}
      onVerification={verifyAccount}
      onSocialSignup={handleSocialSignup}
      onSwitchToLogin={onSwitchToLogin}
    />
  );
};

export default SignUpContainer;
