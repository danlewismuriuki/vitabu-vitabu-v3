import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase";
import SignUpForm from "../components/SignUpForm";
import { useNavigate } from "react-router-dom";

const SignUpContainer = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    emailOrPhone: "",
    password: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [validation, setValidation] = useState({
    username: false,
    email: false,
    password: false,
  });

  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const onInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));

    if (field === "username") {
      const isValid = value.trim().length >= 3;
      setValidation((prev) => ({ ...prev, username: isValid }));
    }

    if (field === "emailOrPhone") {
      const isValid = value.includes("@");
      setValidation((prev) => ({ ...prev, email: isValid }));
    }

    if (field === "password") {
      const length = value.length >= 6;
      const uppercase = /[A-Z]/.test(value);
      const lowercase = /[a-z]/.test(value);
      const number = /\d/.test(value);
      const special = /[!@#$%^&*(),.?":{}|<>]/.test(value);

      setValidation((prev) => ({ ...prev, password: length }));

      setPasswordRequirements({
        length,
        uppercase,
        lowercase,
        number,
        special,
      });
    }
  };

  const onTogglePassword = () => setShowPassword((prev) => !prev);

  const onSocialLogin = async (provider: "google" | "facebook") => {
    const selectedProvider =
      provider === "google"
        ? new GoogleAuthProvider()
        : new FacebookAuthProvider();

    try {
      setIsLoading(true);
      await signInWithPopup(auth, selectedProvider);
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Social signup error:", error);
      setErrors({ general: error.message || "Social signup failed" });
    } finally {
      setIsLoading(false);
    }
  };

  const onSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const { emailOrPhone, password, username } = formData;

      const userCred = await createUserWithEmailAndPassword(
        auth,
        emailOrPhone,
        password
      );

      await updateProfile(userCred.user, { displayName: username });

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Signup error:", error);
      setErrors({ general: error.message || "Signup failed" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SignUpForm
      formData={formData}
      onInputChange={onInputChange}
      onSignup={onSignup}
      isLoading={isLoading}
      errors={errors}
      validation={validation}
      passwordRequirements={passwordRequirements}
      showPassword={showPassword}
      onTogglePassword={onTogglePassword}
      onSocialLogin={onSocialLogin}
    />
  );
};

export default SignUpContainer;
