import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../hooks/use-request';

const StripeCheckout = ({ order, currentUser, onClose }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [email, setEmail] = useState(currentUser.email || '');
  const [loading, setLoading] = useState(false);

  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
      token: 'pk_test_51RC5Sh4Cyjl7RGyH0UjP8f1dYVRq78Jrqt9IIUE4PpBAFpmmyhvbwm1Y6XwsVWXIpEEtNvCNjcHBibWkZTZpThF700ZhPv6POB', // mock token
    },
    onSuccess: () => Router.push('/orders'),
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((res) => setTimeout(res, 1000)); // fake delay
    doRequest();
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 16); // Only digits, max 16
    value = value.replace(/(\d{4})(?=\d)/g, '$1 '); // Add space after every 4 digits
    setCardNumber(value);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4 border border-gray-200 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          X
        </button>

        <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
        
        <div className="space-y-4">
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md"
            placeholder="Card Number"
            value={cardNumber}
            onChange={handleCardNumberChange}
            maxLength="19" // 16 digits + 3 spaces
            required
          />
          
          <div className="flex space-x-2">
            <input
              type="month"
              className="w-1/2 px-4 py-2 border rounded-md"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              required
            />
            <input
              type="text"
              className="w-1/2 px-4 py-2 border rounded-md"
              placeholder="CVC"
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              required
            />
          </div>
          
          <input
            type="email"
            className="w-full px-4 py-2 border rounded-md"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          onClick={onSubmit}
          disabled={loading}
          className={`w-full py-2 rounded-md transition ${loading ? 'bg-gray-400' : 'bg-green-600 text-white hover:bg-green-700'}`}
        >
          {loading ? 'Processing...' : `Pay $${order.ticket.price.toFixed(2)}`}
        </button>

        {errors}

        <div className="absolute bottom-4 right-4 text-xs text-gray-600">
          Stripe Demo Purchase
        </div>
      </div>
    </div>
  );
};

export default StripeCheckout;
