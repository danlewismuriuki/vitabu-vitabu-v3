import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { auth } from "../firebase";
import SignInForm from "../components/SignInForm";
import { useNavigate } from "react-router-dom";

const SignInContainer = () => {
  const navigate = useNavigate();

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

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      // Set auth persistence BEFORE signing in
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );

      const userCred = await signInWithEmailAndPassword(
        auth,
        formData.emailOrPhone,
        formData.password
      );

      const user = userCred.user;

      if (rememberMe) {
        localStorage.setItem(
          "vitabu_saved_usernames",
          JSON.stringify([
            ...new Set([...savedUsernames, formData.emailOrPhone]),
          ])
        );
      }

      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);
      setErrors({ general: err.message || "Login failed" });
    } finally {
      setIsLoading(false);
    }
  };

  const onTogglePassword = () => setShowPassword((prev) => !prev);

  const onRememberMeChange = (checked: boolean) => setRememberMe(checked);

  const onSocialLogin = async (provider: "google" | "facebook") => {
    const selectedProvider =
      provider === "google"
        ? new GoogleAuthProvider()
        : new FacebookAuthProvider();

    try {
      setIsLoading(true);

      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );

      await signInWithPopup(auth, selectedProvider);

      navigate("/dashboard");
    } catch (error: any) {
      console.error(error);
      setErrors({ general: error.message || "Social login failed" });
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
      onLogin={onLogin}
      onTogglePassword={onTogglePassword}
      onRememberMeChange={onRememberMeChange}
      onSocialLogin={onSocialLogin}
      onUsernameDropdownToggle={setShowUsernameDropdown}
    />
  );
};

export default SignInContainer;
