import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiArrowRight, FiAlertCircle, FiCoffee } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register: registerAuthUser } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setApiError('');
    setLoading(true);

    try {
      // Call register function from AuthContext
      await registerAuthUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      // Redirect upon success
      navigate('/');
    } catch (err) {
      setApiError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0A06] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#C68D5D]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Top Branding Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-[#24170E] border border-[#3B291A] items-center justify-center text-[#C68D5D] mb-4 shadow-xl">
            <FiCoffee className="w-7 h-7" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#F5EBE6]">Create Account</h1>
          <p className="text-xs text-[#A38A75] mt-2 tracking-wide">
            Join us to explore fresh micro-lots and easily track your orders.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-[#1A120C] border border-[#2E2015] p-8 rounded-3xl shadow-2xl">
          
          {/* API Error Box */}
          {apiError && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-300 text-xs">
              <FiAlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              <span>{apiError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Full Name Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#D4C3B5] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#6E5542]">
                  <FiUser className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="John Doe"
                  {...register('name', { required: 'Full name is required' })}
                  className={`w-full pl-11 pr-4 py-3 bg-[#24170E] border ${
                    errors.name ? 'border-rose-500/70' : 'border-[#3B291A] focus:border-[#C68D5D]'
                  } rounded-xl text-sm text-[#F5EBE6] placeholder-[#6E5542] focus:outline-none focus:ring-1 focus:ring-[#C68D5D] transition-colors`}
                />
              </div>
              {errors.name && (
                <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                  <FiAlertCircle /> {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#D4C3B5] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#6E5542]">
                  <FiMail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email address',
                    },
                  })}
                  className={`w-full pl-11 pr-4 py-3 bg-[#24170E] border ${
                    errors.email ? 'border-rose-500/70' : 'border-[#3B291A] focus:border-[#C68D5D]'
                  } rounded-xl text-sm text-[#F5EBE6] placeholder-[#6E5542] focus:outline-none focus:ring-1 focus:ring-[#C68D5D] transition-colors`}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                  <FiAlertCircle /> {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#D4C3B5] mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#6E5542]">
                  <FiLock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  placeholder="Minimum 6 characters"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  className={`w-full pl-11 pr-4 py-3 bg-[#24170E] border ${
                    errors.password ? 'border-rose-500/70' : 'border-[#3B291A] focus:border-[#C68D5D]'
                  } rounded-xl text-sm text-[#F5EBE6] placeholder-[#6E5542] focus:outline-none focus:ring-1 focus:ring-[#C68D5D] transition-colors`}
                />
              </div>
              {errors.password && (
                <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                  <FiAlertCircle /> {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#D4C3B5] mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#6E5542]">
                  <FiLock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  placeholder="Repeat your password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) => value === password || 'Passwords do not match',
                  })}
                  className={`w-full pl-11 pr-4 py-3 bg-[#24170E] border ${
                    errors.confirmPassword ? 'border-rose-500/70' : 'border-[#3B291A] focus:border-[#C68D5D]'
                  } rounded-xl text-sm text-[#F5EBE6] placeholder-[#6E5542] focus:outline-none focus:ring-1 focus:ring-[#C68D5D] transition-colors`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                  <FiAlertCircle /> {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full !mt-6 py-3.5 px-6 rounded-xl bg-[#C68D5D] hover:bg-[#B37B4C] text-[#0F0A06] font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#C68D5D]/10 hover:shadow-[#C68D5D]/20 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-[#0F0A06]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 pt-6 border-t border-[#2E2015] text-center">
            <p className="text-xs text-[#A38A75]">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-[#C68D5D] hover:underline ml-1">
                Sign In
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;