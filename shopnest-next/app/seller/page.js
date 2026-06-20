'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SellerPage() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    storeName: '',
    category: 'Electronics',
    password: '',
  });
  
  const [products, setProducts] = useState([
    { id: 1, name: 'Apple iPhone 15 Pro Max', price: 134900, stock: 45, sales: 120, status: 'Active' },
    { id: 2, name: 'Sony WH-1000XM5 Headphones', price: 24990, stock: 88, sales: 85, status: 'Active' },
    { id: 3, name: 'OnePlus 12R 5G 256GB', price: 39999, stock: 67, sales: 42, status: 'Active' },
  ]);

  const [orders, setOrders] = useState([
    { id: 'ORD5501', customer: 'Amit Sharma', item: 'Apple iPhone 15 Pro Max', total: 134900, status: 'Pending' },
    { id: 'ORD5502', customer: 'Pooja Verma', item: 'Sony WH-1000XM5', total: 24990, status: 'Shipped' },
  ]);

  const [toast, setToast] = useState('');
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', category: 'Electronics' });
  const [showAddForm, setShowAddForm] = useState(false);

  const showToastMsg = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.storeName || !formData.password) {
      showToastMsg('⚠️ Please fill out all registration fields.');
      return;
    }
    showToastMsg('🎉 Congratulations! Your store is now active.');
    setIsRegistered(true);
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      showToastMsg('⚠️ Please fill out all product fields.');
      return;
    }
    const product = {
      id: products.length + 1,
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      sales: 0,
      status: 'Active'
    };
    setProducts(prev => [product, ...prev]);
    setNewProduct({ name: '', price: '', stock: '', category: 'Electronics' });
    setShowAddForm(false);
    showToastMsg('✅ Product listed successfully!');
  };

  const handleShipOrder = (orderId) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Shipped' } : o));
    showToastMsg(`📦 Order ${orderId} marked as Shipped!`);
  };

  // Pre-fill demo credentials if clicked
  const loadDemoSeller = () => {
    setFormData({
      name: 'John Doe',
      email: 'john@seller.buyit.com',
      phone: '9876543211',
      storeName: 'JD Electronics',
      category: 'Electronics',
      password: 'sellerpassword123'
    });
    showToastMsg('⚡ Demo data loaded. Click Register!');
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
      
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: '#1e1b4b', color: '#fff', padding: '12px 24px', borderRadius: '12px',
          zIndex: 9999, fontWeight: 600, boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          animation: 'fadeInDown 0.3s ease'
        }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <header style={{
        background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0 24px', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            ← Store
          </Link>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            BuyIt <span style={{ color: '#2563eb' }}>Seller Central</span>
          </span>
        </div>
        <div>
          {isRegistered && (
            <button 
              onClick={() => { setIsRegistered(false); showToastMsg('Logged out from Seller Central'); }}
              style={{ background: 'none', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
            >
              Log Out
            </button>
          )}
        </div>
      </header>

      {!isRegistered ? (
        /* REGISTRATION LANDING PAGE */
        <div>
          {/* Hero Section */}
          <div style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #60a5fa 100%)',
            color: '#fff', padding: '64px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden'
          }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', zIndex: 1, position: 'relative' }}>
              <h1 style={{ fontSize: '40px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-1px', lineHeight: 1.2 }}>
                Launch & Grow Your Online Store 🚀
              </h1>
              <p style={{ fontSize: '18px', color: '#bfdbfe', marginBottom: '32px', lineHeight: 1.5 }}>
                Reach millions of customers across the country with zero setup fees, automated cataloging tools, and 24/7 dedicated support.
              </p>
              <button 
                onClick={loadDemoSeller}
                style={{ backgroundColor: '#ff9f00', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase' }}
              >
                ⚡ Load Demo Seller Info
              </button>
            </div>
          </div>

          {/* Form and Features Container */}
          <div style={{ maxWidth: '1100px', margin: '-40px auto 60px auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px' }}>
            
            {/* Left Column: Registration Form Card */}
            <div style={{
              background: '#ffffff', borderRadius: '24px', padding: '40px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0'
            }}>
              <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '6px', color: '#0f172a' }}>Register as a Seller</h2>
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>Fill in your business details to start listing products instantly.</p>
              
              <form onSubmit={handleRegister} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Full Name</label>
                  <input 
                    type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. John Doe"
                    style={{ padding: '12px', border: '1.5px solid #cbd5e1', borderRadius: '10px', fontSize: '14px', outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Store Name</label>
                  <input 
                    type="text" name="storeName" value={formData.storeName} onChange={handleInputChange} placeholder="e.g. JD Tech Store"
                    style={{ padding: '12px', border: '1.5px solid #cbd5e1', borderRadius: '10px', fontSize: '14px', outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Email Address</label>
                  <input 
                    type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com"
                    style={{ padding: '12px', border: '1.5px solid #cbd5e1', borderRadius: '10px', fontSize: '14px', outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Phone Number</label>
                  <input 
                    type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="10-digit number"
                    style={{ padding: '12px', border: '1.5px solid #cbd5e1', borderRadius: '10px', fontSize: '14px', outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Primary Category</label>
                  <select 
                    name="category" value={formData.category} onChange={handleInputChange}
                    style={{ padding: '12px', border: '1.5px solid #cbd5e1', borderRadius: '10px', fontSize: '14px', outline: 'none', background: '#fff' }}
                  >
                    <option>Electronics</option>
                    <option>Mobiles</option>
                    <option>Fashion</option>
                    <option>Home & Furniture</option>
                    <option>Grocery</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Password</label>
                  <input 
                    type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Choose password"
                    style={{ padding: '12px', border: '1.5px solid #cbd5e1', borderRadius: '10px', fontSize: '14px', outline: 'none' }}
                  />
                </div>
                <button 
                  type="submit"
                  style={{
                    gridColumn: '1 / -1', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff',
                    border: 'none', padding: '14px', borderRadius: '12px', fontSize: '15px', fontWeight: 750,
                    cursor: 'pointer', marginTop: '12px', boxShadow: '0 4px 14px rgba(37,99,235,0.3)'
                  }}
                >
                  Register & Open Store →
                </button>
              </form>
            </div>

            {/* Right Column: Why Sell On BuyIt */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'center' }}>
              <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', display: 'flex', gap: '16px' }}>
                <span style={{ fontSize: '32px' }}>🪙</span>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Zero Setup Fees</h3>
                  <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.4 }}>Create your store catalog and list products completely free of charge.</p>
                </div>
              </div>
              <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', display: 'flex', gap: '16px' }}>
                <span style={{ fontSize: '32px' }}>📊</span>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Real-time Sales Insights</h3>
                  <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.4 }}>Analyze customer visits, active listing stocks, and sales trends instantly.</p>
                </div>
              </div>
              <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', display: 'flex', gap: '16px' }}>
                <span style={{ fontSize: '32px' }}>🚚</span>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Supercharged Logistics</h3>
                  <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.4 }}>Deliver fast and safely across India with BuyIt Express Courier partners.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* SELLER DASHBOARD VIEW */
        <div style={{ maxWidth: '1100px', margin: '32px auto', padding: '0 24px' }}>
          
          {/* Dashboard Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
            <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>Store Name</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>{formData.storeName}</div>
            </div>
            <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>Total Sales (INR)</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#2563eb' }}>₹1,99,889</div>
            </div>
            <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>Active Products</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>{products.length}</div>
            </div>
            <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>Pending Orders</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#ff9f00' }}>{orders.filter(o => o.status === 'Pending').length}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
            
            {/* Products Table section */}
            <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>Inventory Listings</h2>
                <button 
                  onClick={() => setShowAddForm(!showAddForm)}
                  style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
                >
                  {showAddForm ? 'Close Form' : '➕ Add Product'}
                </button>
              </div>

              {showAddForm && (
                <form onSubmit={handleAddProduct} style={{
                  background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px',
                  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Product Name</label>
                    <input 
                      type="text" value={newProduct.name} onChange={e => setNewProduct(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g. iPad Pro M4"
                      style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Price (₹)</label>
                    <input 
                      type="number" value={newProduct.price} onChange={e => setNewProduct(prev => ({ ...prev, price: e.target.value }))} placeholder="e.g. 89900"
                      style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Initial Stock</label>
                    <input 
                      type="number" value={newProduct.stock} onChange={e => setNewProduct(prev => ({ ...prev, stock: e.target.value }))} placeholder="e.g. 50"
                      style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                  <button 
                    type="submit" 
                    style={{ gridColumn: '1 / -1', backgroundColor: '#388e3c', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', marginTop: '6px' }}
                  >
                    List Product
                  </button>
                </form>
              )}

              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b' }}>
                    <th style={{ padding: '12px 6px', fontWeight: 700 }}>PRODUCT</th>
                    <th style={{ padding: '12px 6px', fontWeight: 700 }}>PRICE</th>
                    <th style={{ padding: '12px 6px', fontWeight: 700 }}>STOCK</th>
                    <th style={{ padding: '12px 6px', fontWeight: 700 }}>SALES</th>
                    <th style={{ padding: '12px 6px', fontWeight: 700 }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 6px', fontWeight: 600, color: '#0f172a' }}>{p.name}</td>
                      <td style={{ padding: '14px 6px' }}>₹{p.price.toLocaleString()}</td>
                      <td style={{ padding: '14px 6px', color: p.stock < 10 ? '#ef4444' : '#0f172a', fontWeight: p.stock < 10 ? 'bold' : 'normal' }}>{p.stock} units</td>
                      <td style={{ padding: '14px 6px' }}>{p.sales} sold</td>
                      <td style={{ padding: '14px 6px' }}>
                        <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>{p.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Orders section */}
            <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>Recent Store Orders</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {orders.map(o => (
                  <div key={o.id} style={{ border: '1px solid #f1f5f9', borderRadius: '12px', padding: '16px', background: '#fcfdfd' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#2563eb', fontWeight: 'bold' }}>{o.id}</span>
                      <span style={{
                        backgroundColor: o.status === 'Pending' ? '#fef3c7' : '#dcfce7',
                        color: o.status === 'Pending' ? '#92400e' : '#166534',
                        padding: '2px 8px', borderRadius: '99px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase'
                      }}>{o.status}</span>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>{o.item}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>Customer: {o.customer}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '14px' }}>₹{o.total.toLocaleString()}</strong>
                      {o.status === 'Pending' && (
                        <button 
                          onClick={() => handleShipOrder(o.id)}
                          style={{ backgroundColor: '#fb641b', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Mark Shipped
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Basic keyframes CSS styling */}
      <style jsx global>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translate(-50%, -20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
      
    </div>
  );
}
