import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  const [price, setPrice] = useState('0.00');
  const [balance, setBalance] = useState('1,250.50'); // We will sync this with Exness next
  const [equity, setEquity] = useState('1,248.10');

  useEffect(() => {
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setPrice(parseFloat(data.p).toLocaleString(undefined, {minimumFractionDigits: 2}));
    };
    return () => ws.close();
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#060a0f', color: 'white', fontFamily: '-apple-system, sans-serif', padding: '20px' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.5px' }}>SAMSARA <span style={{ color: '#007aff' }}>●</span></h2>
        <div style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#1c1c1e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>👤</div>
      </div>

      {/* WEALTH CARD */}
      <div style={{ background: 'linear-gradient(135deg, #1c1c1e 0%, #0d0d0e 100%)', padding: '25px', borderRadius: '24px', marginBottom: '30px', border: '1px solid #2c2c2e' }}>
        <p style={{ color: '#8e8e93', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>TOTAL WEALTH (EXNESS SYNC)</p>
        <h1 style={{ fontSize: '32px', margin: 0, fontWeight: '800' }}>${balance}</h1>
        <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
          <div>
            <p style={{ color: '#8e8e93', fontSize: '10px', margin: '0 0 4px 0' }}>EQUITY</p>
            <p style={{ fontSize: '14px', fontWeight: '700', margin: 0 }}>${equity}</p>
          </div>
          <div>
            <p style={{ color: '#8e8e93', fontSize: '10px', margin: '0 0 4px 0' }}>P/L DAY</p>
            <p style={{ fontSize: '14px', fontWeight: '700', margin: 0, color: '#00ff88' }}>+$12.40</p>
          </div>
        </div>
      </div>

      {/* MARKET WATCH */}
      <div style={{ marginBottom: '30px' }}>
        <p style={{ color: '#8e8e93', fontSize: '12px', fontWeight: '600', marginBottom: '15px' }}>GLOBAL MARKETS</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#1c1c1e', borderRadius: '18px' }}>
          <div>
            <p style={{ margin: 0, fontWeight: '700', fontSize: '14px' }}>BTC / USD</p>
            <p style={{ margin: 0, fontSize: '10px', color: '#8e8e93' }}>Binance Real-time</p>
          </div>
          <p style={{ margin: 0, fontWeight: '800', color: '#007aff' }}>${price}</p>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div style={{ display: 'flex', gap: '15px' }}>
        <button style={{ flex: 1, padding: '18px', borderRadius: '16px', border: 'none', backgroundColor: '#007aff', color: 'white', fontWeight: '700', fontSize: '14px' }}>DEPOSIT</button>
        <button style={{ flex: 1, padding: '18px', borderRadius: '16px', border: '1px solid #2c2c2e', backgroundColor: 'transparent', color: 'white', fontWeight: '700', fontSize: '14px' }}>INVEST</button>
      </div>

    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
