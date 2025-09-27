import { useEffect, useState } from "react";

interface Rates {
  sttToDollar: number | null;
  ethToDollar: number | null;
  gettingRates: boolean;
  error: string | null;
  fetched: boolean;
}

export function useRates(): Rates {
  const //
    [sttToDollar, setSttToDollar] = useState<number>(0.4),
    [ethToDollar, setEthToDollar] = useState<number>(2418.22),
    [gettingRates, setGettingRates] = useState(true),
    [error, setError] = useState<string | null>(null),
    [fetched, setFetched] = useState<boolean>(false);

  useEffect(() => {
    const fetchRates = async () => {
      if (fetched) {
        return { sttToDollar, ethToDollar, gettingRates, error };
      }
      setGettingRates(true);
      setError(null);
      try {
        // Using CoinGecko API for simplicity
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        );
        if (!res.ok) throw new Error("Failed to fetch rates");
        setFetched(true);
        const data = await res.json();
        setSttToDollar(0.4); // STT testnet token - using fixed rate for now
        setEthToDollar(data.ethereum?.usd ?? null);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setGettingRates(false);
      }
    };
    fetchRates();
  }, []);

  return { sttToDollar, ethToDollar, gettingRates, error, fetched };
}
