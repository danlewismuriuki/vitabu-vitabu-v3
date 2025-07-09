// // src/components/SignUpForm.tsx
// import React from "react";
// import {
//   User,
//   Mail,
//   Phone,
//   Lock,
//   Eye,
//   EyeOff,
//   Check,
//   AlertCircle,
//   Chrome,
//   Facebook,
//   Shield,
//   Loader2,
// } from "lucide-react";

// interface PasswordRequirements {
//   length: boolean;
//   uppercase: boolean;
//   lowercase: boolean;
//   number: boolean;
//   special: boolean;
// }

// interface SignUpFormProps {
//   formData: {
//     username: string;
//     emailOrPhone: string;
//     password: string;
//   };
//   validation: {
//     username: boolean;
//     email: boolean;
//     password: boolean;
//   };
//   passwordRequirements: PasswordRequirements;
//   errors: {
//     [key: string]: string;
//   };
//   isLoading: boolean;
//   showPassword: boolean;
//   onInputChange: (field: string, value: string) => void;
//   onTogglePassword: () => void;
//   onSignup: (e: React.FormEvent) => void;
//   onSocialLogin: (provider: "google" | "facebook") => void;
// }

// const getInputType = (emailOrPhone: string) => {
//   if (emailOrPhone.includes("@")) return "email";
//   if (
//     emailOrPhone.startsWith("+254") ||
//     emailOrPhone.startsWith("07") ||
//     emailOrPhone.startsWith("01")
//   )
//     return "tel";
//   return "text";
// };

// const getPasswordStrength = (requirements: PasswordRequirements) => {
//   const met = Object.values(requirements).filter(Boolean).length;
//   if (met < 2) return { strength: "weak", color: "bg-red-500", width: "25%" };
//   if (met < 4)
//     return { strength: "medium", color: "bg-yellow-500", width: "50%" };
//   if (met < 5) return { strength: "good", color: "bg-blue-500", width: "75%" };
//   return { strength: "strong", color: "bg-green-500", width: "100%" };
// };

// const SignUpForm: React.FC<SignUpFormProps> = ({
//   formData,
//   validation,
//   passwordRequirements,
//   errors,
//   isLoading,
//   showPassword,
//   onInputChange,
//   onTogglePassword,
//   onSignup,
//   onSocialLogin,
// }) => {
//   const strength = getPasswordStrength(passwordRequirements);

//   return (
//     <form className="space-y-6" onSubmit={onSignup}>
//       {/* Username */}
//       <div>
//         <label className="block text-sm font-medium text-neutral-700 mb-2">
//           Username *
//         </label>
//         <div className="relative">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <User className="h-5 w-5 text-neutral-400" />
//           </div>
//           <input
//             type="text"
//             value={formData.username}
//             onChange={(e) => onInputChange("username", e.target.value)}
//             className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 ${
//               errors.username
//                 ? "border-red-500"
//                 : validation.username
//                 ? "border-green-500"
//                 : "border-neutral-300"
//             }`}
//             placeholder="Choose a username"
//           />
//           {validation.username && formData.username && (
//             <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
//               <Check className="h-5 w-5 text-green-500" />
//             </div>
//           )}
//         </div>
//         {errors.username && (
//           <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
//             <AlertCircle className="h-4 w-4" />
//             <span>{errors.username}</span>
//           </p>
//         )}
//       </div>

//       {/* Email or Phone */}
//       <div>
//         <label className="block text-sm font-medium text-neutral-700 mb-2">
//           Email or Phone Number *
//         </label>
//         <div className="relative">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             {formData.emailOrPhone.includes("@") ? (
//               <Mail className="h-5 w-5 text-neutral-400" />
//             ) : (
//               <Phone className="h-5 w-5 text-neutral-400" />
//             )}
//           </div>
//           <input
//             type={getInputType(formData.emailOrPhone)}
//             value={formData.emailOrPhone}
//             onChange={(e) => onInputChange("emailOrPhone", e.target.value)}
//             className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 ${
//               errors.emailOrPhone
//                 ? "border-red-500"
//                 : validation.email
//                 ? "border-green-500"
//                 : "border-neutral-300"
//             }`}
//             placeholder="your.email@example.com or +254712345678"
//           />
//           {validation.email && formData.emailOrPhone && (
//             <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
//               <Check className="h-5 w-5 text-green-500" />
//             </div>
//           )}
//         </div>
//         {errors.emailOrPhone && (
//           <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
//             <AlertCircle className="h-4 w-4" />
//             <span>{errors.emailOrPhone}</span>
//           </p>
//         )}
//       </div>

