'use client';
import { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { supabase } from '@/lib/supabaseClient';

export default function UserAuthModal() {
  const { state, dispatch, showToast } = useStore();
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP, 3: Profile
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // 6-digit real OTP
  const [profile, setProfile] = useState({ name: '', age: '', address: '' });
  const [loading, setLoading] = useState(false);

  if (!state.userLoginOpen) return null;

  const closeAuth = () => {
    dispatch({ type: 'CLOSE_USER_LOGIN' });
    setTimeout(() => {
      setStep(1);
      setPhone('');
      setOtp(['', '', '', '', '', '']);
      setProfile({ name: '', age: '', address: '' });
    }, 300);
  };

  // ── STEP 1: Send real OTP via Supabase ──────────────────────────────
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (phone.length < 10) {
      showToast('Please enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    const fullPhone = `+91${phone}`;
    const { error } = await supabase.auth.signInWithOtp({ phone: fullPhone });
    setLoading(false);
    if (error) {
      showToast(`Error: ${error.message}`);
    } else {
      setStep(2);
      showToast('OTP sent! Check your SMS.');
    }
  };

  // ── STEP 2: Verify OTP via Supabase ────────────────────────────────
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const token = otp.join('');
    if (token.length < 6) {
      showToast('Please enter the 6-digit OTP.');
      return;
    }
    setLoading(true);
    const fullPhone = `+91${phone}`;
    const { data, error } = await supabase.auth.verifyOtp({
      phone: fullPhone,
      token,
      type: 'sms',
    });
    setLoading(false);

    if (error) {
      showToast(`Invalid OTP: ${error.message}`);
      return;
    }

    // Session established — check if profile already saved
    const userId = data.user?.id;
    const saved = localStorage.getItem(`buyit_profile_${userId}`);
    if (saved) {
      const p = JSON.parse(saved);
      dispatch({ type: 'USER_LOGIN_SUCCESS' });
      dispatch({ type: 'UPDATE_USER_PROFILE', profile: p });
      localStorage.setItem('buyit_user_session', JSON.stringify(p));
      showToast(`Welcome back, ${p.name}!`);
      closeAuth();
    } else {
      setStep(3);
    }
  };

  // ── Resend OTP ──────────────────────────────────────────────────────
  const handleResend = async () => {
    setOtp(['', '', '', '', '', '']);
    const fullPhone = `+91${phone}`;
    const { error } = await supabase.auth.signInWithOtp({ phone: fullPhone });
    if (error) {
      showToast(`Resend failed: ${error.message}`);
    } else {
      showToast('OTP resent! Check your SMS.');
    }
  };

  // ── STEP 3: Save profile ────────────────────────────────────────────
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profile.name || !profile.age || !profile.address) {
      showToast('Please fill all details to continue.');
      return;
    }
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;
    const p = { ...profile, phone, userId };
    localStorage.setItem(`buyit_profile_${userId}`, JSON.stringify(p));
    localStorage.setItem('buyit_user_session', JSON.stringify(p));
    dispatch({ type: 'UPDATE_USER_PROFILE', profile: p });
    dispatch({ type: 'USER_LOGIN_SUCCESS' });
    showToast('Profile created! Welcome to BuyIt 🎉');
    setLoading(false);
    closeAuth();
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  return (
    <div id="user-auth-overlay">
      <div className="user-auth-modal">
        <button className="user-auth-close" onClick={closeAuth}>✕</button>

        <div className="ua-brand">
          🛍 BuyIt <span>Pro ✦</span>
        </div>

        {/* STEP 1: PHONE */}
        {step === 1 && (
          <div className="ua-step">
            <h2>Login or Signup</h2>
            <p className="ua-sub">Enter your mobile number to continue</p>
            <form onSubmit={handleSendOtp}>
              <div className="ua-field">
                <label>Mobile Number</label>
                <div className="phone-input">
                  <span>+91</span>
                  <input
                    type="tel"
                    maxLength="10"
                    placeholder="Enter 10-digit number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    autoFocus
                  />
                </div>
              </div>
              <button type="submit" className="ua-btn" disabled={phone.length < 10 || loading}>
                {loading ? 'Sending OTP...' : 'Continue'}
              </button>
            </form>
            <p className="ua-terms">By continuing, you agree to BuyIt's Terms of Use and Privacy Policy.</p>
          </div>
        )}

        {/* STEP 2: OTP (6 digits) */}
        {step === 2 && (
          <div className="ua-step">
            <h2>Verify Mobile</h2>
            <p className="ua-sub">Enter the 6-digit OTP sent to +91 {phone}</p>
            <form onSubmit={handleVerifyOtp}>
              <div className="otp-container">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !digit && i > 0) {
                        document.getElementById(`otp-${i - 1}`).focus();
                      }
                    }}
                    autoFocus={i === 0}
                  />
                ))}
              </div>
              <button type="submit" className="ua-btn" disabled={otp.join('').length < 6 || loading}>
                {loading ? 'Verifying...' : 'Verify & Proceed'}
              </button>
            </form>
            <p className="ua-resend" onClick={handleResend}>
              Didn't receive code? <span>Resend</span>
            </p>
          </div>
        )}

        {/* STEP 3: PROFILE SETUP */}
        {step === 3 && (
          <div className="ua-step">
            <h2>Complete Profile</h2>
            <p className="ua-sub">Tell us a bit about yourself</p>
            <form onSubmit={handleSaveProfile} className="ua-profile-form">
              <div className="ua-field">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  autoFocus
                />
              </div>
              <div className="ua-field">
                <label>Age</label>
                <input
                  type="number"
                  placeholder="e.g. 25"
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                />
              </div>
              <div className="ua-field">
                <label>Delivery Address</label>
                <textarea
                  placeholder="Enter full address..."
                  rows={3}
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                />
              </div>
              <button type="submit" className="ua-btn" disabled={!profile.name || !profile.age || !profile.address || loading}>
                {loading ? 'Saving...' : 'Start Shopping →'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
