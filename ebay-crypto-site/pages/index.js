import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const EBAY_APP_ID = 'YOUR_EBAY_APP_ID'; // Replace with your eBay App ID or proxy endpoint
const WALLET_ADDRESS = 'your-crypto-wallet-address';
const MOCK_PAYMENT_CONFIRMATION_DELAY = 10000; // Simulate confirmation in 10 seconds

export default function EbayCryptoShop() {
  const [query, setQuery] = useState('wireless earbuds');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchEbay = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    searchEbay();
  }, []);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Crypto Marketplace (eBay)</h1>
      <div className="flex gap-2 mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />
        <button
          onClick={searchEbay}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {results.map((item, index) => (
          <div key={index} className="border rounded-lg shadow p-4">
            <img src={item.image} alt={item.title} className="w-full h-40 object-contain mb-2" />
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="text-sm mb-2">{item.price} {item.currency}</p>
            <a
              href={`/checkout?title=${encodeURIComponent(item.title)}&price=${item.price}&currency=${item.currency}&image=${encodeURIComponent(item.image)}&url=${encodeURIComponent(item.item_web_url)}`}
              className="text-blue-500 hover:underline"
            >
              Buy with Crypto
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

// Checkout Page Component
export function CheckoutPage() {
  const params = useSearchParams();
  const title = params.get('title');
  const price = params.get('price');
  const currency = params.get('currency');
  const image = params.get('image');
  const url = params.get('url');

  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  useEffect(() => {
    const simulatePayment = setTimeout(() => {
      setPaymentConfirmed(true);
    }, MOCK_PAYMENT_CONFIRMATION_DELAY);

    return () => clearTimeout(simulatePayment);
  }, []);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout with Crypto</h1>
      <div className="border rounded-lg shadow p-4">
        <img src={image} alt={title} className="w-full h-40 object-contain mb-4" />
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="mb-2">Price: {price} {currency}</p>
        <p className="mb-4 text-sm text-gray-600">Product Link: <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View on eBay</a></p>
        <div className="bg-gray-100 p-4 rounded-lg text-center">
          <p className="font-semibold mb-2">Send {price} {currency} to the wallet below:</p>
          <p className="break-all font-mono text-sm mb-2">{WALLET_ADDRESS}</p>
          {paymentConfirmed ? (
            <p className="text-green-600 font-semibold">✅ Payment confirmed. Your order is being processed.</p>
          ) : (
            <p className="text-yellow-600 font-medium">⏳ Waiting for payment confirmation...</p>
          )}
        </div>
      </div>
    </div>
  );
}
