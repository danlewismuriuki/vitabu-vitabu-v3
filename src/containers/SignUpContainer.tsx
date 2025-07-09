// import React, { useState } from "react";
// import SignUpForm from "../components/SignUpForm";

// interface SignUpContainerProps {
//   onSignup: (
//     username: string,
//     email: string,
//     password: string
//   ) => Promise<void>;
//   onSocialLogin: (provider: "google" | "facebook") => Promise<void>;
// }

// const SignUpContainer: React.FC<SignUpContainerProps> = ({
//   onSignup,
//   onSocialLogin,
// }) => {
//   const [formData, setFormData] = useState({
//     username: "",
//     emailOrPhone: "",
//     password: "",
//   });

//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const [validation, setValidation] = useState({
//     username: false,
//     email: false,
//     password: false,
//   });

//   const [passwordRequirements, setPasswordRequirements] = useState({
//     length: false,
//     uppercase: false,
//     lowercase: false,
//     number: false,
//     special: false,
//   });

//   const onInputChange = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//     setErrors((prev) => ({ ...prev, [field]: "" }));

//     if (field === "username") {
//       const isValid = value.trim().length >= 3;
//       setValidation((prev) => ({ ...prev, username: isValid }));
//     }

//     if (field === "emailOrPhone") {
//       const isValid = value.includes("@");
//       setValidation((prev) => ({ ...prev, email: isValid }));
//     }

//     if (field === "password") {
//       const length = value.length >= 6;
//       const uppercase = /[A-Z]/.test(value);
//       const lowercase = /[a-z]/.test(value);
//       const number = /\d/.test(value);
//       const special = /[!@#$%^&*(),.?":{}|<>]/.test(value);

//       setValidation((prev) => ({ ...prev, password: length }));

//       setPasswordRequirements({
//         length,
//         uppercase,
//         lowercase,
//         number,
//         special,
//       });
//     }
//   };

//   const onTogglePassword = () => setShowPassword((prev) => !prev);

//   const handleSignup = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setErrors({});

//     const { username, emailOrPhone, password } = formData;

//     try {
//       await onSignup(username, emailOrPhone, password);
//     } catch (error: any) {
//       console.error("Signup error:", error);
//       setErrors({ general: error.message || "Signup failed" });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSocialLogin = async (provider: "google" | "facebook") => {
//     try {
//       setIsLoading(true);
//       await onSocialLogin(provider);
//     } catch (error: any) {
//       console.error("Social signup error:", error);
//       setErrors({ general: error.message || "Social signup failed" });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <SignUpForm
//       formData={formData}
//       onInputChange={onInputChange}
//       onSignup={handleSignup}
//       isLoading={isLoading}
//       errors={errors}
//       validation={validation}
//       passwordRequirements={passwordRequirements}
//       showPassword={showPassword}
//       onTogglePassword={onTogglePassword}
//       onSocialLogin={handleSocialLogin}
//     />
//   );
// };

// export default SignUpContainer;

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
  onSocialSignup: (provider: "google" | "facebook") => Promise<void>;
  onComplete: () => void;
  onSwitchToLogin: () => void;
}

const SignUpContainer: React.FC<SignUpContainerProps> = ({
  onSignup,
  onVerify,
  onSocialSignup,
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
    } catch (err) {
      setErrors({ general: "Signup failed. Please try again." });
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
      await onSocialSignup(provider);
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