//       {/* Password */}
//       <div>
//         <label className="block text-sm font-medium text-neutral-700 mb-2">
//           Password *
//         </label>
//         <div className="relative">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <Lock className="h-5 w-5 text-neutral-400" />
//           </div>
//           <input
//             type={showPassword ? "text" : "password"}
//             value={formData.password}
//             onChange={(e) => onInputChange("password", e.target.value)}
//             className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 ${
//               errors.password
//                 ? "border-red-500"
//                 : validation.password
//                 ? "border-green-500"
//                 : "border-neutral-300"
//             }`}
//             placeholder="Create a strong password"
//           />
//           <button
//             type="button"
//             onClick={onTogglePassword}
//             className="absolute inset-y-0 right-0 pr-3 flex items-center"
//           >
//             {showPassword ? (
//               <EyeOff className="h-5 w-5 text-neutral-400" />
//             ) : (
//               <Eye className="h-5 w-5 text-neutral-400" />
//             )}
//           </button>
//         </div>
//         {errors.password && (
//           <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
//             <AlertCircle className="h-4 w-4" />
//             <span>{errors.password}</span>
//           </p>
//         )}
//       </div>

//       {/* Password Strength */}
//       {formData.password && (
//         <div className="mt-3 p-3 bg-neutral-50 rounded-lg">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-sm font-medium text-neutral-700">
//               Password Strength
//             </span>
//             <span
//               className={`text-xs font-medium ${
//                 strength.strength === "weak"
//                   ? "text-red-600"
//                   : strength.strength === "medium"
//                   ? "text-yellow-600"
//                   : strength.strength === "good"
//                   ? "text-blue-600"
//                   : "text-green-600"
//               }`}
//             >
//               {strength.strength.toUpperCase()}
//             </span>
//           </div>
//           <div className="w-full bg-neutral-200 rounded-full h-2 mb-3">
//             <div
//               className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
//               style={{ width: strength.width }}
//             ></div>
//           </div>
//           <div className="grid grid-cols-1 gap-1 text-xs">
//             {[
//               { key: "length", label: "At least 8 characters" },
//               { key: "uppercase", label: "One uppercase letter" },
//               { key: "lowercase", label: "One lowercase letter" },
//               { key: "number", label: "One number" },
//               { key: "special", label: "One special character" },
//             ].map((req) => (
//               <div
//                 key={req.key}
//                 className={`flex items-center space-x-2 ${
//                   passwordRequirements[req.key as keyof PasswordRequirements]
//                     ? "text-green-600"
//                     : "text-neutral-500"
//                 }`}
//               >
//                 <Check
//                   className={`h-3 w-3 ${
//                     passwordRequirements[req.key as keyof PasswordRequirements]
//                       ? "opacity-100"
//                       : "opacity-30"
//                   }`}
//                 />
//                 <span>{req.label}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Social login */}
//       <div className="space-y-3">
//         <button
//           type="button"
//           onClick={() => onSocialLogin("google")}
//           disabled={isLoading}
//           className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-neutral-200 text-neutral-700 font-medium py-3 px-6 rounded-lg disabled:opacity-50"
//         >
//           {isLoading ? (
//             <Loader2 className="h-5 w-5 animate-spin" />
//           ) : (
//             <Chrome className="h-5 w-5" />
//           )}
//           <span>Continue with Google</span>
//         </button>

//         <button
//           type="button"
//           onClick={() => onSocialLogin("facebook")}
//           disabled={isLoading}
//           className="w-full flex items-center justify-center space-x-3 bg-blue-600 text-white font-medium py-3 px-6 rounded-lg disabled:opacity-50"
//         >
//           {isLoading ? (
//             <Loader2 className="h-5 w-5 animate-spin" />
//           ) : (
//             <Facebook className="h-5 w-5" />
//           )}
//           <span>Continue with Facebook</span>
//         </button>

//         <div className="text-center text-xs text-neutral-500">
//           <Shield className="h-3 w-3 inline mr-1" />
//           We never post to your social media or share your data
//         </div>
//       </div>

//       {/* Submit */}
//       <button
//         type="submit"
//         disabled={isLoading}
//         className="w-full btn-primary text-lg py-4 disabled:opacity-50 flex items-center justify-center space-x-2"
//       >
//         {isLoading ? (
//           <>
//             <Loader2 className="h-5 w-5 animate-spin" />
//             <span>Creating Account...</span>
//           </>
//         ) : (
//           <span>Sign Up</span>
//         )}
//       </button>
//     </form>
//   );
// };

// export default SignUpForm;

// src/components/SignUpForm.tsx
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

