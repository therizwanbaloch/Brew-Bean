import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiUser, FiMail, FiLock, FiCheckCircle, FiAlertCircle, FiShield } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [profileSuccess, setProfileSuccess] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Form for Profile Details
  const profileForm = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  // Form for Password Update
  const passwordForm = useForm();

  const onUpdateProfile = (data) => {
    setProfileSuccess('Profile details updated successfully!');
    setTimeout(() => setProfileSuccess(''), 4000);
  };

  const onChangePassword = (data) => {
    setPasswordSuccess('Password changed successfully!');
    passwordForm.reset();
    setTimeout(() => setPasswordSuccess(''), 4000);
  };

  return (
    <div className="min-h-screen bg-[#1C100B] text-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Profile Summary */}
        <div className="p-8 rounded-3xl bg-[#3E2723]/25 border border-[#3E2723]/80 flex flex-col sm:flex-row items-center gap-6 shadow-xl">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#E67E22] to-[#C87D55] flex items-center justify-center font-bold text-2xl text-[#1C100B] shadow-inner border-2 border-[#FDFBF7]/20">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="font-serif text-2xl font-bold">{user?.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#E67E22]/20 border border-[#E67E22]/40 text-[#E67E22] text-[10px] font-bold uppercase">
                {user?.role || 'Customer'}
              </span>
            </div>
            <p className="text-xs text-[#D2B48C]">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Section 1: Update Account Details */}
          <div className="bg-[#3E2723]/20 border border-[#3E2723]/70 p-6 sm:p-8 rounded-3xl space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#3E2723]/60">
              <FiUser className="w-5 h-5 text-[#E67E22]" />
              <h2 className="font-serif text-lg font-bold">Account Details</h2>
            </div>

            {profileSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-emerald-400 text-xs">
                <FiCheckCircle className="w-4 h-4 shrink-0" />
                <span>{profileSuccess}</span>
              </div>
            )}

            <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#D2B48C] mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  {...profileForm.register('name', { required: 'Name is required' })}
                  className="w-full px-4 py-3 bg-[#1C100B]/80 border border-[#3E2723] focus:border-[#E67E22] rounded-xl text-sm text-[#FDFBF7] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#D2B48C] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  {...profileForm.register('email', { required: 'Email is required' })}
                  className="w-full px-4 py-3 bg-[#1C100B]/80 border border-[#3E2723] focus:border-[#E67E22] rounded-xl text-sm text-[#FDFBF7] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 rounded-xl bg-[#3E2723]/60 hover:bg-[#C87D55] text-[#FDFBF7] font-bold text-xs uppercase tracking-wider border border-[#C87D55]/40 transition-all"
              >
                Save Profile
              </button>
            </form>
          </div>

          {/* Section 2: Change Password */}
          <div className="bg-[#3E2723]/20 border border-[#3E2723]/70 p-6 sm:p-8 rounded-3xl space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#3E2723]/60">
              <FiShield className="w-5 h-5 text-[#E67E22]" />
              <h2 className="font-serif text-lg font-bold">Security &amp; Password</h2>
            </div>

            {passwordSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-emerald-400 text-xs">
                <FiCheckCircle className="w-4 h-4 shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#D2B48C] mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  {...passwordForm.register('currentPassword', { required: 'Current password required' })}
                  className="w-full px-4 py-3 bg-[#1C100B]/80 border border-[#3E2723] focus:border-[#E67E22] rounded-xl text-sm text-[#FDFBF7] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#D2B48C] mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  {...passwordForm.register('newPassword', {
                    required: 'New password required',
                    minLength: { value: 6, message: 'Minimum 6 characters' },
                  })}
                  className="w-full px-4 py-3 bg-[#1C100B]/80 border border-[#3E2723] focus:border-[#E67E22] rounded-xl text-sm text-[#FDFBF7] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 rounded-xl bg-[#E67E22] hover:bg-[#C87D55] text-[#1C100B] font-bold text-xs uppercase tracking-wider transition-all"
              >
                Update Password
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;