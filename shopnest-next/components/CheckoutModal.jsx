'use client';
import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { formatNumber } from '@/lib/utils';

export default function CheckoutModal() {
  const { state, dispatch, cartTotal, showToast } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [addr, setAddr] = useState('');
  const [pincode, setPincode] = useState('');
  const [payment, setPayment] = useState('Online Payment (UPI/Card/Netbanking)');

  const placeOrder = () => {
    if (!name.trim()) { showToast('Please fill in your name'); return; }
    const order = {
      id: 'SN' + Date.now(),
      customer: name,
      phone,
      items: state.cart.length,
      total: cartTotal,
      payment,
      date: new Date().toLocaleDateString('en-IN'),
      status: 'pending',
    };
    dispatch({ type: 'PLACE_ORDER', order });
    showToast('🎉 Order placed! Order ID: ' + order.id);
    setName(''); setPhone(''); setAddr(''); setPincode('');
  };

  if (!state.checkoutOpen) return null;

  return (
    <>
      <div id="overlay" className="show" onClick={() => dispatch({ type: 'CLOSE_CHECKOUT' })} />
      <div id="checkout-modal" className="open">
        <h2>🛒 Checkout</h2>
        <div className="checkout-form">
          <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
          <input type="text" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} />
          <input type="text" placeholder="Delivery Address" value={addr} onChange={e => setAddr(e.target.value)} />
          <input type="text" placeholder="Pincode" value={pincode} onChange={e => setPincode(e.target.value)} />
          <select value={payment} onChange={e => setPayment(e.target.value)}>
            <option>Online Payment (UPI/Card/Netbanking)</option>
            <option>Cash on Delivery</option>
            <option>EMI</option>
          </select>
          <button className="place-order-btn" onClick={placeOrder}>
            Place Order ₹{formatNumber(cartTotal)}
          </button>
          <button className="cancel-checkout" onClick={() => dispatch({ type: 'CLOSE_CHECKOUT' })}>
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}
