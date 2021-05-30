import { useEffect, useState, useRef } from 'react';
import logo from './logo.svg';
import './App.css';

const API_URL = "https://lightsail.jiewen.wang:3004/sushiswap"

const INTERVAL = 20000

export function formatNumber(x) {
  x = x.toFixed(3)
  return x.toLocaleString()// toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
}

async function fetch_prices() {
  var res = await fetch(API_URL)
  
  try {
      var body = await res.json()
      return body
  }
  catch (err) {
      console.error(err)
      return null
  }
}

function useInterval(callback, delay) {
  const savedCallback = useRef()

  useEffect(() => {
      savedCallback.current = callback
  }, [callback])

  useEffect(() => {
      function tick() {
          savedCallback.current()
      }

      if (delay !== null) {
          const id = setInterval(tick, delay)
          return () => {
              clearInterval(id)
          }
      }
  }, [callback, delay])
}

function App() {
  const [priceData, setPriceData] = useState({uniswap: {}, sushiswap: {}})

  const refreshData = () => {
    fetch_prices().then(result => {
      setPriceData(result)
      console.log(result)
    })
  }

  useEffect(refreshData, [])

  useInterval(refreshData, INTERVAL)

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <table>
            <tbody>
              <tr>
                <th>Pair</th>
                <th>Sushiswap 0</th>
                <th>Uniswap 0</th> 
                <th>Sushiswap 1</th>
                <th>Uniswap 1</th>
                <th>Diff</th>
              </tr>
              {
                Object.keys(priceData).map(key => (
                    <tr style={{
                      color: priceData[key].diff > 0.04 ? (priceData[key].diff > 0.08 ? 'yellow' : 'cyan') : 'white'
                    }}>
                      <th>{key}</th>
                      <th>{priceData[key].sushiswap ? formatNumber(priceData[key].sushiswap.token0Price) : "None"}</th>
                      <th>{priceData[key].uniswap ? formatNumber(priceData[key].uniswap.token0Price) : "None"}</th>
                      <th>{priceData[key].sushiswap ? formatNumber(priceData[key].sushiswap.token1Price) : "None"}</th>
                      <th>{priceData[key].uniswap ? formatNumber(priceData[key].uniswap.token1Price) : "None"}</th>
                      <th>{formatNumber(priceData[key].diff * 100).toString() + '%'}</th>
                    </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </header>
    </div>
  );
}

export default App;
