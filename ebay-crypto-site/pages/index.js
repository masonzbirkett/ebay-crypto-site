import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
        />
        <Button onClick={searchEbay} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {results.map((item, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <img src={item.image} alt={item.title} className="w-full h-40 object-contain mb-2" />
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="text-sm mb-2">{item.price} {item.currency}</p>
              <a
                href={`/checkout?title=${encodeURIComponent(item.title)}&price=${item.price}&currency=${item.currency}&image=${encodeURIComponent(item.image)}&url=${encodeURIComponent(item.item_web_url)}`}
                className="text-blue-500 hover:underline"
              >
                Buy with Crypto
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
