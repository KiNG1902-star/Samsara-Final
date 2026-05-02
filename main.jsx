import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  const [price, setPrice] = useState('0.00');
  const [balance, setBalance] = useState(1463.50); // Set to your current Exness target
  const [isInvesting, setIsInvesting] = useState(false);

  useEffect(() => {
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setPrice(parseFloat(data.p).toLocaleString(undefined, {minimumFractionDigits: 2}));
    };
    return () => ws.close();
  }, []);

  const handleAction = (type) => {
    alert(`${type} feature is being secured. Connection to Exness Server Real-17 in progress...`);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#060a0f', color: 'white', fontFamily: '-apple-system, sans-serif', padding: '25px' }}>
      
      {/* BRANDING */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#007aff', borderRadius: '50%', boxShadow: '0 0 10px #007aff' }}></div>
          <h2 style={{ fontSize: '16px', fontWeight: '900', letterSpacing: '1px', margin: 0 }}>SAMSARA</h2>
        </div>
        <div style={{ padding: '8px 12px', backgroundColor: '#1c1c1e', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold', color: '#007aff' }}>REAL-17 ACTIVE</div>
      </div>

      {/* DYNAMIC WEALTH CARD */}
      <div 
        onClick={() => { const val = prompt("Update Portfolio Balance:"); if(val) setBalance(parseFloat(val)) }}
        style={{ background: 'linear-gradient(145deg, #1c1c1e, #0a0a0b)', padding: '30px', borderRadius: '28px', marginBottom: '30px', border: '1px solid #2c2c2e', cursor: 'pointer' }}
      >
        <p style={{ color: '#8e8e93', fontSize: '11px', fontWeight: '700', marginBottom: '10px', letterSpacing: '0.5px' }}>PORTFOLIO VALUE</p>
        <h1 style={{ fontSize: '38px', margin: 0, fontWeight: '900', letterSpacing: '-1px' }}>${balance.toLocaleString(undefined, {minimumFractionDigits: 2})}</h1>
        <div style={{ display: 'flex', gap: '15px', marginTop: '25px', color: '#00ff88', fontSize: '12px', fontWeight: 'bold' }}>
          <span>↑ 12.4%</span>
          <span style={{ color: '#8e8e93', fontWeight: 'normal' }}>vs last month</span>
        </div>
      </div>

      {/* ACTIONS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '40px' }}>
        <button onClick={() => handleAction('Deposit')} style={{ padding: '20px', borderRadius: '20px', border: 'none', backgroundColor: '#007aff', color: 'white', fontWeight: '800', fontSize: '14px', boxShadow: '0 10px 20px rgba(0,122,255,0.2)' }}>DEPOSIT</button>
        <button onClick={() => handleAction('Invest')} style={{ padding: '20px', borderRadius: '20px', border: '1px solid #2c2c2e', backgroundColor: 'transparent', color: 'white', fontWeight: '800', fontSize: '14px' }}>INVEST</button>
      </div>

      {/* MARKET FEED */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
          <p style={{ color: '#8e8e93', fontSize: '12px', fontWeight: '700', margin: 0 }}>LIVE MARKET</p>
          <p style={{ color: '#007aff', fontSize: '12px', fontWeight: '700', margin: 0 }}>VIEW ALL</p>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#1c1c1e', borderRadius: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '35px', height: '35px', backgroundColor: '#f7931a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px' }}>₿</div>
            <div>
              <p style={{ margin: 0, fontWeight: '800', fontSize: '15px' }}>BTC/USD</p>
              <p style={{ margin: 0, fontSize: '10px', color: '#8e8e93' }}>Bitcoin Global</p>
            </div>
          </div>
          <p style={{ margin: 0, fontWeight: '900', fontSize: '16px', color: '#007aff' }}>${price}</p>
        </div>
      </div>

    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
