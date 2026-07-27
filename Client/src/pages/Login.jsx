import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth(); // AuthContext hook

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const data = await loginUser(formData);

      // Verify response payload
      const token = data.token || data.accessToken;
      const userObj = data.user || data.data;

      if (token && userObj) {
        // Store user state globally in Context & LocalStorage
        login(userObj, token);

        // Redirect based on role
        if (userObj.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/products");
        }
      } else {
        setErrorMessage(data.message || "Invalid email or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0F0A06] p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl bg-[#1A120C] rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-[#2E2015]">
        {/* Left Branding Panel */}
        <div className="hidden lg:flex lg:col-span-5 relative bg-[#24170E] flex-col justify-between p-10 overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#C68D5D_1px,transparent_1px)] [background-size:16px_16px]"></div>

          <div className="relative z-10">
            <span className="inline-block px-3 py-1 bg-[#C68D5D]/10 text-[#C68D5D] border border-[#C68D5D]/20 rounded-full text-xs font-semibold tracking-wider uppercase mb-4">
              Artisanal Coffee
            </span>
            <h1 className="text-4xl font-extrabold text-[#F5EBE6] leading-tight font-serif">
              Brew & Bean
            </h1>
            <p className="text-xs text-[#A38A75] mt-1 tracking-widest uppercase">
              Crafted Coffee & Treats
            </p>
          </div>

          <div className="relative z-10 my-12">
            <blockquote className="text-[#D4C3B5] text-lg italic font-serif leading-relaxed">
              "Freshly roasted beans, handcrafted drinks, and warm delights
              delivered right to your table."
            </blockquote>
          </div>

          <div className="relative z-10 flex items-center gap-3 pt-6 border-t border-[#3B291A]">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs text-[#A38A75] font-medium">
              Live Order Systems Active
            </span>
          </div>
        </div>

        {/* Form Panel */}
        <div className="lg:col-span-7 p-6 sm:p-10 md:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            <div className="text-center lg:text-left mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F5EBE6]">
                Welcome Back
              </h2>
              <p className="text-sm text-[#A38A75] mt-2">
                Sign in to manage your orders and cart.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-rose-400 shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-xs sm:text-sm text-rose-300 font-medium">
                  {errorMessage}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#D4C3B5] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3.5 rounded-xl bg-[#24170E] border border-[#3B291A] text-[#F5EBE6] placeholder-[#6E5542] text-sm focus:outline-none focus:border-[#C68D5D] focus:ring-1 focus:ring-[#C68D5D] transition-all duration-200"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#D4C3B5]">
                    Password
                  </label>
                  <a
                    href="#forgot"
                    className="text-xs text-[#C68D5D] hover:underline font-medium"
                  >
                    Forgot?
                  </a>
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 rounded-xl bg-[#24170E] border border-[#3B291A] text-[#F5EBE6] placeholder-[#6E5542] text-sm focus:outline-none focus:border-[#C68D5D] focus:ring-1 focus:ring-[#C68D5D] transition-all duration-200"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-6 rounded-xl bg-[#C68D5D] hover:bg-[#B37B4C] text-[#0F0A06] font-bold text-sm tracking-wide shadow-lg shadow-[#C68D5D]/10 hover:shadow-[#C68D5D]/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-[#0F0A06]"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>

            <p className="text-center text-xs text-[#A38A75] mt-8">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-[#C68D5D] font-semibold hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
