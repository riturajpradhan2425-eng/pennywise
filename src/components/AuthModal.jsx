import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, AlertCircle, ArrowRight, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AuthModal() {
  const { authModalOpen, authModalConfig, closeAuthModal, signInWithEmail, signUpWithEmail, signInWithGoogle, resetPassword } = useAuth();
  const [mode, setMode] = useState(authModalConfig.initialMode || "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setSubmitting(true);
    try {
      if (mode === "signup") {
        if (!displayName.trim()) {
          throw new Error("Please enter your name");
        }
        await signUpWithEmail(email, password, displayName.trim());
      } else if (mode === "forgot") {
        if (!email.trim()) {
          throw new Error("Please enter your email to reset password");
        }
        await resetPassword(email.trim());
        setSuccessMsg("Password recovery link sent! Check your inbox.");
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err) {
      let msg = err.message || "Authentication failed";
      if (msg.includes("auth/invalid-credential") || msg.includes("auth/wrong-password") || msg.includes("auth/user-not-found")) {
        msg = "Invalid email or password. Please check your credentials.";
      } else if (msg.includes("auth/email-already-in-use")) {
        msg = "An account with this email already exists. Try signing in.";
      } else if (msg.includes("auth/weak-password")) {
        msg = "Password should be at least 6 characters long.";
      } else if (msg.includes("auth/invalid-email")) {
        msg = "Please enter a valid email address.";
      } else if (msg.includes("auth/popup-closed-by-user")) {
        msg = "Sign in popup was closed. Please try again.";
      }
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setSuccessMsg("");
    setSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      if (!err.message?.includes("popup-closed-by-user")) {
        setError(err.message || "Failed to sign in with Google");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="absolute inset-0 bg-ink/80 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-line bg-surface-1/95 p-6 shadow-2xl sm:p-8"
        >
          {/* Subtle gradient glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-mint/15 blur-3xl" />

          {/* Close button */}
          <button
            onClick={closeAuthModal}
            className="absolute right-5 top-5 rounded-full p-2 text-mist transition-colors hover:bg-surface-2 hover:text-white"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-mint/10 text-mint">
                <Sparkles size={16} />
              </span>
              <span className="font-heading text-xs font-semibold uppercase tracking-wider text-mint">
                PennyWise Account
              </span>
            </div>
            <h3 className="font-heading text-2xl font-bold tracking-tight text-white">
              {mode === "signin"
                ? "Welcome back"
                : mode === "signup"
                ? "Create student account"
                : "Reset your password"}
            </h3>
            <p className="mt-1 text-xs text-mist">
              {authModalConfig.message ||
                (mode === "signin"
                  ? "Sign in to access your AI Financial Coach, budgets, and savings goals."
                  : mode === "signup"
                  ? "Sign up to track expenses, scan receipts with AI, and project your cash runway."
                  : "Enter your registered email to receive a secure password recovery link.")}
            </p>
          </div>

          {/* Switch tabs */}
          {mode !== "forgot" ? (
            <div className="mb-6 flex rounded-xl border border-line bg-ink/60 p-1">
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setError("");
                  setSuccessMsg("");
                }}
                className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
                  mode === "signin"
                    ? "bg-mint text-ink shadow-sm"
                    : "text-mist hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setError("");
                  setSuccessMsg("");
                }}
                className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
                  mode === "signup"
                    ? "bg-mint text-ink shadow-sm"
                    : "text-mist hover:text-white"
                }`}
              >
                Create Account
              </button>
            </div>
          ) : (
            <div className="mb-4">
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setError("");
                  setSuccessMsg("");
                }}
                className="text-xs text-mint hover:underline font-medium"
              >
                ← Back to Sign In
              </button>
            </div>
          )}

          {/* Google Sign-in */}
          {mode !== "forgot" && (
            <>
              <button
                type="button"
                onClick={handleGoogle}
                disabled={submitting}
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-line bg-surface-2/70 px-4 py-3 text-sm font-semibold text-white transition-all hover:border-mint/50 hover:bg-surface-2 disabled:opacity-50"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Continue with Google
              </button>

              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-line" />
                </div>
                <span className="relative bg-surface-1 px-3 font-mono text-[11px] uppercase tracking-wider text-mist">
                  or with email
                </span>
              </div>
            </>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-alert/30 bg-alert/10 p-3 text-xs text-alert">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="flex items-start gap-2.5 rounded-xl border border-mint/30 bg-mint/10 p-3 text-xs text-mint">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {mode === "signup" && (
              <div>
                <label className="mb-1 block text-xs font-medium text-mist">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full rounded-xl border border-line bg-ink/70 py-2.5 pl-10 pr-4 text-sm text-white placeholder-mist/60 outline-none transition-colors focus:border-mint focus:ring-1 focus:ring-mint"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-medium text-mist">Student Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@campus.edu"
                  className="w-full rounded-xl border border-line bg-ink/70 py-2.5 pl-10 pr-4 text-sm text-white placeholder-mist/60 outline-none transition-colors focus:border-mint focus:ring-1 focus:ring-mint"
                />
              </div>
            </div>

            {mode !== "forgot" && (
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-xs font-medium text-mist">Password</label>
                  {mode === "signin" && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode("forgot");
                        setError("");
                        setSuccessMsg("");
                      }}
                      className="text-[11px] text-mint hover:underline font-medium"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    minLength={6}
                    className="w-full rounded-xl border border-line bg-ink/70 py-2.5 pl-10 pr-4 text-sm text-white placeholder-mist/60 outline-none transition-colors focus:border-mint focus:ring-1 focus:ring-mint"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-mint py-3 font-heading text-sm font-semibold text-ink shadow-[0_0_24px_rgba(0,229,153,0.3)] transition-all hover:shadow-[0_0_40px_rgba(0,229,153,0.5)] disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {mode === "signin"
                    ? "Signing In..."
                    : mode === "signup"
                    ? "Creating Account..."
                    : "Sending Link..."}
                </>
              ) : (
                <>
                  {mode === "signin"
                    ? "Sign In to PennyWise"
                    : mode === "signup"
                    ? "Create Account & Start"
                    : "Send Recovery Link"}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
