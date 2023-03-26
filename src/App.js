import { useEffect, useState } from "react";
import io from "socket.io-client";
const socket = io("http://localhost:5001/", {
  withCredentials: true,
  extraHeaders: {
    "*": "*",
  },
});

const App = () => {
  const [stockData, setStockData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [shortName, setShortName] = useState("");
  const [lp, setLp] = useState("");

  useEffect(() => {
    socket.emit("requestData", ["NSE:USDINR23MARFUT", "NSE:GBPINR23MARFUT"]);

    socket.on("stock_data", (data) => {
      console.log("rohit", data);
      // console.log(Object.entries(data?.d["7208"][0].v));
      if (data?.d && data?.d["7208"]) {
        const values = Object.entries(data.d["7208"][0].v);
        setShortName(values.find(([key, value]) => key === "short_name")[1]);
        setLp(values.find(([key, value]) => key === "lp")[1]);
      }
      setStockData(data);
      setIsLoading(false);
    });

    socket.on("error", (errorMessage) => {
      setError(errorMessage);
      setIsLoading(false);
    });

    const intervalId = setInterval(() => {
      socket.emit("requestData", ["NSE:USDINR23MARFUT", "NSE:GBPINR23MARFUT"]);
    }, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div>
      <h1>Live Stock Prices</h1>
      <p>Short Name: {shortName}</p>
      <p>LP: {lp}</p>
      {/* {isLoading && <p>Loading...</p>}
      {!isLoading && error && <p>{error}</p>}
      {!isLoading && !error && (
        <div>
          {Object.entries(stockData).map(([symbol, data]) => (
            <p key={symbol}>
              {data}
              {symbol}: {data.lp ? data.lp : "Data not available"}
            </p>
          ))}
        </div>
      )} */}
    </div>
  );
};

export default App;
