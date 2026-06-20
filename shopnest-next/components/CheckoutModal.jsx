'use client';
import { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { formatNumber } from '@/lib/utils';

export default function CheckoutModal() {
  const { state, dispatch, cartTotal, showToast } = useStore();
  
  // Checkout Accordion Steps
  const [step, setStep] = useState(1); // 1: Delivery Address, 2: Order Summary, 3: Payment Options
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [addr, setAddr] = useState('');

  // Payment Options states
  const [subMethod, setSubMethod] = useState('UPI'); // UPI, CARD, EMI, PAY_LATER, COD, STRIPE
  const [cardNo, setCardNo] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [upiVerifying, setUpiVerifying] = useState(false);
  const [upiVerified, setUpiVerified] = useState(false);
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [emiBank, setEmiBank] = useState('HDFC Bank');
  const [emiTenure, setEmiTenure] = useState(3); // 3, 6, 12 months
  const [payLaterBalance, setPayLaterBalance] = useState(20000);
  
  const paymentTabs = [
    { id: 'UPI', label: 'UPI' },
    { id: 'CARD', label: 'Credit/Debit Card' },
    { id: 'EMI', label: 'EMI (Installments)' },
    { id: 'PAY_LATER', label: 'BuyIt Pay Later' },
    { id: 'COD', label: 'Cash on Delivery' },
    { id: 'STRIPE', label: 'Stripe Express' }
  ];

  useEffect(() => {
    if (state.checkoutOpen && state.userProfile) {
      setName(state.userProfile.name || '');
      setPhone(state.userProfile.phone || '');
      if (state.userProfile.savedAddresses && state.userProfile.savedAddresses.length > 0) {
        const defaultAddr = state.userProfile.savedAddresses.find(a => a.isDefault) || state.userProfile.savedAddresses[0];
        setAddr(`${defaultAddr.doorNo}, ${defaultAddr.street}, ${defaultAddr.city}, ${defaultAddr.state} - ${defaultAddr.pincode}`);
      } else {
        setAddr(state.userProfile.address || '');
      }
      setStep(1); // Reset to step 1 when opening checkout
      // Reset payment variables
      setCardNo('');
      setCardName('');
      setCardExpiry('');
      setCardCvv('');
      setUpiId('');
      setUpiVerified(false);
      setUpiVerifying(false);
      setCaptchaCode(Math.floor(1000 + Math.random() * 9000).toString());
      setCaptchaInput('');
      setSubMethod('UPI');
    }
  }, [state.checkoutOpen, state.userProfile]);

  const handleDeliverHere = () => {
    if (!name.trim()) { showToast('Please fill in your name'); return; }
    if (!phone.trim()) { showToast('Please fill in your phone number'); return; }
    if (!addr.trim()) { showToast('Please fill in your delivery address'); return; }
    setStep(2); // Go to Order Summary
  };

  const handleOrderSummaryContinue = () => {
    setStep(3); // Go to Payment Options
  };

  const handleVerifyUpi = () => {
    if (!upiId.trim() || !upiId.includes('@')) {
      showToast('Please enter a valid UPI ID (e.g. user@bank)');
      return;
    }
    setUpiVerifying(true);
    setTimeout(() => {
      setUpiVerifying(false);
      setUpiVerified(true);
      showToast('✓ UPI ID Verified Successfully!');
    }, 1500);
  };

  const handleRefreshCaptcha = () => {
    setCaptchaCode(Math.floor(1000 + Math.random() * 9000).toString());
    setCaptchaInput('');
  };

  const handleCardNoChange = (e) => {
    let val = e.target.value.replace(/\D/g, ''); // digit only
    if (val.length > 16) val = val.substring(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNo(formatted);
  };

  const handleCardExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.substring(0, 4);
    if (val.length > 2) {
      setCardExpiry(val.substring(0, 2) + '/' + val.substring(2));
    } else {
      setCardExpiry(val);
    }
  };

  const handleCardCvvChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 3) val = val.substring(0, 3);
    setCardCvv(val);
  };

  const placeOrder = async () => {
    let paymentMethodValue = 'upi';
    let paymentStatusValue = 'pending';

    if (subMethod === 'STRIPE') {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/payments/create-checkout-session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: state.cart,
            customer_email: state.userProfile?.email
          }),
        });
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          showToast('Failed to start checkout session');
        }
      } catch (err) {
        showToast('Payment error. Please try again.');
      }
      return;
    }

    if (subMethod === 'UPI') {
      if (!upiVerified) {
        showToast('Please enter and verify your UPI ID first!');
        return;
      }
      paymentMethodValue = 'upi';
      paymentStatusValue = 'completed';
    } else if (subMethod === 'CARD') {
      const cleanCardNo = cardNo.replace(/\s+/g, '');
      if (cleanCardNo.length !== 16 || !/^\d+$/.test(cleanCardNo)) {
        showToast('Card number must be exactly 16 digits.');
        return;
      }
      if (!cardName.trim()) {
        showToast('Please enter the name on the card.');
        return;
      }
      if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        showToast('Expiry date must be in MM/YY format.');
        return;
      }
      const [expMonth, expYear] = cardExpiry.split('/').map(Number);
      if (expMonth < 1 || expMonth > 12) {
        showToast('Expiry month must be between 01 and 12.');
        return;
      }
      if (cardCvv.length !== 3 || !/^\d+$/.test(cardCvv)) {
        showToast('CVV must be exactly 3 digits.');
        return;
      }
      paymentMethodValue = 'credit-card';
      paymentStatusValue = 'completed';
    } else if (subMethod === 'EMI') {
      paymentMethodValue = 'credit-card';
      paymentStatusValue = 'completed';
    } else if (subMethod === 'PAY_LATER') {
      if (cartTotal > payLaterBalance) {
        showToast('Insufficient balance in BuyIt Pay Later!');
        return;
      }
      paymentMethodValue = 'pay-later';
      paymentStatusValue = 'completed';
    } else if (subMethod === 'COD') {
      if (captchaInput !== captchaCode) {
        showToast('Incorrect captcha code. Please try again.');
        handleRefreshCaptcha();
        return;
      }
      paymentMethodValue = 'cod';
      paymentStatusValue = 'pending';
    }

    // Process Mock Order placement in backend
    try {
      const order = {
        userId: state.userProfile?.id || state.userProfile?._id || null,
        items: state.cart.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.qty,
          image: item.image
        })),
        shippingAddress: {
          name, phone, street: addr, city: '', state: '', pincode: '', country: 'India'
        },
        totalAmount: cartTotal,
        subtotal: cartTotal,
        paymentMethod: paymentMethodValue,
        paymentStatus: paymentStatusValue,
        orderStatus: 'pending'
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      
      const data = await res.json();
      if (data.success) {
        dispatch({ type: 'PLACE_ORDER', order: data.data });
        showToast('🎉 Order placed successfully! Order ID: ' + data.data._id);
        // If pay later was used, mock deduct the balance
        if (subMethod === 'PAY_LATER') {
          setPayLaterBalance(prev => prev - cartTotal);
        }
      } else {
        showToast('Failed to place order: ' + data.message);
      }
    } catch (err) {
      showToast('Order placement error. Please try again.');
    }
  };

  if (!state.checkoutOpen) return null;

  return (
    <>
      <div id="overlay" className="show" onClick={() => dispatch({ type: 'CLOSE_CHECKOUT' })} />
      
      <div id="checkout-modal" className="open" style={{ width: '720px', padding: '24px', maxHeight: '95vh', overflowY: 'auto', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '20px', borderBottom: '1px solid #e0e0e0', paddingBottom: '12px', marginBottom: '16px' }}>
          🛒 BuyIT Checkout
        </h2>

        {/* STEP 1: DELIVERY ADDRESS */}
        <div className="checkout-step" style={{ border: '1px solid #e0e0e0', borderRadius: '4px', marginBottom: '12px', overflow: 'hidden' }}>
          <div 
            className={`checkout-step-header ${step === 1 ? 'active' : ''}`}
            style={{
              background: step === 1 ? '#2874f0' : '#f5f7fa',
              color: step === 1 ? '#fff' : '#878787',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
            onClick={() => step > 1 && setStep(1)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, fontSize: '14px' }}>
              <span style={{
                background: step === 1 ? '#fff' : '#2874f0',
                color: step === 1 ? '#2874f0' : '#fff',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px'
              }}>1</span>
              <span>DELIVERY ADDRESS</span>
            </div>
            {step > 1 && (
              <button style={{ background: 'none', border: 'none', color: '#2874f0', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}>
                CHANGE
              </button>
            )}
          </div>

          {step === 1 && (
            <div className="checkout-step-body" style={{ padding: '16px', background: '#fff' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', borderRadius: '2px', outline: 'none', fontSize: '14px' }}
                />
                <input 
                  type="text" 
                  placeholder="10-digit mobile number" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', borderRadius: '2px', outline: 'none', fontSize: '14px' }}
                />
                
                {state.userProfile?.savedAddresses?.length > 0 ? (
                  <select 
                    value={addr} 
                    onChange={e => setAddr(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', borderRadius: '2px', outline: 'none', fontSize: '14px' }}
                  >
                    {state.userProfile.savedAddresses.map((a, i) => (
                      <option key={i} value={`${a.doorNo}, ${a.street}, ${a.city}, ${a.state} - ${a.pincode}`}>
                        {a.label}: {a.doorNo}, {a.street}, {a.city}
                      </option>
                    ))}
                    <option value="">Enter New Address Below</option>
                  </select>
                ) : null}

                <input 
                  type="text" 
                  placeholder="Delivery Address (Area and Street)" 
                  value={addr} 
                  onChange={e => setAddr(e.target.value)} 
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', borderRadius: '2px', outline: 'none', fontSize: '14px' }}
                />
                <button 
                  onClick={handleDeliverHere}
                  style={{ background: '#fb641b', color: '#fff', border: 'none', padding: '12px 24px', fontWeight: 700, borderRadius: '2px', cursor: 'pointer', alignSelf: 'flex-start', textTransform: 'uppercase', fontSize: '13px' }}
                >
                  Deliver Here
                </button>
              </div>
            </div>
          )}

          {step > 1 && (
            <div style={{ padding: '12px 16px', background: '#fff', fontSize: '13px', color: '#212121', borderTop: '1px solid #f0f0f0' }}>
              <strong>{name}</strong> <span style={{ color: '#878787', marginLeft: '10px' }}>{phone}</span>
              <p style={{ marginTop: '4px', color: '#555' }}>{addr}</p>
            </div>
          )}
        </div>

        {/* STEP 2: ORDER SUMMARY */}
        <div className="checkout-step" style={{ border: '1px solid #e0e0e0', borderRadius: '4px', marginBottom: '12px', overflow: 'hidden' }}>
          <div 
            className={`checkout-step-header ${step === 2 ? 'active' : ''}`}
            style={{
              background: step === 2 ? '#2874f0' : '#f5f7fa',
              color: step === 2 ? '#fff' : '#878787',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
            onClick={() => step > 2 && setStep(2)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, fontSize: '14px' }}>
              <span style={{
                background: step === 2 ? '#fff' : '#2874f0',
                color: step === 2 ? '#2874f0' : '#fff',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px'
              }}>2</span>
              <span>ORDER SUMMARY</span>
            </div>
          </div>

          {step === 2 && (
            <div className="checkout-step-body" style={{ padding: '16px', background: '#fff' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                {state.cart.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '12px', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>
                    <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#212121', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.name}</div>
                      <div style={{ fontSize: '11px', color: '#878787', marginTop: '2px' }}>Qty: {item.qty}</div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#212121' }}>₹{formatNumber(item.price * item.qty)}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#878787' }}>Order confirmation email will be sent to <strong>{state.userProfile?.email}</strong></span>
                <button 
                  onClick={handleOrderSummaryContinue}
                  style={{ background: '#fb641b', color: '#fff', border: 'none', padding: '12px 24px', fontWeight: 700, borderRadius: '2px', cursor: 'pointer', textTransform: 'uppercase', fontSize: '13px' }}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step > 2 && (
            <div style={{ padding: '12px 16px', background: '#fff', fontSize: '13px', color: '#212121', borderTop: '1px solid #f0f0f0' }}>
              Confirmed {state.cart.reduce((s, c) => s + c.qty, 0)} items — <strong>₹{formatNumber(cartTotal)}</strong>
            </div>
          )}
        </div>

        {/* STEP 3: PAYMENT OPTIONS */}
        <div className="checkout-step" style={{ border: '1px solid #e0e0e0', borderRadius: '4px', marginBottom: '16px', overflow: 'hidden' }}>
          <div 
            className={`checkout-step-header ${step === 3 ? 'active' : ''}`}
            style={{
              background: step === 3 ? '#2874f0' : '#f5f7fa',
              color: step === 3 ? '#fff' : '#878787',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              fontWeight: 700,
              fontSize: '14px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                background: step === 3 ? '#fff' : '#2874f0',
                color: step === 3 ? '#2874f0' : '#fff',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px'
              }}>3</span>
              <span>PAYMENT OPTIONS</span>
            </div>
          </div>

          {step === 3 && (
            <div className="checkout-step-body" style={{ padding: '0', background: '#fff' }}>
              <div style={{ display: 'flex', minHeight: '360px' }}>
                {/* Left Panel - Tabs */}
                <div style={{ width: '200px', background: '#f5f7fa', borderRight: '1px solid #e0e0e0' }}>
                  {paymentTabs.map(tab => (
                    <div
                      key={tab.id}
                      onClick={() => setSubMethod(tab.id)}
                      style={{
                        padding: '14px 16px',
                        fontSize: '13px',
                        fontWeight: subMethod === tab.id ? 700 : 500,
                        color: subMethod === tab.id ? '#2874f0' : '#212121',
                        background: subMethod === tab.id ? '#fff' : 'transparent',
                        borderLeft: subMethod === tab.id ? '4px solid #2874f0' : '4px solid transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        borderBottom: '1px solid #e2e8f0'
                      }}
                    >
                      {tab.label}
                    </div>
                  ))}
                </div>

                {/* Right Panel - Active Form */}
                <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ flex: 1 }}>
                    {subMethod === 'UPI' && (
                      <div>
                        <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#212121' }}>Pay via UPI</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <input
                                type="text"
                                placeholder="Enter UPI ID (e.g. user@okaxis)"
                                value={upiId}
                                onChange={e => { setUpiId(e.target.value); setUpiVerified(false); }}
                                style={{ flex: 1, padding: '10px 12px', border: '1px solid #ccc', borderRadius: '2px', outline: 'none', fontSize: '13px' }}
                              />
                              <button
                                onClick={handleVerifyUpi}
                                disabled={upiVerifying || upiVerified}
                                style={{
                                  background: upiVerified ? '#4caf50' : '#2874f0',
                                  color: '#fff',
                                  border: 'none',
                                  padding: '10px 16px',
                                  fontWeight: 600,
                                  borderRadius: '2px',
                                  cursor: (upiVerifying || upiVerified) ? 'default' : 'pointer',
                                  fontSize: '12px'
                                }}
                              >
                                {upiVerifying ? 'Verifying...' : upiVerified ? 'Verified ✓' : 'Verify'}
                              </button>
                            </div>
                            {upiVerified && <span style={{ color: '#4caf50', fontSize: '11px', display: 'block', marginTop: '4px' }}>✓ Ready for payment</span>}
                          </div>

                          <div style={{ borderTop: '1px dashed #ccc', paddingTop: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <svg width="100" height="100" viewBox="0 0 29 29" style={{ border: '1px solid #ddd', padding: '4px', background: '#fff', borderRadius: '4px' }}>
                              <path d="M0 0h7v7H0zm1 1v5h5V1zm1 1h3v3H2zm8-2h1v1h-1zm2 0h1v1h-1zm1 0h3v1h-3zm4 0h1v1h-1zm2 0h2v1h-2zm-10 2h1v2h-1zm2 0h1v1h-1zm2 0h1v1h-1zm1 0h2v1h-2zm3 0h1v1h-1zm2 0h2v1h-2zm-9 2h1v1h-1zm2 0h2v1h-2zm3 0h1v1h-1zm3 0h1v1h-1zm-9 2h1v1h-1zm3 0h1v1h-1zm1 0h1v1h-1zm2 0h2v1h-2zm3 0h1v2h-1zm1 0h1v1h-1zm-13 2h7v7H0zm1 1v5h5V10zm1 1h3v3H2zm8-2h1v1h-1zm1 0h1v1h-1zm2 0h2v1h-2zm4 0h1v1h-1zm1 0h2v1h-2zm-9 2h1v1h-1zm2 0h1v1h-1zm2 0h2v1h-2zm3 0h1v1h-1zm2 0h1v1h-1zm1 0h1v1h-1zm-9 2h2v1h-2zm3 0h1v1h-1zm1 0h1v2h-1zm2 0h1v1h-1zm3 0h1v1h-1zm2 0h2v1h-2zm-12 2h1v1h-1zm1 0h1v1h-1zm3 0h1v1h-1zm3 0h2v1h-2zm2 0h1v1h-1zm-10 2h1v1h-1zm2 0h1v1h-1zm1 0h1v1h-1zm3 0h1v1h-1zm1 0h1v1h-1zm2 0h2v1h-2zm1 0h1v1h-1z" fill="#000" />
                            </svg>
                            <div style={{ fontSize: '12px', color: '#555', lineHeight: 1.4 }}>
                              <strong>Scan QR Code to pay</strong>
                              <br />
                              Scan this QR code using any UPI app (GPay, PhonePe, Paytm, BHIM) to pay instantly.
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {subMethod === 'CARD' && (
                      <div>
                        <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#212121' }}>Enter Card Details</h4>
                        
                        {/* Live Credit Card preview */}
                        <div style={{
                          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                          color: '#fff',
                          borderRadius: '8px',
                          padding: '16px',
                          marginBottom: '16px',
                          fontFamily: 'monospace',
                          height: '135px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '11px', letterSpacing: '1px', fontWeight: 'bold' }}>CREDIT CARD</span>
                            <span style={{ fontSize: '16px', fontWeight: 'bold', fontStyle: 'italic' }}>
                              {cardNo.replace(/\s+/g, '').startsWith('4') ? 'VISA' : cardNo.replace(/\s+/g, '').startsWith('5') ? 'MASTERCARD' : cardNo.replace(/\s+/g, '').startsWith('3') ? 'AMEX' : 'BANK'}
                            </span>
                          </div>
                          <div style={{ fontSize: '16px', letterSpacing: '2px', margin: '8px 0' }}>
                            {cardNo ? cardNo : '•••• •••• •••• ••••'}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                              <div style={{ fontSize: '7px', color: '#cbd5e1' }}>CARDHOLDER</div>
                              <div style={{ fontSize: '11px', textTransform: 'uppercase' }}>{cardName ? cardName : 'YOUR NAME'}</div>
                            </div>
                            <div>
                              <div style={{ fontSize: '7px', color: '#cbd5e1' }}>EXPIRES</div>
                              <div style={{ fontSize: '11px' }}>{cardExpiry ? cardExpiry : 'MM/YY'}</div>
                            </div>
                          </div>
                        </div>

                        {/* Input Fields */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <input
                            type="text"
                            placeholder="Card Number"
                            value={cardNo}
                            onChange={handleCardNoChange}
                            style={{ width: '100%', padding: '8px 10px', border: '1px solid #ccc', borderRadius: '2px', outline: 'none', fontSize: '13px' }}
                          />
                          <input
                            type="text"
                            placeholder="Name on Card"
                            value={cardName}
                            onChange={e => setCardName(e.target.value)}
                            style={{ width: '100%', padding: '8px 10px', border: '1px solid #ccc', borderRadius: '2px', outline: 'none', fontSize: '13px' }}
                          />
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                              type="text"
                              placeholder="Expiry (MM/YY)"
                              value={cardExpiry}
                              onChange={handleCardExpiryChange}
                              style={{ flex: 1, padding: '8px 10px', border: '1px solid #ccc', borderRadius: '2px', outline: 'none', fontSize: '13px' }}
                            />
                            <input
                              type="password"
                              placeholder="CVV"
                              value={cardCvv}
                              onChange={handleCardCvvChange}
                              style={{ width: '80px', padding: '8px 10px', border: '1px solid #ccc', borderRadius: '2px', outline: 'none', fontSize: '13px' }}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {subMethod === 'EMI' && (
                      <div>
                        <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#212121' }}>EMI (Easy Installments)</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div>
                            <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Select Bank</label>
                            <select
                              value={emiBank}
                              onChange={e => setEmiBank(e.target.value)}
                              style={{ width: '100%', padding: '8px 10px', border: '1px solid #ccc', borderRadius: '2px', outline: 'none', fontSize: '13px' }}
                            >
                              <option value="HDFC Bank">HDFC Bank (14% p.a.)</option>
                              <option value="ICICI Bank">ICICI Bank (14% p.a.)</option>
                              <option value="SBI">State Bank of India (14% p.a.)</option>
                              <option value="Axis Bank">Axis Bank (14% p.a.)</option>
                            </select>
                          </div>

                          <div>
                            <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '8px' }}>Select Tenure</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {[3, 6, 12].map(n => {
                                const rate = 0.14 / 12;
                                const emiVal = Math.round((cartTotal * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1));
                                const totalCost = emiVal * n;
                                const totalInterest = totalCost - cartTotal;
                                return (
                                  <label
                                    key={n}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '12px',
                                      padding: '10px 12px',
                                      border: emiTenure === n ? '2px solid #2874f0' : '1px solid #ddd',
                                      borderRadius: '4px',
                                      background: emiTenure === n ? '#f0f5ff' : '#fff',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    <input
                                      type="radio"
                                      name="emi-tenure"
                                      checked={emiTenure === n}
                                      onChange={() => setEmiTenure(n)}
                                      style={{ accentColor: '#2874f0' }}
                                    />
                                    <div style={{ flex: 1, fontSize: '13px' }}>
                                      <div style={{ fontWeight: 'bold', color: '#212121' }}>{n} Months Installment</div>
                                      <div style={{ color: '#666', marginTop: '2px' }}>₹{formatNumber(emiVal)}/mo (Interest: ₹{formatNumber(totalInterest)})</div>
                                    </div>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {subMethod === 'PAY_LATER' && (
                      <div>
                        <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#212121' }}>BuyIt Pay Later</h4>
                        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px' }}>
                            <span style={{ color: '#4b5563' }}>Available Credit Balance:</span>
                            <strong style={{ color: '#212121' }}>₹{formatNumber(payLaterBalance)}</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px' }}>
                            <span style={{ color: '#4b5563' }}>Order Total:</span>
                            <strong style={{ color: '#212121' }}>₹{formatNumber(cartTotal)}</strong>
                          </div>
                          
                          <div style={{ borderTop: '1px solid #cbd5e1', paddingTop: '12px', marginTop: '12px' }}>
                            {cartTotal > payLaterBalance ? (
                              <div style={{ color: '#d32f2f', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                ❌ Insufficient credit limit to place this order. Please choose another payment option.
                              </div>
                            ) : (
                              <div>
                                <div style={{ color: '#2e7d32', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                                  ✓ Eligible for Pay Later order!
                                </div>
                                <span style={{ color: '#6b7280', fontSize: '11px', display: 'block' }}>
                                  Order total will be debited from credit limit. Repay by the 5th of next month interest-free.
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {subMethod === 'COD' && (
                      <div>
                        <h4 style={{ margin: '0 0 8px 0', fontSize: '15px', color: '#212121' }}>Cash on Delivery</h4>
                        <p style={{ fontSize: '12px', color: '#666', margin: '0 0 16px 0', lineHeight: 1.4 }}>
                          To prevent automated bot orders, please solve the numeric captcha below to place your order.
                        </p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                              background: 'repeating-linear-gradient(45deg, #f0f0f0, #f0f0f0 10px, #e8e8e8 10px, #e8e8e8 20px)',
                              border: '2px solid #ccc',
                              borderRadius: '4px',
                              padding: '10px 24px',
                              fontSize: '24px',
                              fontWeight: 'bold',
                              fontStyle: 'italic',
                              letterSpacing: '8px',
                              color: '#333',
                              fontFamily: 'Courier New, monospace',
                              userSelect: 'none',
                              textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                            }}>
                              {captchaCode}
                            </div>
                            <button
                              type="button"
                              onClick={handleRefreshCaptcha}
                              title="Refresh Captcha"
                              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', display: 'flex', alignItems: 'center' }}
                            >
                              🔄
                            </button>
                          </div>

                          <input
                            type="text"
                            placeholder="Enter the 4-digit code"
                            maxLength={4}
                            value={captchaInput}
                            onChange={e => setCaptchaInput(e.target.value.replace(/\D/g, ''))}
                            style={{ width: '180px', padding: '10px 12px', border: '1px solid #ccc', borderRadius: '2px', outline: 'none', fontSize: '14px', letterSpacing: '4px', fontWeight: 'bold' }}
                          />
                        </div>
                      </div>
                    )}

                    {subMethod === 'STRIPE' && (
                      <div>
                        <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#212121' }}>Stripe Express Checkout</h4>
                        <div style={{ border: '1px solid #e2e8f0', padding: '16px', borderRadius: '6px', background: '#f8fafc' }}>
                          <p style={{ fontSize: '13px', color: '#4b5563', margin: '0 0 12px 0', lineHeight: 1.4 }}>
                            Pay securely via Stripe gateway. You can use cards, UPI, Google Pay, and other global payment mechanisms.
                          </p>
                          <span style={{ fontSize: '11px', color: '#9ca3af' }}>
                            * Clicking "Place Order" will redirect you to Stripe Hosted Checkout screen.
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Order Total Bar */}
                  <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '16px', marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#212121' }}>Total Amount: ₹{formatNumber(cartTotal)}</span>
                    <button
                      onClick={placeOrder}
                      disabled={subMethod === 'PAY_LATER' && cartTotal > payLaterBalance}
                      style={{
                        background: (subMethod === 'PAY_LATER' && cartTotal > payLaterBalance) ? '#ccc' : '#fb641b',
                        color: '#fff',
                        border: 'none',
                        padding: '12px 24px',
                        fontWeight: 700,
                        borderRadius: '2px',
                        cursor: (subMethod === 'PAY_LATER' && cartTotal > payLaterBalance) ? 'not-allowed' : 'pointer',
                        textTransform: 'uppercase',
                        fontSize: '13px',
                        boxShadow: '0 1px 2px 0 rgba(0,0,0,.2)'
                      }}
                    >
                      {subMethod === 'STRIPE' ? 'Proceed to Stripe' : 'Confirm Order'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <button 
          className="cancel-checkout" 
          onClick={() => dispatch({ type: 'CLOSE_CHECKOUT' })}
          style={{ background: 'none', border: 'none', color: '#878787', cursor: 'pointer', fontSize: '13px', textDecoration: 'underline', display: 'block', margin: '16px auto 0 auto' }}
        >
          Cancel and Return
        </button>
      </div>
    </>
  );
}
