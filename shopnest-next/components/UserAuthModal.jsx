'use client';
import { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { supabase } from '@/lib/supabaseClient';

export default function UserAuthModal() {
  const { state, dispatch, showToast } = useStore();
  
  // step 1: Google/Email Login Button
  // step 3: Profile Setup (Phone, Age, Address)
  const [step, setStep] = useState(1);
  const [checkingSession, setCheckingSession] = useState(true);
  
  // Email/Password states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [phone, setPhone] = useState('');
  const [profile, setProfile] = useState({ name: '', age: '' });
  const [address, setAddress] = useState({ doorNo: '', street: '', city: '', district: '', state: '', pincode: '' });
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

  const closeAuth = async () => {
    if (step === 3 && !state.userAuthenticated) {
      await supabase.auth.signOut();
    }
    dispatch({ type: 'CLOSE_USER_LOGIN' });
    setTimeout(() => {
      setStep(1);
      setPhone('');
      setEmail('');
      setPassword('');
      setProfile({ name: '', age: '' });
      setAddress({ doorNo: '', street: '', city: '', district: '', state: '', pincode: '' });
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
  };


  // ── STEP 1.5: Email / Password Auth ─────────────────────────────────
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password.');
      return;
    }
    setLoading(true);

    // 1. Try Supabase Auth first
    try {
      const { data: supabaseData, error: supabaseError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!supabaseError && supabaseData?.user) {
        showToast('Successfully logged in! 🎉');
        const user = supabaseData.user;
        const res = await fetch(`/api/user?email=${encodeURIComponent(user.email)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            const p = data.data;
            if (p.phone && p.address) {
              if (typeof window !== 'undefined') {
                localStorage.setItem('buyit_user_session', JSON.stringify(p));
              }
              dispatch({ type: 'HYDRATE_USER', profile: p });
              closeAuth();
              setLoading(false);
              return;
            }
          }
        }
        setStep(3);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn('Supabase login exception, trying local fallback...', err);
    }

    // 2. Fallback to Local MongoDB Express backend Auth
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok && data.success && data.data) {
        showToast('Successfully logged in! 🎉');
        
        // Fetch or create profile at /api/user
        const profileRes = await fetch(`/api/user?email=${encodeURIComponent(email)}`);
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          if (profileData.success && profileData.data) {
            const p = profileData.data;
            if (p.phone && p.address) {
              if (typeof window !== 'undefined') {
                localStorage.setItem('buyit_user_session', JSON.stringify(p));
              }
              dispatch({ type: 'HYDRATE_USER', profile: p });
              closeAuth();
              setLoading(false);
              return;
            }
          }
        }
        setStep(3);
      } else {
        showToast(`Login failed: ${data.message || 'Invalid credentials'}`);
      }
    } catch (err) {
      showToast('Authentication error. Please check backend connection.');
      console.error(err);
    }
    setLoading(false);
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password.');
      return;
    }
    setLoading(true);

    let supabaseSignedUp = false;
    
    // 1. Try Supabase Auth Sign Up
    try {
      const { error: supabaseError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (!supabaseError) {
        supabaseSignedUp = true;
      }
    } catch (err) {
      console.warn('Supabase sign up exception, trying local fallback...', err);
    }

    // 2. Register in local database via Express API
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const name = email.split('@')[0]; // Default name from email prefix
      const res = await fetch(`${apiUrl}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (supabaseSignedUp) {
          showToast('Account registered successfully! Check email or sign in directly.');
        } else {
          showToast('Account registered locally! You can sign in now.');
        }
      } else {
        showToast(`Registration failed: ${data.message || 'Error occurred'}`);
      }
    } catch (err) {
      showToast('Registration error. Please check connection.');
      console.error(err);
    }
    setLoading(false);
  };

  // ── STEP 3: Save profile to MongoDB ──────────────────────────────────
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profile.name || !profile.age || !address.doorNo || !address.street || !address.city || !address.district || !address.state || !address.pincode || phone.length < 10) {
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
          address,
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
      <div className="user-auth-modal" style={{ width: '420px' }}>
        <button className="user-auth-close" onClick={closeAuth}>✕</button>

        <div className="ua-brand" style={{ fontStyle: 'italic' }}>
          BuyIt <span className="plus-color">Plus ✦</span>
        </div>

        {checkingSession ? (
          <div className="ua-step">
            <h2>Loading...</h2>
            <p className="ua-sub">Please wait...</p>
          </div>
        ) : (
          <>
            {/* STEP 1: LOGIN CHOICES */}
            {step === 1 && (
              <div className="ua-step">
                <h2>Welcome to BuyIt</h2>
                <p className="ua-sub">Sign in to continue your shopping journey</p>
                
                <button 
                  type="button" 
                  className="ua-btn google-btn" 
                  onClick={handleGoogleLogin} 
                  disabled={loading}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', backgroundColor: '#fff', color: '#333', border: '1px solid #ccc', marginTop: '20px', width: '100%', padding: '12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '20px' }} />
                  {loading ? 'Connecting...' : 'Sign in with Google'}
                </button>
                
                <div style={{ 
                  background: '#fff9db', 
                  border: '1px solid #ffe066', 
                  borderRadius: '4px', 
                  padding: '10px 12px', 
                  marginTop: '12px', 
                  fontSize: '11px', 
                  color: '#856404', 
                  lineHeight: 1.4,
                  textAlign: 'left'
                }}>
                  ⚠️ <strong>Google Auth Notice</strong>: If you see a "site url is improperly formatted" error, it means the Supabase auth redirect URL configuration is missing in the dashboard. Please use <strong>Email Login</strong> instead!
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: '#aaa', fontSize: '12px' }}>
                  <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #eee' }} />
                  <span style={{ padding: '0 10px' }}>OR</span>
                  <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #eee' }} />
                </div>

                <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
                  <div className="ua-field">
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#878787', textTransform: 'uppercase' }}>Email Address</label>
                    <input 
                      type="email" 
                      placeholder="Enter email address" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      required
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', borderRadius: '2px', outline: 'none', fontSize: '14px' }}
                    />
                  </div>
                  <div className="ua-field">
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#878787', textTransform: 'uppercase' }}>Password</label>
                    <input 
                      type="password" 
                      placeholder="Enter password" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      required
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', borderRadius: '2px', outline: 'none', fontSize: '14px' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                    <button 
                      type="submit" 
                      className="ua-btn" 
                      disabled={loading}
                      style={{ flex: 1, background: '#2874f0', color: '#fff', border: 'none', padding: '12px', borderRadius: '2px', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}
                    >
                      {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                    <button 
                      type="button" 
                      onClick={handleEmailSignUp} 
                      disabled={loading}
                      style={{ flex: 1, background: '#fff', color: '#2874f0', border: '1px solid #2874f0', padding: '12px', borderRadius: '2px', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}
                    >
                      Sign Up
                    </button>
                  </div>
                </form>

                <p className="ua-terms" style={{ marginTop: '20px', fontSize: '11px', color: '#878787', textAlign: 'center' }}>
                  By continuing, you agree to BuyIt's Terms of Use and Privacy Policy.
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
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', borderRadius: '2px', outline: 'none', fontSize: '14px' }}
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
                        style={{ width: '100%', padding: '10px 12px', border: 'none', outline: 'none', fontSize: '14px' }}
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
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', borderRadius: '2px', outline: 'none', fontSize: '14px' }}
                    />
                  </div>
                  <div className="ua-field">
                    <label>Delivery Address</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <input type="text" placeholder="Door No / Flat" value={address.doorNo} onChange={e => setAddress({ ...address, doorNo: e.target.value })} style={{ padding: '10px 12px', border: '1px solid #ccc', borderRadius: '2px', outline: 'none', fontSize: '14px' }} />
                      <input type="text" placeholder="Street / Area" value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })} style={{ padding: '10px 12px', border: '1px solid #ccc', borderRadius: '2px', outline: 'none', fontSize: '14px' }} />
                      <input type="text" placeholder="City" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} style={{ padding: '10px 12px', border: '1px solid #ccc', borderRadius: '2px', outline: 'none', fontSize: '14px' }} />
                      <input type="text" placeholder="District" value={address.district} onChange={e => setAddress({ ...address, district: e.target.value })} style={{ padding: '10px 12px', border: '1px solid #ccc', borderRadius: '2px', outline: 'none', fontSize: '14px' }} />
                      <input type="text" placeholder="State" value={address.state} onChange={e => setAddress({ ...address, state: e.target.value })} style={{ padding: '10px 12px', border: '1px solid #ccc', borderRadius: '2px', outline: 'none', fontSize: '14px' }} />
                      <input type="text" placeholder="Pincode" value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })} style={{ padding: '10px 12px', border: '1px solid #ccc', borderRadius: '2px', outline: 'none', fontSize: '14px' }} />
                    </div>
                  </div>
                  <button type="submit" className="ua-btn" disabled={!profile.name || !profile.age || !address.doorNo || !address.street || !address.city || !address.state || !address.pincode || phone.length < 10 || loading} style={{ width: '100%', background: '#fb641b', color: '#fff', border: 'none', padding: '12px', borderRadius: '2px', fontWeight: 700, cursor: 'pointer', fontSize: '14px', marginTop: '10px' }}>
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
