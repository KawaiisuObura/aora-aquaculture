// src/Login.jsx
import { useState, useRef } from "react";
import { 
  auth, 
  signInWithPhoneNumber, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  RecaptchaVerifier 
} from "./firebase/firebase";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("phone"); // "phone" or "email"
  
  // Phone state
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone"); // "phone" or "otp"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const confirmationResultRef = useRef(null);

  // Email state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  // Setup reCAPTCHA (for phone auth)
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "normal",
          callback: () => {},
          "expired-callback": () => {},
        }
      );
    }
  };

  // 📱 PHONE AUTH - Send OTP
  const sendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    let formattedPhone = phone.trim();
    if (!formattedPhone.startsWith("+")) {
      formattedPhone = "+254" + formattedPhone.replace(/^0+/, "");
    }

    try {
      setupRecaptcha();
      const confirmation = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        window.recaptchaVerifier
      );
      confirmationResultRef.current = confirmation;
      setStep("otp");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // 📱 PHONE AUTH - Verify OTP
  const verifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await confirmationResultRef.current.confirm(otp);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid OTP. Please try again.");
    }
    setLoading(false);
  };

  // 📧 EMAIL AUTH - Sign In
  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email. Please sign up.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else {
        setError(err.message);
      }
    }
    setLoading(false);
  };

  // 📧 EMAIL AUTH - Sign Up
  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please sign in.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError(err.message);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4 py-8">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-6">
          <span className="text-5xl block mb-2">🐟</span>
          <h1 className="text-3xl font-bold text-green-700">Aora</h1>
          <p className="text-gray-500 text-sm mt-1">Farm Management System</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            onClick={() => { setActiveTab("phone"); setError(""); setStep("phone"); }}
            className={`flex-1 py-2 rounded-lg font-medium transition ${
              activeTab === "phone"
                ? "bg-green-600 text-white shadow-md"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            📱 Phone
          </button>
          <button
            onClick={() => { setActiveTab("email"); setError(""); }}
            className={`flex-1 py-2 rounded-lg font-medium transition ${
              activeTab === "email"
                ? "bg-green-600 text-white shadow-md"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            📧 Email
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        {/* reCAPTCHA (for phone auth) */}
        <div id="recaptcha-container"></div>

        {/* ========================================== */}
        {/* 📱 PHONE TAB */}
        {/* ========================================== */}
        {activeTab === "phone" && (
          <>
            {step === "phone" ? (
              // Step 1: Enter Phone Number
              <form onSubmit={sendOTP}>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Phone Number
                  </label>
                  <div className="flex">
                    <span className="bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg px-3 py-2 text-gray-600">
                      +254
                    </span>
                    <input
                      type="tel"
                      placeholder="7XX XXX XXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-r-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Enter without the leading 0 (e.g., 7XX XXX XXX)
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </form>
            ) : (
              // Step 2: Enter OTP
              <form onSubmit={verifyOTP}>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Enter OTP Code
                  </label>
                  <input
                    type="text"
                    placeholder="6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-center text-2xl tracking-widest"
                    maxLength="6"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Enter the 6-digit code sent to your phone
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
                <button
                  type="button"
                  onClick={() => { setStep("phone"); setError(""); }}
                  className="w-full text-gray-500 text-sm mt-3 hover:text-green-600 transition"
                >
                  ← Change phone number
                </button>
              </form>
            )}
          </>
        )}

        {/* ========================================== */}
        {/* 📧 EMAIL TAB */}
        {/* ========================================== */}
        {activeTab === "email" && (
          <>
            <form onSubmit={isSignUp ? handleEmailSignUp : handleEmailSignIn}>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="farmer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  {isSignUp ? "Password must be at least 6 characters" : "Enter your password"}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
                className="text-sm text-green-600 hover:text-green-700 transition font-medium"
              >
                {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
              </button>
            </div>
          </>
        )}

        <div className="mt-6 text-center text-xs text-gray-400">
          Secure authentication powered by Firebase 🔒
        </div>
      </div>
    </div>
  );
}

export default Login;