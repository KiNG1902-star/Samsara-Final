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

  useEffect(() => {
    // Check for existing session
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) fetchUserBalance(user.id);
    }
    checkUser();

    // BTC Price Stream
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
      else alert("Check your email for the confirmation link!");
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

  // LOGIN SCREEN UI
  if (!user) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#060a0f', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '30px', fontFamily: 'sans-serif' }}>
        <h1 style={{ textAlign: 'center', letterSpacing: '2px', fontWeight: '900' }}>SAMSARA</h1>
        <p style={{ textAlign: 'center', color: '#8e8e93', fontSize: '12px', marginBottom: '30px' }}>{isSignUp ? 'CREATE YOUR SECURE VAULT' : 'WELCOME BACK TO THE VALLEY'}</p>
        
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '20px', borderRadius: '15px', backgroundColor: '#1c1c1e', border: '1px solid #2c2c2e', color: 'white', marginBottom: '15px' }} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '20px', borderRadius: '15px', backgroundColor: '#1c1c1e', border: '1px solid #2c2c2e', color: 'white', marginBottom: '25px' }} />
        
        <button onClick={handleAuth} style={{ padding: '20px', borderRadius: '15px', backgroundColor: '#007aff', color: 'white', fontWeight: 'bold', border: 'none' }}>
          {isSignUp ? 'SIGN UP' : 'LOGIN'}
        </button>
        
        <p onClick={() => setIsSignUp(!isSignUp)} style={{ textAlign: 'center', color: '#007aff', marginTop: '20px', fontSize: '13px', cursor: 'pointer' }}>
          {isSignUp ? 'Already have an account? Login' : 'New to Samsara? Create Account'}
        </p>
      </div>
    );
  }

  // MAIN DASHBOARD (Same UI as before, but linked to the REAL user)
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#060a0f', color: 'white', padding: '25px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '900' }}>SAMSARA</h2>
        <button onClick={() => supabase.auth.signOut().then(() => window.location.reload())} style={{ background: 'none', border: 'none', color: '#ff3344', fontSize: '12px', fontWeight: 'bold' }}>LOGOUT</button>
      </div>

      <div style={{ background: 'linear-gradient(145deg, #1c1c1e, #0a0a0b)', padding: '30px', borderRadius: '28px', border: '1px solid #2c2c2e' }}>
        <p style={{ color: '#8e8e93', fontSize: '11px', fontWeight: '700' }}>TOTAL BALANCE</p>
        <h1 style={{ fontSize: '42px', margin: 0, fontWeight: '900' }}>${balance.toLocaleString()}</h1>
      </div>
      
      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#1c1c1e', borderRadius: '22px', display: 'flex', justifyContent: 'space-between' }}>
        <span>BTC / USD</span>
        <span style={{ color: '#007aff', fontWeight: 'bold' }}>${price}</span>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
