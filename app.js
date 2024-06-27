import React, { useState, useEffect, createContext, useContext } from 'react';
import './App.css';

const CryptoContext = createContext();

const CryptoProvider = ({ children }) => {
  const [cryptos, setCryptos] = useState([]);

  useEffect(() => {
    const fetchCryptos = async () => {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/markets', {
        qs: {
          vs_currency: 'usd',
        },
      });
      const data = await response.json();
      setCryptos(data);
    };

    fetchCryptos();
    const intervalId = setInterval(fetchCryptos, 10000); // Fetch data every 10 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  return (
    <CryptoContext.Provider value={{ cryptos }}>
      {children}
    </CryptoContext.Provider>
  );
};

const CryptoTracker = () => {
  const { cryptos } = useContext(CryptoContext);

  return (
    <div className="crypto-container">
      <h1>Cryptocurrency Price Tracker</h1>
      <div className="crypto-list">
        {cryptos.map(crypto => (
          <div key={crypto.id} className="crypto-item">
            <h2>{crypto.name}</h2>
            <p>Current Price: ${crypto.current_price}</p>
            <p>Market Cap: ${crypto.market_cap}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

function App() {
  return (
    <CryptoProvider>
      <div className="App">
        <CryptoTracker />
      </div>
    </CryptoProvider>
  );
}

export default App;