interface SignUpFormProps {
  step: "intro" | "form" | "verification";
  signupMethod: "email" | "phone" | null;
  formData: {
    username: string;
    emailOrPhone: string;
    password: string;
    otp: string;
  };
  errors: Record<string, string>;
  isLoading: boolean;
  onInputChange: (field: string, value: string) => void;
  onSignupStart: () => void;
  onSignupSubmit: (e: React.FormEvent) => void;
  onVerification: (e: React.FormEvent) => void;
  onSocialSignup: (provider: "google" | "facebook") => void;
  onSwitchToLogin: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({
  step,
  signupMethod,
  formData,
  errors,
  isLoading,
  onInputChange,
  onSignupStart,
  onSignupSubmit,
  onVerification,
  onSocialSignup,
  onSwitchToLogin,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const getInputType = (value: string) => {
    if (value.includes("@")) return "email";
    if (/^\+?\d+$/.test(value)) return "tel";
    return "text";
  };

  // Intro Screen
  const renderIntro = () => (
    <div className="space-y-6 p-6">
      <button
        onClick={onSignupStart}
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50"
      >
        Continue with Email or Phone
      </button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="px-2 bg-white text-sm text-gray-500">
            or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onSocialSignup("google")}
          disabled={isLoading}
          className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          <Chrome className="h-5 w-5 mr-2" />
          Google
        </button>
        <button
          onClick={() => onSocialSignup("facebook")}
          disabled={isLoading}
          className="flex items-center justify-center py-2 px-4 border border-transparent rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
        >
          <Facebook className="h-5 w-5 mr-2" />
          Facebook
        </button>
      </div>

      <div className="text-center text-sm mt-6">
        <p className="text-gray-600">
          Already have an account?{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );

  // Form Screen
  const renderForm = () => (
    <div className="space-y-6 p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <BookOpen className="h-8 w-8 text-blue-500" />
          <h1 className="text-2xl font-bold">Vitabu Vitabu</h1>
        </div>
        <h2 className="text-xl font-semibold mb-2">Create Your Account</h2>
        <p className="text-gray-600">Just a few details to get started</p>
      </div>

      <form onSubmit={onSignupSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => onInputChange("username", e.target.value)}
            className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.username ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Choose a username"
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.username}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email or Phone
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {getInputType(formData.emailOrPhone) === "email" ? (
                <Mail className="h-5 w-5 text-gray-400" />
              ) : (
                <Phone className="h-5 w-5 text-gray-400" />
              )}
            </div>
            <input
              type={getInputType(formData.emailOrPhone)}
              value={formData.emailOrPhone}
              onChange={(e) => onInputChange("emailOrPhone", e.target.value)}
              className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.emailOrPhone ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="email@example.com or +254..."
            />
          </div>
          {errors.emailOrPhone && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.emailOrPhone}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Create Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => onInputChange("password", e.target.value)}
              className={`w-full pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="At least 6 characters"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.password}
            </p>
          )}
        </div>

        {errors.general && (
          <p className="text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.general}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              Creating account...
            </div>
          ) : (
            "Sign Up"
          )}
        </button>
      </form>

      <div className="text-center text-sm">
        <button
          onClick={onSwitchToLogin}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to login
        </button>
      </div>
    </div>
  );

  // Verification Screen
  const renderVerification = () => (
    <div className="space-y-6 p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <BookOpen className="h-8 w-8 text-blue-500" />
          <h1 className="text-2xl font-bold">Vitabu Vitabu</h1>
        </div>
        <h2 className="text-xl font-semibold mb-2">
          {signupMethod === "phone" ? "Verify Your Phone" : "Check Your Email"}
        </h2>
        <p className="text-gray-600">
          {signupMethod === "phone"
            ? `We sent a code to ${formData.emailOrPhone}`
            : `We sent a verification link to ${formData.emailOrPhone}`}
        </p>
      </div>

      {signupMethod === "phone" ? (
        <form onSubmit={onVerification} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Verification Code
            </label>
            <input
              type="text"
              value={formData.otp}
              onChange={(e) =>
                onInputChange(
                  "otp",
                  e.target.value.replace(/\D/g, "").slice(0, 6)
                )
              }
              className={`w-full px-3 py-3 text-center text-2xl font-mono border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.otp ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="000000"
              maxLength={6}
            />
            {errors.otp && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.otp}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || formData.otp.length !== 6}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Verifying...
              </div>
            ) : (
              "Verify & Continue"
            )}
          </button>

          <div className="text-center text-sm">
            <button
              type="button"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Didn't receive code? Resend
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <div className="space-y-2">
            <p className="text-gray-700">
              Click the verification link in your email to complete your account
              setup.
            </p>
            <p className="text-sm text-gray-500">
              Check your spam folder if you don't see it in your inbox.
            </p>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              onVerification(e);
            }}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Checking...
              </div>
            ) : (
              "I've verified my email"
            )}
          </button>
        </div>
      )}

      <div className="text-center text-sm">
        <button
          onClick={onSwitchToLogin}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to login
        </button>
      </div>
    </div>
  );

  switch (step) {
    case "intro":
      return renderIntro();
    case "form":
      return renderForm();
    case "verification":
      return renderVerification();
    default:
      return renderIntro();
  }
};

export default SignUpForm;
