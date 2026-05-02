import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  const [price, setPrice] = useState('70,000.00');
  const [color, setColor] = useState('white');

  useEffect(() => {
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      const newPrice = parseFloat(data.p).toFixed(2);
      setPrice(prev => {
        const val = parseFloat(newPrice);
        const oldVal = parseFloat(prev.toString().replace(',',''));
        if(val > oldVal) setColor('#00ff88'); 
        else if(val < oldVal) setColor('#ff3344');
        return val.toLocaleString();
      });
    };
    return () => ws.close();
  }, []);

  return (
    <div style={{ height: '100vh', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <p style={{ fontSize: '12px', color: '#666', fontWeight: 'bold', letterSpacing: '2px' }}>BTC / USD LIVE</p>
      <h1 style={{ fontSize: '60px', fontWeight: '900', margin: '10px 0', color: color, transition: 'color 0.2s' }}>${price}</h1>
      <div style={{ display: 'flex', gap: '20px', marginTop: '40px', width: '90%', maxWidth: '400px' }}>
        <button style={{ flex: 1, padding: '20px', borderRadius: '15px', border: 'none', backgroundColor: '#ff3344', color: 'white', fontWeight: 'bold' }}>SELL</button>
        <button style={{ flex: 1, padding: '20px', borderRadius: '15px', border: 'none', backgroundColor: '#007aff', color: 'white', fontWeight: 'bold' }}>BUY</button>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
