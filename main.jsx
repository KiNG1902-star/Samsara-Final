import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'

// CONNECTION CONFIG
const supabaseUrl = 'https://fkybyvyekmdkbbqsdbwr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZreWJ5dnlla21ka2JicXNkYndyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3NDIwMDUsImV4cCI6MjA5MzMxODAwNX0.EATk3tOFTcFso9ELbOXKhNK5BRQ64aB_zkJlkzy9-fA'
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey)

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [price, setPrice] = useState('0.00');
  const [balance, setBalance] = useState(0);
  const [activeTab, setActiveTab] = useState('hub'); 
  const [showP2P, setShowP2P] = useState(false);
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        fetchUserBalance(user.id);
      }
    }
    checkUser();

    const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setPrice(parseFloat(data.p).toLocaleString(undefined, {minimumFractionDigits: 2}));
    };
    return () => ws.close();
  }, []);

  async function fetchUserBalance(userId) {
    const { data } = await supabase.from('profiles').select('balance').eq('id', userId).single();
    if (data) setBalance(data.balance);
  }

  async function fetchP2P() {
    const { data } = await supabase.from('p2p_offers').select('*').eq('status', 'OPEN').order('created_at', { ascending: false });
    if (data) setOffers(data);
  }

  async function handleAuth() {
    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) alert(error.message);
      else {
        if (data.user) await supabase.from('profiles').upsert({ id: data.user.id, balance: 0 });
        alert("Success! Check email to confirm.");
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
      else {
        setUser(data.user);
        fetchUserBalance(data.user.id);
      }
    }
  }

  async function createTestOffer() {
    const { error } = await supabase.from('p2p_offers').insert([
      { type: 'SELL', amount: 100, price: 88.50, creator_id: user.id, status: 'OPEN' }
    ]);
    if (!error) fetchP2P();
  }

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#060a0f', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '30px', fontFamily: 'sans-serif' }}>
        <h1 style={{ textAlign: 'center', letterSpacing: '3px', fontWeight: '900' }}>SAMSARA</h1>
        <p style={{ textAlign: 'center', color: '#8e8e93', fontSize: '11px', marginBottom: '30px' }}>ONE SOLUTION. TWO PATHS.</p>
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '18px', borderRadius: '12px', backgroundColor: '#1c1c1e', border: '1px solid #2c2c2e', color: 'white', marginBottom: '15px' }} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '18px', borderRadius: '12px', backgroundColor: '#1c1c1e', border: '1px solid #2c2c2e', color: 'white', marginBottom: '25px' }} />
        <button onClick={handleAuth} style={{ padding: '18px', borderRadius: '12px', backgroundColor: '#007aff', color: 'white', fontWeight: 'bold', border: 'none' }}>{isSignUp ? 'REGISTER' : 'ENTER VALLEY'}</button>
        <p onClick={() => setIsSignUp(!isSignUp)} style={{ textAlign: 'center', color: '#007aff', marginTop: '20px', fontSize: '12px' }}>{isSignUp ? 'Back to Login' : 'New? Create Vault'}</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#060a0f', color: 'white', fontFamily: 'sans-serif', padding: '20px 20px 100px 20px' }}>
      
      {/* TOP HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <span style={{ fontWeight: '900', letterSpacing: '1px' }}>SAMSARA ●</span>
        <button onClick={() => { supabase.auth.signOut(); window.location.reload(); }} style={{ background: 'none', border: 'none', color: '#ff3344', fontSize: '11px', fontWeight: 'bold' }}>EXIT</button>
      </div>

      {!showP2P ? (
        activeTab === 'hub' ? (
          <div>
            <div style={{ background: 'linear-gradient(145deg, #1c1c1e, #0a0a0b)', padding: '25px', borderRadius: '24px', border: '1px solid #2c2c2e', marginBottom: '25px' }}>
              <p style={{ color: '#8e8e93', fontSize: '11px', fontWeight: 'bold' }}>WEALTH HUB BALANCE</p>
              <h1 style={{ fontSize: '36px', margin: '5px 0' }}>${balance.toLocaleString()}</h1>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                 <button onClick={() => { setShowP2P(true); fetchP2P(); }} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: '#007aff', color: 'white', fontWeight: 'bold' }}>P2P MARKET</button>
                 <button style={{ flex: 1, padding: '12px', borderRadius: '10px', backgroundColor: '#1c1c1e', color: 'white', border: '1px solid #2c2c2e' }}>STAKE</button>
              </div>
            </div>
            <p style={{ color: '#8e8e93', fontSize: '11px', fontWeight: 'bold', marginBottom: '15px' }}>LIVE MARKETS</p>
            <div style={{ padding: '20px', backgroundColor: '#1c1c1e', borderRadius: '20px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 'bold' }}>BTC / USD</span>
              <span style={{ color: '#007aff', fontWeight: '900' }}>${price}</span>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#8e8e93', fontSize: '12px' }}>TRADING TERMINAL</p>
            <h1 style={{ fontSize: '50px', color: '#00ff88', margin: '10px 0' }}>${price}</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '30px' }}>
              <button style={{ padding: '25px', borderRadius: '20px', border: 'none', backgroundColor: '#ff3344', color: 'white', fontWeight: '900' }}>SELL</button>
              <button style={{ padding: '25px', borderRadius: '20px', border: 'none', backgroundColor: '#007aff', color: 'white', fontWeight: '900' }}>BUY</button>
            </div>
          </div>
        )
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <button onClick={() => setShowP2P(false)} style={{ background: 'none', border: 'none', color: '#007aff', fontSize: '20px' }}>←</button>
            <h3 style={{ margin: 0 }}>P2P Marketplace</h3>
            <button onClick={createTestOffer} style={{ background: 'none', border: 'none', color: '#00ff88', fontSize: '20px' }}>+</button>
          </div>
          {offers.map(offer => (
            <div key={offer.id} style={{ backgroundColor: '#1c1c1e', padding: '15px', borderRadius: '15px', marginBottom: '10px', border: '1px solid #2c2c2e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ color: offer.type === 'BUY' ? '#00ff88' : '#ff3344', fontSize: '10px', fontWeight: 'bold' }}>{offer.type}</span>
                <p style={{ margin: '5px 0 0 0', fontWeight: 'bold' }}>{offer.amount} USDT</p>
                <p style={{ margin: 0, fontSize: '10px', color: '#8e8e93' }}>By: User_{offer.creator_id.slice(0,4)}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontWeight: 'bold', color: '#007aff' }}>${offer.price}</p>
                <button style={{ marginTop: '8px', padding: '6px 15px', borderRadius: '8px', border: 'none', backgroundColor: '#007aff', color: 'white', fontSize: '11px', fontWeight: 'bold' }}>TRADE</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* NAV BAR */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#060a0f', borderTop: '1px solid #1c1c1e', display: 'flex', justifyContent: 'space-around', padding: '15px 0' }}>
        <div onClick={() => { setActiveTab('hub'); setShowP2P(false); }} style={{ textAlign: 'center', opacity: activeTab === 'hub' ? 1 : 0.4 }}>
          <span>🏦</span><p style={{ fontSize: '10px', margin: '5px 0 0 0' }}>HUB</p>
        </div>
        <div onClick={() => { setActiveTab('trade'); setShowP2P(false); }} style={{ textAlign: 'center', opacity: activeTab === 'trade' ? 1 : 0.4 }}>
          <span>📊</span><p style={{ fontSize: '10px', margin: '5px 0 0 0' }}>TRADE</p>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  
