import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [config, setConfig] = useState({});

  useEffect(() => {
    fetchCoins();
    fetchConfig();
  }, []);

  const fetchCoins = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get("http://localhost:5001/api/coins");
      if (!Array.isArray(response.data)) {
        throw new Error("Invalid API response format: Expected an array.");
      }

      console.log("Fetched coins:", response.data); // Debugging
      setCoins(response.data);
    } catch (error) {
      console.error("Error fetching coins:", error.message);
      setError("Failed to fetch token data. Please check your backend.");
    } finally {
      setLoading(false);
    }
  };

  const fetchConfig = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/config");
      console.log("Fetched config:", response.data); // Debugging
      setConfig(response.data);
    } catch (error) {
      console.error("Error fetching config:", error.message);
    }
  };

  const classifyCoin = (coin) => {
    return parseFloat(coin.priceUsd) > 1 ? "Good Buy" : "Bad Buy";
  };

  return (
    <div className="app-container">
      <header>
        <h1>Crypto Bot Dashboard</h1>
      </header>

      {loading ? (
        <div className="loading-container">
          <p>Loading coins...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p>{error}</p>
        </div>
      ) : (
        <main>
          {/* Configuration Section */}
          <section className="configuration-section">
            <h2>Configuration</h2>
            <div className="config-fields">
              <div className="config-item">
                <label>Rug Threshold:</label>
                <input
                  type="number"
                  value={config.rug_threshold || ""}
                  readOnly
                  className="config-input"
                />
              </div>
              <div className="config-item">
                <label>Tier 1 Volume Threshold:</label>
                <input
                  type="number"
                  value={config.tier_1_volume_threshold || ""}
                  readOnly
                  className="config-input"
                />
              </div>
            </div>
          </section>

          {/* All Coins Table */}
          <section>
            <h2>All Coins</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Symbol</th>
                    <th>Price</th>
                    <th>Volume</th>
                    <th>Contract Address</th>
                  </tr>
                </thead>
                <tbody>
                  {coins.length > 0 ? (
                    coins.map((coin, index) => (
                      <tr key={index}>
                        <td>{coin.name || "N/A"}</td>
                        <td>{coin.symbol || "N/A"}</td>
                        <td>
                          $
                          {coin.priceUsd
                            ? parseFloat(coin.priceUsd).toFixed(2)
                            : "N/A"}
                        </td>
                        <td>
                          $
                          {coin.volume?.h24
                            ? parseFloat(coin.volume.h24).toLocaleString()
                            : "N/A"}
                        </td>
                        <td>
                          {coin.tokenAddress ? (
                            <a
                              href={`https://dexscreener.com/${coin.chainId}/${coin.tokenAddress}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {coin.tokenAddress}
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center" }}>
                        No tokens meet the filtering conditions.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Buy Classifications Table */}
          <section>
            <h2>Buy Classifications</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Symbol</th>
                    <th>Classification</th>
                  </tr>
                </thead>
                <tbody>
                  {coins.length > 0 ? (
                    coins.map((coin, index) => (
                      <tr key={index}>
                        <td>{coin.name || "N/A"}</td>
                        <td>{coin.symbol || "N/A"}</td>
                        <td>
                          <span
                            className={`classification ${
                              classifyCoin(coin) === "Good Buy"
                                ? "good-buy"
                                : "bad-buy"
                            }`}
                          >
                            {classifyCoin(coin)}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" style={{ textAlign: "center" }}>
                        No tokens meet the filtering conditions.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      )}
    </div>
  );
};

export default App;