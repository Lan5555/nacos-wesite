'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

const ResetPassword: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [pwStrength, setPwStrength] = useState({ score: 0, text: 'Enter a password', color: '#6a8a6a' });


  const checkStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['', '#e74c3c', '#f39c12', '#28a228', '#3cc43c'];
    setPwStrength({
      score,
      text: pw ? labels[score] || 'Enter a password' : 'Enter a password',
      color: colors[score] || '#6a8a6a'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (pwStrength.score < 2) {
      setError('Please create a stronger password (at least 8 characters with uppercase, number, or special character)');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1500);
  };


  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden grid grid-cols-1 lg:grid-cols-2">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex flex-col justify-between bg-linear-to-br from-[#062206] via-[#0e3d0e] to-[#165716] p-12 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-100 h-100 rounded-full bg-[radial-gradient(circle,rgba(60,196,60,0.15),transparent_70%)]" />
        <div className="absolute -bottom-16 -left-16 w-75 h-75 rounded-full bg-[radial-gradient(circle,rgba(40,162,40,0.1),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[28px_28px]" />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 mb-16">
            <div className="w-11 h-11 rounded-xl bg-linear-to-br from-[#28a228] to-[#72d872] flex items-center justify-center font-bold text-white text-base">N</div>
            <div className="text-white text-xl font-bold tracking-tight">NAC<span className="text-[#72d872]">OS</span> Nigeria</div>
          </Link>

          <h2 className="text-white text-[2.8rem] font-bold leading-[1.1] tracking-[-0.03em] mb-5">
            Create Your<br />
            <span className="text-[#72d872]">New Password</span>
          </h2>
          <p className="text-white/55 text-base leading-relaxed max-w-90">
            Your new password must be different from previously used passwords and meet the security requirements.
          </p>

          <div className="flex flex-col gap-3 mt-10">
            <div className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/8 rounded-xl backdrop-blur-sm">
              <span className="text-base">✓</span>
              <span className="text-[0.85rem] text-white/70 font-medium">Minimum 8 characters</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/8 rounded-xl backdrop-blur-sm">
              <span className="text-base">✓</span>
              <span className="text-[0.85rem] text-white/70 font-medium">At least 1 uppercase letter</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/8 rounded-xl backdrop-blur-sm">
              <span className="text-base">✓</span>
              <span className="text-[0.85rem] text-white/70 font-medium">At least 1 number or special character</span>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/30 text-[0.78rem]">
            © 2026 NACOS Nigeria · <Link href="/login" className="text-white/50 hover:text-[#72d872] transition-colors">Back to Login</Link>
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="bg-white flex items-center justify-center p-12">
        <div className="w-full max-w-105 animate-[fadeIn_0.5s_ease]">
          {!submitted ? (
            <>
              <div className="mb-10">
                <span className="text-[0.72rem] font-bold text-[#1e7a1e] tracking-[0.08em] uppercase bg-[#edfaed] border border-[#d4f7d4] px-3 py-1 rounded-full inline-block mb-4">
                  Reset Password
                </span>
                <h1 className="text-4xl font-bold text-[#0e2a0e] tracking-[-0.03em] mb-2">
                  Create New Password
                </h1>
                <p className="text-[0.9rem] text-[#6a8a6a]">
                  Enter your new password below
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-1.5 mb-4">
                  <label className="text-[0.78rem] font-bold text-[#3a5a3a] tracking-wide">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        checkStrength(e.target.value);
                      }}
                      className="w-full px-3.5 py-3 rounded-xl border-2 border-[#e2efe2] bg-white text-[0.9rem] text-[#0e2a0e] outline-none focus:border-[#28a228] focus:ring-4 focus:ring-[#28a228]/10 transition-all pr-11"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#6a8a6a] text-sm select-none"
                    >
                      {showPassword ? '🙈' : '👁'}
                    </span>
                  </div>
                  <div className="flex gap-1 mt-1.5">
                    {[1, 2, 3, 4].map((bar) => (
                      <div
                        key={bar}
                        className={`h-0.75 flex-1 rounded transition-all ${
                          bar <= pwStrength.score
                            ? pwStrength.score === 1 ? 'bg-[#e74c3c]' : pwStrength.score === 2 ? 'bg-[#f39c12]' : pwStrength.score === 3 ? 'bg-[#28a228]' : 'bg-[#3cc43c]'
                            : 'bg-[#e2efe2]'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-[0.72rem] mt-1" style={{ color: pwStrength.color }}>
                    {pwStrength.text}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 mb-6">
                  <label className="text-[0.78rem] font-bold text-[#3a5a3a] tracking-wide">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3.5 py-3 rounded-xl border-2 border-[#e2efe2] bg-white text-[0.9rem] text-[#0e2a0e] outline-none focus:border-[#28a228] focus:ring-4 focus:ring-[#28a228]/10 transition-all pr-11"
                    />
                    <span
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#6a8a6a] text-sm select-none"
                    >
                      {showConfirmPassword ? '🙈' : '👁'}
                    </span>
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-[0.72rem] text-red-500 mt-1">Passwords do not match</p>
                  )}
                </div>

                {error && (
                  <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-[#1e7a1e] text-white text-[0.95rem] font-bold cursor-pointer hover:bg-[#165716] transition-all hover:-translate-y-px hover:shadow-lg hover:shadow-[#1e7a1e]/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Resetting...' : 'Reset Password →'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#edfaed] flex items-center justify-center">
                <span className="text-4xl">✅</span>
              </div>
              <h2 className="text-2xl font-bold text-[#0e2a0e] mb-4">Password Reset Successfully!</h2>
              <p className="text-[#6a8a6a] mb-6">
                Your password has been reset successfully. You can now log in with your new password.
              </p>
              <Link
                href="/login"
                className="inline-block w-full py-3 rounded-xl bg-[#1e7a1e] text-white font-bold text-center hover:bg-[#165716] transition-all"
              >
                Login to Your Account →
              </Link>
            </div>
          )}

          <div className="text-center text-[0.73rem] text-[#b0c4b0] mt-8 leading-relaxed">
            Need help?{' '}
            <Link href="/support" className="text-[#6a8a6a] hover:text-[#1e7a1e] transition-colors">
              Contact NACOS Support
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
export default ResetPassword;