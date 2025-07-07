import React, { useEffect, useState } from 'react';

const EBAY_APP_ID = process.env.NEXT_PUBLIC_EBAY_APP_ID;
const WALLET_ADDRESS = 'your-crypto-wallet-address';
const MOCK_PAYMENT_CONFIRMATION_DELAY = 10000;

export default function EbayCryptoShop() {
  const [query, setQuery] = useState('wireless earbuds');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchEbay = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://corsproxy.io/?https://svcs.ebay.com/services/search/FindingService/v1`
        + `?OPERATION-NAME=findItemsByKeywords`
        + `&SERVICE-VERSION=1.0.0`
        + `&SECURITY-APPNAME=${EBAY_APP_ID}`
        + `&RESPONSE-DATA-FORMAT=JSON`
        + `&REST-PAYLOAD`
        + `&keywords=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      const items = data.findItemsByKeywordsResponse?.[0]?.searchResult?.[0]?.item || [];

      const formatted = items.map((item) => ({
        title: item.title?.[0],
        price: item.sellingStatus?.[0]?.currentPrice?.[0]?.__value__,
        currency: item.sellingStatus?.[0]?.currentPrice?.[0]?.['@currencyId'],
        image: item.galleryURL?.[0],
        item_web_url: item.viewItemURL?.[0],
      }));

      setResults(formatted);
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
      <div className="text-center mb-4">
        <img src="/logo.png" alt="Site Logo" className="mx-auto h-16" />
      </div>
      <h1 className="text-3xl font-bold mb-4 text-center">Crypto Marketplace (eBay)</h1>
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
