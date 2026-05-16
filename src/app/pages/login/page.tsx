'use client';
import CoreService from '@/app/hooks/core-service';
import { useToast } from '@/app/providers/toast-provider';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const coreService: CoreService = new CoreService();

const NacosLogin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const {showToast} = useToast();
  const router = useRouter();
  // Login form state
  const [loginId, setLoginId] = useState('');
  const [loginPw, setLoginPw] = useState('');
  const [loginUniversity, setLoginUniversity] = useState('');
  const [showLoginPw, setShowLoginPw] = useState(false);

  // Signup form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [matricNumber, setMatricNumber] = useState('');
  const [universityEmail, setUniversityEmail] = useState('');
  const [signupLevel, setSignupLevel] = useState('');
  const [signupInstitution, setSignupInstitution] = useState('');
  const [signupPw, setSignupPw] = useState('');
  const [showSignupPw, setShowSignupPw] = useState(false);
  const [pwStrength, setPwStrength] = useState({ score: 0, text: 'Enter a password', color: '#6a8a6a' });
  
  const universities = [
    'University of Nigeria, Nsukka',
    'University of Lagos',
    'Obafemi Awolowo University',
    'University of Ibadan',
    'Ahmadu Bello University',
    'Federal University of Technology Akure',
    'University of Benin',
    'University of Port Harcourt',
    'Other'
  ];

  const levelOptions = ['100 Level', '200 Level', '300 Level', '400 Level', '500 Level'];
  const institutionOptions = ['UNN', 'UNILAG', 'OAU', 'UI', 'ABU', 'FUTA', 'UNIBEN', 'UNIPORT', 'Other'];

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

  const handleLogin = async(e:any) => {
    e.preventDefault();
    //showToast("Login functionality is not implemented yet. This is just a demo.", "info");
    const payload = {
      "mat_no": loginId,
      "password": loginPw,
    }
    try{
      const res = await coreService.send('users/login', payload);
      if(res.success){
        showToast(res.message || 'Login successful','success');
      }else{
        showToast(res.message || 'Login failed. Please check your credentials and try again.','error');
      }
    }catch(err){
        showToast('Login failed. Please check your credentials and try again.','error');
    }
  };

  const verifyMatNumber = async() => {
      try{
        const res =  await coreService.get(`users/verify-mat-no?mat_no=${loginId}`);
        if(res.success && res.data != null){
          showToast('Create a new Password');
          router.push('/pages/login/reset-password');
        }else{

        }
      }catch(e:any){
        showToast(e.message);
      }
  }

  useEffect(() => {
  if (loginId.length !== 15) return;

  const timer = setTimeout(() => {
    verifyMatNumber();
  }, 800);

  return () => clearTimeout(timer);
}, [loginId]);

  const handleSignup = (e:any) => {
    e.preventDefault();
    showToast('Implement Sign in here','info');
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex flex-col justify-between bg-linear-to-br from-[#062206] via-[#0e3d0e] to-[#165716] p-12 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute -top-20 -right-20 w-100 h-100 rounded-full bg-[radial-gradient(circle,rgba(60,196,60,0.15),transparent_70%)]" />
        <div className="absolute -bottom-16 -left-16 w-75 h-75 rounded-full bg-[radial-gradient(circle,rgba(40,162,40,0.1),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[28px_28px]" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-11 h-11 rounded-xl bg-linear-to-br from-[#28a228] to-[#72d872] flex items-center justify-center font-bold text-white text-base">N</div>
            <div className="text-white text-xl font-bold tracking-tight">NAC<span className="text-[#72d872]">OS</span> Nigeria</div>
          </div>

          <h2 className="text-white text-[2.8rem] font-bold leading-[1.1] tracking-[-0.03em] mb-5">
            Your Academic<br />
            <span className="text-[#72d872]">Journey Starts</span><br />
            Here.
          </h2>
          <p className="text-white/55 text-base leading-relaxed max-w-90">
            Log in to access study materials, view your results, track events, and connect with thousands of CS students across Nigeria.
          </p>

          <div className="flex flex-col gap-3 mt-10">
            {[
              { icon: '📚', text: 'Access 200+ study materials by level' },
              { icon: '📊', text: 'View your semester results & GPA tracker' },
              { icon: '🗓️', text: 'Register for events, workshops & hackathons' },
              { icon: '🔔', text: 'Get real-time updates & exam notifications' },
              { icon: '🤝', text: 'Connect with NACOS excos & peers' }
            ].map((feat, idx) => (
              <div key={idx} className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/8 rounded-xl backdrop-blur-sm">
                <span className="text-base">{feat.icon}</span>
                <span className="text-[0.85rem] text-white/70 font-medium">{feat.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/30 text-[0.78rem]">
            © 2025 NACOS Nigeria · <a href="nacos_main.html" className="text-white/50 hover:text-[#72d872] no-underline hover:underline">Visit Website</a> · <a href="#" className="text-white/50 hover:text-[#72d872] no-underline hover:underline">Privacy</a> · <a href="#" className="text-white/50 hover:text-[#72d872] no-underline hover:underline">Support</a>
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="bg-white flex items-center justify-center p-12">
        <div className="w-full max-w-105 animate-[fadeIn_0.5s_ease]">
          <div className="mb-10">
            <span className="text-[0.72rem] font-bold text-[#1e7a1e] tracking-[0.08em] uppercase bg-[#edfaed] border border-[#d4f7d4] px-3 py-1 rounded-full inline-block mb-4">
              Student Portal
            </span>
            <h1 className="text-4xl font-bold text-[#0e2a0e] tracking-[-0.03em] mb-1">
              {activeTab === 'login' ? 'Welcome back' : 'Join NACOS'}
            </h1>
            <p className="text-[0.9rem] text-[#6a8a6a]">
              {activeTab === 'login' 
                ? 'Sign in to your NACOS account · ' 
                : 'Create your student account · '}
              <a href="nacos_main.html" className="text-[#1e7a1e] font-semibold no-underline hover:underline">← Back to website</a>
            </p>
          </div>

          {/* Tabs */}
          <div className="flex bg-[#edfaed] rounded-full p-1 mb-8 border border-[#d4f7d4]">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 rounded-full text-[0.85rem] font-semibold transition-all cursor-pointer ${
                activeTab === 'login' 
                  ? 'bg-white text-[#165716] shadow-sm' 
                  : 'bg-transparent text-[#6a8a6a]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-2 rounded-full text-[0.85rem] font-semibold transition-all cursor-pointer ${
                activeTab === 'signup' 
                  ? 'bg-white text-[#165716] shadow-sm' 
                  : 'bg-transparent text-[#6a8a6a]'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* LOGIN FORM */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-1.5 mb-4">
                <label className="text-[0.78rem] font-bold text-[#3a5a3a] tracking-wide">Matric Number</label>
                <input
                  type="text"
                  placeholder="e.g. UJ/2005/NS/0022"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  className="px-3.5 py-3 rounded-xl border-2 border-[#e2efe2] bg-white text-[0.9rem] text-[#0e2a0e] outline-none focus:border-[#28a228] focus:ring-4 focus:ring-[#28a228]/10 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5 mb-4">
                <label className="text-[0.78rem] font-bold text-[#3a5a3a] tracking-wide">Password</label>
                <div className="relative">
                  <input
                    type={showLoginPw ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={loginPw}
                    onChange={(e) => setLoginPw(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl border-2 border-[#e2efe2] bg-white text-[0.9rem] text-[#0e2a0e] outline-none focus:border-[#28a228] focus:ring-4 focus:ring-[#28a228]/10 transition-all pr-11"
                  />
                  <span
                    onClick={() => setShowLoginPw(!showLoginPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#6a8a6a] text-sm select-none"
                  >
                    {showLoginPw ? '🙈' : '👁'}
                  </span>
                </div>
              </div>

              

              <div className="text-right -mt-2 mb-4">
                <a href="/pages/login/forgot-password" className="text-[0.8rem] font-semibold text-[#1e7a1e] no-underline hover:underline">Forgot password?</a>
              </div>

              <button type="submit" className="w-full py-3 rounded-xl bg-[#1e7a1e] text-white text-[0.95rem] font-bold border-none cursor-pointer hover:bg-[#165716] transition-all hover:-translate-y-px hover:shadow-lg hover:shadow-[#1e7a1e]/25 mt-2">
                Sign In to Dashboard →
              </button>

              <div className="flex items-center gap-3 my-6 text-[#b0c4b0] text-[0.8rem]">
                <div className="flex-1 h-px bg-[#e2efe2]" />
                or continue with
                <div className="flex-1 h-px bg-[#e2efe2]" />
              </div>

              <button type="button" className="w-full py-3 rounded-xl border-2 border-[#e2efe2] bg-white text-[0.88rem] font-semibold flex items-center justify-center gap-2.5 text-[#0e2a0e] hover:bg-[#edfaed] hover:border-[#72d872] transition-all cursor-pointer">
                🔵 Sign in with Google (.edu.ng)
              </button>

              <div className="text-center mt-6 text-[0.82rem] text-[#6a8a6a]">
                New to NACOS?{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('signup'); }} className="font-bold text-[#1e7a1e] no-underline hover:underline">
                  Create your account
                </a>
              </div>
            </form>
          )}

          {/* SIGNUP FORM */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignup}>
              <div className="grid grid-cols-2 gap-3 mb-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.78rem] font-bold text-[#3a5a3a] tracking-wide">First Name</label>
                  <input
                    type="text"
                    placeholder="Emeka"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="px-3.5 py-3 rounded-xl border-2 border-[#e2efe2] bg-white text-[0.9rem] text-[#0e2a0e] outline-none focus:border-[#28a228] focus:ring-4 focus:ring-[#28a228]/10 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.78rem] font-bold text-[#3a5a3a] tracking-wide">Last Name</label>
                  <input
                    type="text"
                    placeholder="Okafor"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="px-3.5 py-3 rounded-xl border-2 border-[#e2efe2] bg-white text-[0.9rem] text-[#0e2a0e] outline-none focus:border-[#28a228] focus:ring-4 focus:ring-[#28a228]/10 transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mb-3">
                <label className="text-[0.78rem] font-bold text-[#3a5a3a] tracking-wide">Matric Number</label>
                <input
                  type="text"
                  placeholder="e.g. 2022/245678"
                  value={matricNumber}
                  onChange={(e) => setMatricNumber(e.target.value)}
                  className="px-3.5 py-3 rounded-xl border-2 border-[#e2efe2] bg-white text-[0.9rem] text-[#0e2a0e] outline-none focus:border-[#28a228] focus:ring-4 focus:ring-[#28a228]/10 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5 mb-3">
                <label className="text-[0.78rem] font-bold text-[#3a5a3a] tracking-wide">University Email</label>
                <input
                  type="email"
                  placeholder="you@university.edu.ng"
                  value={universityEmail}
                  onChange={(e) => setUniversityEmail(e.target.value)}
                  className="px-3.5 py-3 rounded-xl border-2 border-[#e2efe2] bg-white text-[0.9rem] text-[#0e2a0e] outline-none focus:border-[#28a228] focus:ring-4 focus:ring-[#28a228]/10 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.78rem] font-bold text-[#3a5a3a] tracking-wide">Level</label>
                  <select
                    value={signupLevel}
                    onChange={(e) => setSignupLevel(e.target.value)}
                    className="px-3.5 py-3 rounded-xl border-2 border-[#e2efe2] bg-white text-[0.9rem] text-[#0e2a0e] outline-none focus:border-[#28a228] focus:ring-4 focus:ring-[#28a228]/10 transition-all"
                  >
                    <option value="">Select…</option>
                    {levelOptions.map((level, idx) => (
                      <option key={idx}>{level}</option>
                    ))}
                  </select>
                </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.78rem] font-bold text-[#3a5a3a] tracking-wide">Institution</label>
                <select
                  value={signupInstitution}
                  onChange={(e) => setSignupInstitution(e.target.value)}
                  className="px-3.5 py-3 rounded-xl border-2 border-[#e2efe2] bg-white text-[0.9rem] text-[#0e2a0e] outline-none focus:border-[#28a228] focus:ring-4 focus:ring-[#28a228]/10 transition-all"
                >
                  <option value="">Select…</option>
                  {institutionOptions.map((inst, idx) => (
                    <option key={idx}>{inst}</option>
                  ))}
                </select>
              </div>
              </div>

              <div className="flex flex-col gap-1.5 mb-3">
                <label className="text-[0.78rem] font-bold text-[#3a5a3a] tracking-wide">Password</label>
                <div className="relative">
                  <input
                    type={showSignupPw ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={signupPw}
                    onChange={(e) => {
                      setSignupPw(e.target.value);
                      checkStrength(e.target.value);
                    }}
                    className="w-full px-3.5 py-3 rounded-xl border-2 border-[#e2efe2] bg-white text-[0.9rem] text-[#0e2a0e] outline-none focus:border-[#28a228] focus:ring-4 focus:ring-[#28a228]/10 transition-all pr-11"
                  />
                  <span
                    onClick={() => setShowSignupPw(!showSignupPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#6a8a6a] text-sm select-none"
                  >
                    {showSignupPw ? '🙈' : '👁'}
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

              <button type="submit" className="w-full py-3 rounded-xl bg-[#1e7a1e] text-white text-[0.95rem] font-bold border-none cursor-pointer hover:bg-[#165716] transition-all hover:-translate-y-px hover:shadow-lg hover:shadow-[#1e7a1e]/25 mt-2">
                Create My Account →
              </button>

              <div className="text-center mt-6 text-[0.82rem] text-[#6a8a6a]">
                Already have an account?{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('login'); }} className="font-bold text-[#1e7a1e] no-underline hover:underline">
                  Sign in
                </a>
              </div>

              <div className="text-center text-[0.73rem] text-[#b0c4b0] mt-6 leading-relaxed">
                By creating an account you agree to NACOS{' '}
                <a href="#" className="text-[#6a8a6a] no-underline hover:text-[#1e7a1e]">Terms of Use</a> and{' '}
                <a href="#" className="text-[#6a8a6a] no-underline hover:text-[#1e7a1e]">Privacy Policy</a>
              </div>
            </form>
          )}
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
};

export default NacosLogin;