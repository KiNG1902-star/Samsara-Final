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
  const [activeTab, setActiveTab] = useState('hub'); // 'trade' or 'hub'

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

  async function handleAuth() {
    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) alert(error.message);
      else {
        // Auto-create profile in database
        if (data.user) {
          await supabase.from('profiles').upsert({ id: data.user.id, balance: 0 });
        }
        alert("Success! Check your email to confirm.");
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

  async function fetchUserBalance(userId) {
    const { data } = await supabase.from('profiles').select('balance').eq('id', userId).single();
    if (data) setBalance(data.balance);
  }

  // --- AUTH SCREEN ---
  if (!user) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#060a0f', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '30px', fontFamily: 'sans-serif' }}>
        <h1 style={{ textAlign: 'center', letterSpacing: '3px', fontWeight: '900', margin: '0 0 10px 0' }}>SAMSARA</h1>
        <p style={{ textAlign: 'center', color: '#8e8e93', fontSize: '12px', marginBottom: '40px' }}>ONE SOLUTION. TWO PATHS.</p>
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '20px', borderRadius: '15px', backgroundColor: '#1c1c1e', border: '1px solid #2c2c2e', color: 'white', marginBottom: '15px' }} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '20px', borderRadius: '15px', backgroundColor: '#1c1c1e', border: '1px solid #2c2c2e', color: 'white', marginBottom: '25px' }} />
        <button onClick={handleAuth} style={{ padding: '20px', borderRadius: '15px', backgroundColor: '#007aff', color: 'white', fontWeight: 'bold', border: 'none' }}>{isSignUp ? 'REGISTER' : 'ENTER VALLEY'}</button>
        <p onClick={() => setIsSignUp(!isSignUp)} style={{ textAlign: 'center', color: '#007aff', marginTop: '20px', fontSize: '13px', cursor: 'pointer' }}>{isSignUp ? 'Back to Login' : 'New? Create Vault'}</p>
      </div>
    );
  }

  // --- MAIN APP STRUCTURE ---
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#060a0f', color: 'white', fontFamily: 'sans-serif', padding: '20px 20px 100px 20px' }}>
      
      {/* TOP BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
           <div style={{ width: '8px', height: '8px', backgroundColor: '#007aff', borderRadius: '50%' }}></div>
           <span style={{ fontWeight: '900', letterSpacing: '1px' }}>SAMSARA</span>
        </div>
        <button onClick={() => { supabase.auth.signOut(); window.location.reload(); }} style={{ background: 'none', border: 'none', color: '#ff3344', fontSize: '11px', fontWeight: 'bold' }}>EXIT</button>
      </div>

      {/* CONTENT SWITCHER */}
      {activeTab === 'hub' ? (
        // BINANCE STYLE HUB
        <div>
          <div style={{ background: 'linear-gradient(145deg, #1c1c1e, #0a0a0b)', padding: '25px', borderRadius: '24px', border: '1px solid #2c2c2e', marginBottom: '25px' }}>
            <p style={{ color: '#8e8e93', fontSize: '11px', fontWeight: 'bold', marginBottom: '5px' }}>WEALTH HUB BALANCE</p>
            <h1 style={{ fontSize: '36px', margin: 0, fontWeight: '900' }}>${balance.toLocaleString()}</h1>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
               <button style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: '#007aff', color: 'white', fontSize: '12px', fontWeight: 'bold' }}>P2P</button>
               <button style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: '#1c1c1e', color: 'white', fontSize: '12px', fontWeight: 'bold', border: '1px solid #2c2c2e' }}>STAKE</button>
            </div>
          </div>
          <p style={{ color: '#8e8e93', fontSize: '12px', fontWeight: 'bold', marginBottom: '15px' }}>MARKET OVERVIEW</p>
          <div style={{ padding: '20px', backgroundColor: '#1c1c1e', borderRadius: '20px', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 'bold' }}>BTC / USD</span>
            <span style={{ color: '#007aff', fontWeight: '900' }}>${price}</span>
          </div>
        </div>
      ) : (
        // EXNESS STYLE TRADE TERMINAL
        <div>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ color: '#8e8e93', fontSize: '12px' }}>REAL-17 EXECUTION ENGINE</p>
            <h1 style={{ fontSize: '48px', color: '#00ff88', margin: '10px 0' }}>${price}</h1>
            <p style={{ fontSize: '11px', color: '#8e8e93' }}>Spread: 0.2 | Leverage: 1:2000</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <button style={{ padding: '25px', borderRadius: '20px', border: 'none', backgroundColor: '#ff3344', color: 'white', fontWeight: '900', fontSize: '16px' }}>SELL</button>
            <button style={{ padding: '25px', borderRadius: '20px', border: 'none', backgroundColor: '#007aff', color: 'white', fontWeight: '900', fontSize: '16px' }}>BUY</button>
          </div>
        </div>
      )}

      {/* BOTTOM NAVIGATION BAR */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#0a0a0b', borderTop: '1px solid #1c1c1e', display: 'flex', justifyContent: 'space-around', padding: '15px 0', zIndex: 100 }}>
        <div onClick={() => setActiveTab('hub')} style={{ textAlign: 'center', opacity: activeTab === 'hub' ? 1 : 0.4, cursor: 'pointer' }}>
          <div style={{ fontSize: '20px' }}>🏦</div>
          <p style={{ fontSize: '10px', margin: '5px 0 0 0', fontWeight: 'bold' }}>HUB</p>
        </div>
        <div onClick={() => setActiveTab('trade')} style={{ textAlign: 'center', opacity: activeTab === 'trade' ? 1 : 0.4, cursor: 'pointer' }}>
          <div style={{ fontSize: '20px' }}>📊</div>
          <p style={{ fontSize: '10px', margin: '5px 0 0 0', fontWeight: 'bold' }}>TRADE</p>
        </div>
      </div>

    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
                       
