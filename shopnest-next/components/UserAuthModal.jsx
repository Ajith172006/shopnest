'use client';
import { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { supabase } from '@/lib/supabaseClient';

export default function UserAuthModal() {
  const { state, dispatch, showToast } = useStore();
  
  // step 1: Google Login Button
  // step 3: Profile Setup (Phone, Age, Address)
  const [step, setStep] = useState(1);
  const [checkingSession, setCheckingSession] = useState(true);
  const [phone, setPhone] = useState('');
  const [profile, setProfile] = useState({ name: '', age: '', address: '' });
  const [loading, setLoading] = useState(false);

  // When the modal opens, if the user is already authenticated (but profile is missing), jump to step 3
  useEffect(() => {
    if (state.userLoginOpen) {
      setCheckingSession(true);
      const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setStep(3); // Jump straight to profile completion
          // Pre-fill name and email if available
          setProfile(p => ({
            ...p,
            name: session.user.user_metadata?.full_name || '',
          }));
        } else {
          setStep(1);
        }
        setCheckingSession(false);
      };
      checkSession();
    }
  }, [state.userLoginOpen]);

  if (!state.userLoginOpen) return null;

  const closeAuth = () => {
    dispatch({ type: 'CLOSE_USER_LOGIN' });
    setTimeout(() => {
      setStep(1);
      setPhone('');
      setProfile({ name: '', age: '', address: '' });
    }, 300);
  };

  // ── STEP 1: Google OAuth ────────────────────────────────────────────
  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    
    if (error) {
      showToast(`Error: ${error.message}`);
      setLoading(false);
    }
    // Note: The page will redirect to Google, so we don't need to setLoading(false) on success
  };

  // ── STEP 3: Save profile to MongoDB ──────────────────────────────────
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profile.name || !profile.age || !profile.address || phone.length < 10) {
      showToast('Please fill all details correctly to continue.');
      return;
    }
    setLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      showToast('Authentication error. Please login again.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          name: profile.name,
          phone,
          age: profile.age,
          address: profile.address,
        })
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        dispatch({ type: 'UPDATE_USER_PROFILE', profile: data.data });
        dispatch({ type: 'USER_LOGIN_SUCCESS' });
        showToast('Profile saved successfully! 🎉');
        closeAuth();
      } else {
        showToast(`Error: ${data.message || 'Failed to save profile'}`);
      }
    } catch (err) {
      showToast('Network error while saving profile.');
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div id="user-auth-overlay">
      <div className="user-auth-modal">
        <button className="user-auth-close" onClick={closeAuth}>✕</button>

        <div className="ua-brand">
          🛍 BuyIt <span>Pro ✦</span>
        </div>

        {checkingSession ? (
          <div className="ua-step">
            <h2>Loading...</h2>
            <p className="ua-sub">Please wait...</p>
          </div>
        ) : (
          <>
            {/* STEP 1: GOOGLE LOGIN */}
            {step === 1 && (
              <div className="ua-step">
                <h2>Welcome to BuyIt</h2>
                <p className="ua-sub">Sign in to continue your shopping journey</p>
                
                <button 
                  type="button" 
                  className="ua-btn google-btn" 
                  onClick={handleGoogleLogin} 
                  disabled={loading}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', backgroundColor: '#fff', color: '#333', border: '1px solid #ccc', marginTop: '20px' }}
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '20px' }} />
                  {loading ? 'Connecting...' : 'Sign in with Google'}
                </button>
                
                <p className="ua-terms">By continuing, you agree to BuyIt's Terms of Use and Privacy Policy.</p>
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
                <label>Mobile Number</label>
                <div className="phone-input">
                  <span>+91</span>
                  <input
                    type="tel"
                    maxLength="10"
                    placeholder="Enter 10-digit number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
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
                  rows={2}
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                />
              </div>
              <button type="submit" className="ua-btn" disabled={!profile.name || !profile.age || !profile.address || phone.length < 10 || loading}>
                {loading ? 'Saving...' : 'Start Shopping →'}
              </button>
            </form>
          </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
