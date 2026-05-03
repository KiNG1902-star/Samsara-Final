import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'

// Use the Global Supabase from the HTML script
const supabaseUrl = 'https://fkybyvyekmdkbbqsdbwr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZreWJ5dnlla21ka2JicXNkYndyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3NDIwMDUsImV4cCI6MjA5MzMxODAwNX0.EATk3tOFTcFso9ELbOXKhNK5BRQ64aB_zkJlkzy9-fA'
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey)

function App() {
  const [price, setPrice] = useState('0.00');
  const [balance, setBalance] = useState(0);
  const [showDeposit, setShowDeposit] = useState(false);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    fetchVaultData();
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setPrice(parseFloat(data.p).toLocaleString(undefined, {minimumFractionDigits: 2}));
    };
    return () => ws.close();
  }, []);

  async function fetchVaultData() {
    const { data } = await supabase.from('profiles').select('balance').order('created_at', { ascending: false }).limit(1);
    if (data && data.length > 0) setBalance(data[0].balance);
  }

  async function handleDeposit() {
    const newTotal = balance + parseFloat(amount);
    const { error } = await supabase.from('profiles').insert([{ balance: newTotal, full_name: 'Samsara Founder' }]);
    if (!error) {
      setBalance(newTotal);
      setShowDeposit(false);
      setAmount('');
      alert("Funds Parked in Vault");
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#060a0f', color: 'white', fontFamily: 'sans-serif', padding: '25px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '900', letterSpacing: '1px' }}>SAMSARA</h2>
        <div style={{ padding: '6px 12px', backgroundColor: '#1c1c1e', borderRadius: '10px', fontSize: '10px', color: '#00ff88' }}>VAULT SECURE</div>
      </div>
      <div style={{ background: 'linear-gradient(145deg, #1c1c1e, #0a0a0b)', padding: '30px', borderRadius: '28px', marginBottom: '30px', border: '1px solid #2c2c2e' }}>
        <p style={{ color: '#8e8e93', fontSize: '11px', fontWeight: '700', marginBottom: '10px' }}>TOTAL ASSETS</p>
        <h1 style={{ fontSize: '42px', margin: 0, fontWeight: '900' }}>${balance.toLocaleString(undefined, {minimumFractionDigits: 2})}</h1>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '40px' }}>
        <button onClick={() => setShowDeposit(true)} style={{ padding: '20px', borderRadius: '20px', border: 'none', backgroundColor: '#007aff', color: 'white', fontWeight: '800' }}>DEPOSIT</button>
        <button style={{ padding: '20px', borderRadius: '20px', border: '1px solid #2c2c2e', backgroundColor: 'transparent', color: 'white', fontWeight: '800' }}>INVEST</button>
      </div>
      <div style={{ padding: '20px', backgroundColor: '#1c1c1e', borderRadius: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ margin: 0, fontWeight: '800' }}>BTC/USD</p>
        <p style={{ margin: 0, fontWeight: '900', color: '#007aff' }}>${price}</p>
      </div>
      {showDeposit && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#1c1c1e', padding: '30px', borderRadius: '30px', width: '100%', maxWidth: '350px', border: '1px solid #2c2c2e' }}>
            <input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: '100%', padding: '20px', backgroundColor: '#060a0f', border: '1px solid #2c2c2e', borderRadius: '15px', color: 'white', fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowDeposit(false)} style={{ flex: 1, padding: '15px', borderRadius: '12px', border: 'none', backgroundColor: '#333', color: 'white' }}>BACK</button>
              <button onClick={handleDeposit} style={{ flex: 1, padding: '15px', borderRadius: '12px', border: 'none', backgroundColor: '#007aff', color: 'white' }}>CONFIRM</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
