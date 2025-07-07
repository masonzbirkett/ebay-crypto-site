import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';

const WALLET_ADDRESS = 'your-crypto-wallet-address';
const MOCK_PAYMENT_CONFIRMATION_DELAY = 10000;

export default function CheckoutPage() {
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
      <Card>
        <CardContent className="p-4">
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
        </CardContent>
      </Card>
    </div>
  );
}
