'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Mail, Clock3 } from "lucide-react";


const ForgotPassword:React.FC = () => {
  const [email, setEmail] = useState('');
  const [matricNumber, setMatricNumber] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      if (email || matricNumber) {
        setSubmitted(true);
      } else {
        setError('Please enter your email or matric number');
      }
      setLoading(false);
    }, 1000);
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
            Reset Your<br />
            <span className="text-[#72d872]">Password</span><br />
            Securely.
          </h2>
          <p className="text-white/55 text-base leading-relaxed max-w-90">
            Don't worry! Enter your details below and we'll send you a link to reset your password.
          </p>

          <div className="flex flex-col gap-3 mt-10">
            <div className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/8 rounded-xl backdrop-blur-sm">
              <span className="text-base"><ShieldCheck color='#72d872' /></span>
              <span className="text-[0.85rem] text-white/70 font-medium">Secure password reset process</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/8 rounded-xl backdrop-blur-sm">
              <span className="text-base"><Mail color='#72d872' /></span>
              <span className="text-[0.85rem] text-white/70 font-medium">Reset link sent to your registered email</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/8 rounded-xl backdrop-blur-sm">
              <span className="text-base"><Clock3 color='#72d872' /></span>
              <span className="text-[0.85rem] text-white/70 font-medium">Link expires in 1 hour for security</span>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/30 text-[0.78rem]">
            © 2026 NACOS Nigeria · <Link href="/" className="text-white/50 hover:text-[#72d872] transition-colors">Back to Home</Link>
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="bg-white flex items-center justify-center p-12">
        <div className="w-full max-w-105 animate-[fadeIn_0.5s_ease]">
          <div className="mb-10">
            <span className="text-[0.72rem] font-bold text-[#1e7a1e] tracking-[0.08em] uppercase bg-[#edfaed] border border-[#d4f7d4] px-3 py-1 rounded-full inline-block mb-4">
              Password Recovery
            </span>
            <h1 className="text-4xl font-bold text-[#0e2a0e] tracking-[-0.03em] mb-2">
              {submitted ? 'Check Your Email' : 'Forgot Password?'}
            </h1>
            <p className="text-[0.9rem] text-[#6a8a6a]">
              {submitted 
                ? `We've sent a reset link to ${email || 'your email'}`
                : 'Enter your details to reset your password'}
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-1.5 mb-4">
                <label className="text-[0.78rem] font-bold text-[#3a5a3a] tracking-wide">Email Address</label>
                <input
                  type="email"
                  placeholder="you@university.edu.ng"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-3.5 py-3 rounded-xl border-2 border-[#e2efe2] bg-white text-[0.9rem] text-[#0e2a0e] outline-none focus:border-[#28a228] focus:ring-4 focus:ring-[#28a228]/10 transition-all w-full"
                />
              </div>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#e2efe2]"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-[#8aab92]">OR</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mb-6">
                <label className="text-[0.78rem] font-bold text-[#3a5a3a] tracking-wide">Matric Number</label>
                <input
                  type="text"
                  placeholder="e.g. 2022/245678"
                  value={matricNumber}
                  onChange={(e) => setMatricNumber(e.target.value)}
                  className="px-3.5 py-3 rounded-xl border-2 border-[#e2efe2] bg-white text-[0.9rem] text-[#0e2a0e] outline-none focus:border-[#28a228] focus:ring-4 focus:ring-[#28a228]/10 transition-all w-full"
                />
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#1e7a1e] text-white text-[0.95rem] font-bold cursor-pointer hover:bg-[#165716] transition-all hover:-translate-y-px hover:shadow-lg hover:shadow-[#1e7a1e]/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? 'Sending...' : 'Send Reset Link →'}
              </button>

              <div className="text-center mt-6 text-[0.82rem] text-[#6a8a6a]">
                Remember your password?{' '}
                <Link href="/login" className="font-bold text-[#1e7a1e] hover:underline">
                  Back to Login
                </Link>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#edfaed] flex items-center justify-center">
                <span className="text-4xl">📧</span>
              </div>
              <p className="text-[#3a5a3a] mb-6">
                We've sent a password reset link to:
                <br />
                <strong className="text-[#1e7a1e]">{email || matricNumber}</strong>
              </p>
              <p className="text-[0.8rem] text-[#8aab92] mb-6">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-[#1e7a1e] font-semibold hover:underline"
              >
                ← Try another email
              </button>
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
export default ForgotPassword;