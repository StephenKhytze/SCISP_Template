import React, { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  User,
  Loader2,
  KeyRound,
} from "lucide-react";

export interface LoginCredentials {
  username: string;
  password?: string;
  rememberMe?: boolean;
  provider?: "credentials" | "google";
}

export interface LoginViewProps {
  /**
   * Called when username/password login is submitted.
   * App.jsx handles the actual JWT API request.
   */
  onLogin?: (
    credentials: LoginCredentials
  ) => void | Promise<void>;

  /**
   * Called when Google OAuth login is initiated.
   * Google OAuth can be connected here later.
   */
  onGoogleLogin?: () => void | Promise<void>;

  /**
   * Optional initial username.
   */
  defaultUsername?: string;

  /**
   * Error supplied by the parent component.
   */
  externalError?: string | null;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLogin,
  onGoogleLogin,
  defaultUsername = "",
  externalError = null,
}) => {
  // Form state
  const [username, setUsername] = useState(defaultUsername);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
    general?: string;
  }>({});

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Forgot password state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  /**
   * Validate login form before sending credentials.
   */
  const validateForm = (): boolean => {
    const newErrors: {
      username?: string;
      password?: string;
    } = {};

    if (!username.trim()) {
      newErrors.username = "Username or Student ID is required.";
    } else if (username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 4) {
      newErrors.password = "Password must be at least 4 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /**
   * Submit username/password credentials.
   *
   * The actual JWT request is handled by App.jsx through onLogin().
   */
  const handleStandardLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setSuccessMsg(null);
    setErrors({});

    if (!validateForm()) {
      return;
    }

    if (!onLogin) {
      setErrors({
        general: "Login handler is not configured.",
      });
      return;
    }

    setIsLoading(true);

    try {
      await onLogin({
        username: username.trim(),
        password,
        rememberMe,
        provider: "credentials",
      });

      setSuccessMsg("Login successful.");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Authentication failed. Please check your credentials.";

      setErrors({
        general: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Google OAuth handler.
   *
   * This does not implement Google authentication yet.
   * App.jsx or the authentication service can be connected later.
   */
  const handleGoogleOAuthLogin = async () => {
    if (!onGoogleLogin) {
      setErrors({
        general: "Google login is not configured yet.",
      });
      return;
    }

    setIsGoogleLoading(true);
    setSuccessMsg(null);
    setErrors({});

    try {
      await onGoogleLogin();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Google OAuth authentication failed.";

      setErrors({
        general: message,
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  /**
   * Forgot password placeholder.
   * Connect this to the backend password recovery endpoint later.
   */
  const handleForgotPasswordSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!resetEmail.trim()) {
      return;
    }

    setResetSent(true);
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans overflow-x-hidden selection:bg-[#80172B] selection:text-white">

      {/* Background Campus Photo */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 scale-105"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1920&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-amber-950/20 to-purple-900/40 backdrop-brightness-[0.88]" />
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-5xl bg-[#DDE3EA]/85 backdrop-blur-2xl rounded-[28px] sm:rounded-[36px] shadow-[0_30px_70px_rgba(0,0,0,0.5)] border border-white/50 p-6 sm:p-8 lg:p-10 animate-in fade-in zoom-in-95 duration-300">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">

          {/* Login Section */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">

            <div className="space-y-6">

              {/* Logo */}
              <div className="flex items-center space-x-1">
                <div className="relative font-black tracking-tighter text-4xl sm:text-5xl text-[#80172B] leading-none select-none flex items-baseline">
                  <span>ABC</span>

                  <span className="text-[10px] sm:text-[11px] font-extrabold tracking-widest text-[#80172B] uppercase ml-1.5 self-start pt-1">
                    SCHOOL
                  </span>
                </div>
              </div>

              {/* Header */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  Welcome Back
                </h1>

                <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
                  Sign in to your ABC School account
                </p>
              </div>

              {/* Error */}
              {(externalError || errors.general) && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2.5 text-rose-800 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />

                  <span className="flex-1">
                    {externalError || errors.general}
                  </span>
                </div>
              )}

              {/* Success */}
              {successMsg && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2.5 text-emerald-800 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />

                  <span>{successMsg}</span>
                </div>
              )}

              {/* Login Form */}
              <form
                onSubmit={handleStandardLogin}
                className="space-y-4"
                noValidate
              >

                {/* Username */}
                <div className="space-y-1">

                  <label
                    htmlFor="login-username"
                    className="block text-xs font-semibold text-gray-700 ml-1"
                  >
                    Username or Student ID
                  </label>

                  <div className="relative">

                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <User className="w-4 h-4" />
                    </div>

                    <input
                      id="login-username"
                      type="text"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);

                        if (errors.username) {
                          setErrors((prev) => ({
                            ...prev,
                            username: undefined,
                          }));
                        }
                      }}
                      placeholder="e.g. DelaCruz_Juan_C1234 or j.delacruz"
                      disabled={isLoading || isGoogleLoading}
                      autoComplete="username"
                      className={`w-full pl-10 pr-4 py-3 bg-white border ${
                        errors.username
                          ? "border-rose-500 ring-1 ring-rose-500"
                          : "border-gray-300"
                      } rounded-xl text-xs sm:text-sm font-semibold text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#80172B]/30 focus:border-[#80172B] shadow-sm transition-all disabled:opacity-70`}
                    />

                  </div>

                  {errors.username && (
                    <p className="text-[11px] font-semibold text-rose-600 ml-1 flex items-center space-x-1 mt-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.username}</span>
                    </p>
                  )}

                </div>

                {/* Password */}
                <div className="space-y-1">

                  <label
                    htmlFor="login-password"
                    className="block text-xs font-semibold text-gray-700 ml-1"
                  >
                    Password
                  </label>

                  <div className="relative">

                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Lock className="w-4 h-4" />
                    </div>

                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);

                        if (errors.password) {
                          setErrors((prev) => ({
                            ...prev,
                            password: undefined,
                          }));
                        }
                      }}
                      placeholder="••••••••••••"
                      disabled={isLoading || isGoogleLoading}
                      autoComplete="current-password"
                      className={`w-full pl-10 pr-20 py-3 bg-white border ${
                        errors.password
                          ? "border-rose-500 ring-1 ring-rose-500"
                          : "border-gray-300"
                      } rounded-xl text-xs sm:text-sm font-semibold text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#80172B]/30 focus:border-[#80172B] shadow-sm transition-all disabled:opacity-70`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((previous) => !previous)
                      }
                      disabled={isLoading || isGoogleLoading}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500 hover:text-gray-900 cursor-pointer py-1 px-2 rounded hover:bg-gray-100 flex items-center space-x-1 disabled:opacity-50"
                    >
                      {showPassword ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Hide</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Show</span>
                        </>
                      )}
                    </button>

                  </div>

                  {errors.password && (
                    <p className="text-[11px] font-semibold text-rose-600 ml-1 flex items-center space-x-1 mt-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.password}</span>
                    </p>
                  )}

                </div>

                {/* Google Divider */}
                <div className="relative my-3 flex items-center justify-center">
                  <div className="border-t border-gray-300 w-full" />

                  <span className="bg-[#DDE3EA] px-3 text-xs text-gray-500 font-semibold shrink-0">
                    or
                  </span>

                  <div className="border-t border-gray-300 w-full" />
                </div>

                {/* Google Login */}
                <button
                  type="button"
                  onClick={handleGoogleOAuthLogin}
                  disabled={isLoading || isGoogleLoading}
                  className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 border border-gray-300 rounded-full text-xs sm:text-sm font-semibold text-gray-700 shadow-sm flex items-center justify-center space-x-2.5 transition-all cursor-pointer disabled:opacity-60"
                >
                  {isGoogleLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                  ) : (
                    <svg
                      className="w-4 h-4 shrink-0"
                      viewBox="0 0 24 24"
                    >
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
                  )}

                  <span>
                    {isGoogleLoading
                      ? "Connecting Google Account..."
                      : "Sign in with Google"}
                  </span>
                </button>

                {/* Remember Me / Forgot Password */}
                <div className="flex items-center justify-between pt-1">

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="login-rememberMe"
                      checked={rememberMe}
                      onChange={(e) =>
                        setRememberMe(e.target.checked)
                      }
                      disabled={isLoading || isGoogleLoading}
                      className="w-4 h-4 rounded border-gray-300 text-[#80172B] focus:ring-[#80172B] cursor-pointer"
                    />

                    <label
                      htmlFor="login-rememberMe"
                      className="text-xs font-semibold text-gray-600 cursor-pointer select-none"
                    >
                      Remember me
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotModalOpen(true);
                      setResetSent(false);

                      setResetEmail(
                        username.includes("@") ? username : ""
                      );
                    }}
                    disabled={isLoading || isGoogleLoading}
                    className="text-xs font-bold text-[#183153] hover:underline cursor-pointer disabled:opacity-50"
                  >
                    Forgot Password?
                  </button>

                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading || isGoogleLoading}
                  className="w-full py-3 bg-[#183153] hover:bg-[#10243E] text-white font-bold text-sm sm:text-base rounded-full shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2 mt-2 disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <span>Login</span>
                  )}
                </button>

              </form>

            </div>

            {/* Footer */}
            <div className="text-center pt-4 border-t border-gray-300/60">
              <p className="text-[10px] text-gray-500 font-semibold tracking-tight">
                ABC School Student Portal v0.0.0 © 2026
              </p>
            </div>

          </div>

          {/* Right Artwork */}
          <div className="lg:col-span-6 relative rounded-[28px] sm:rounded-[32px] overflow-hidden shadow-2xl bg-[#0091AC] flex flex-col justify-between p-6 sm:p-8 min-h-[440px] border border-white/30 text-white select-none">

            <div className="absolute inset-0 z-0">

              <div className="absolute inset-0 bg-gradient-to-br from-[#00A2C2] via-[#00819B] to-[#005B6E]" />

              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop"
                alt="ABC School Graduates"
                className="absolute inset-0 w-full h-full object-cover object-center opacity-90"
                referrerPolicy="no-referrer"
              />

              <div className="absolute -bottom-10 -right-10 w-96 h-96 pointer-events-none opacity-85">
                <svg
                  viewBox="0 0 200 200"
                  className="w-full h-full fill-[#F3C200]"
                >
                  <path d="M100 0 L120 70 L190 40 L140 90 L200 130 L130 140 L140 200 L90 150 L50 190 L60 130 L0 110 L60 80 L20 20 L80 50 Z" />
                </svg>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

            </div>

            {/* Brand */}
            <div className="relative z-10">
              <div className="font-black text-4xl sm:text-5xl text-[#A6192E] tracking-tighter drop-shadow-md flex items-baseline leading-none">
                <span>ABC</span>

                <span className="text-[10px] font-extrabold tracking-widest text-[#A6192E] uppercase ml-1">
                  SCHOOL
                </span>
              </div>
            </div>

            {/* Artwork Text */}
            <div className="relative z-10 my-auto py-6 space-y-1">

              <div className="text-right">
                <span className="text-xs font-serif italic text-white/90 tracking-widest block pr-2">
                  veritas
                </span>

                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-none drop-shadow-xl">
                  TRUTH
                </h2>
              </div>

              <div className="flex items-center justify-end space-x-2 py-1">
                <span className="text-sm font-mono text-white/80 tracking-widest">
                  sapientia
                </span>

                <span className="text-3xl font-serif italic text-white font-bold leading-none">
                  &
                </span>

                <span className="text-sm font-mono text-white/80 tracking-widest">
                  et
                </span>
              </div>

              <div className="text-right">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-none drop-shadow-xl">
                  WISDOM
                </h2>
              </div>

            </div>

            {/* Bottom Ribbon */}
            <div className="relative z-10 mt-auto">
              <div className="bg-[#12233D]/95 backdrop-blur-md rounded-full py-2.5 px-4 text-center border border-white/20 shadow-lg">
                <p className="text-[10px] sm:text-[11px] font-extrabold tracking-wider text-white uppercase">
                  BASIC EDUCATION • COLLEGE • MASTER'S/DOCTORATE
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">

          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4 relative">

            <div className="flex items-center space-x-3 text-[#80172B]">

              <div className="p-2.5 bg-[#80172B]/10 rounded-xl">
                <KeyRound className="w-5 h-5 text-[#80172B]" />
              </div>

              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Reset Password
                </h3>

                <p className="text-xs text-gray-500 font-medium">
                  ABC School Portal Account Recovery
                </p>
              </div>

            </div>

            {resetSent ? (
              <div className="space-y-4 py-2">

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start space-x-2 font-medium">

                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />

                  <span>
                    Password reset instructions have been dispatched to{" "}
                    <strong>{resetEmail}</strong>. Please check your inbox.
                  </span>

                </div>

                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="w-full py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Return to Login
                </button>

              </div>
            ) : (
              <form
                onSubmit={handleForgotPasswordSubmit}
                className="space-y-4"
              >

                <p className="text-xs text-gray-600 font-normal leading-relaxed">
                  Enter your registered institutional email or student ID
                  number to receive password recovery instructions.
                </p>

                <div>

                  <label
                    htmlFor="reset-email"
                    className="block text-xs font-semibold text-gray-700 mb-1"
                  >
                    Institutional Email / ID
                  </label>

                  <input
                    id="reset-email"
                    type="text"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="e.g. student@abcschool.edu.ph"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#80172B]/30 focus:border-[#80172B]"
                  />

                </div>

                <div className="flex items-center justify-end space-x-2 pt-2">

                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#80172B] hover:bg-[#601120] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                  >
                    Send Recovery Link
                  </button>

                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default LoginView;
