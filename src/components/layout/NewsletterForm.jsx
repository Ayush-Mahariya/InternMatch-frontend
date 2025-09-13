import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Mail } from 'lucide-react';
import Button from '../ui/Button';

const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Successfully subscribed! Check your email for confirmation.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.message || 'Subscription failed. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again later.');
    }
  };

  return (
    <div className="border-t border-gray-800 py-8">
      <div className="max-w-md">
        <h4 className="text-white font-semibold mb-2">Stay Updated</h4>
        <p className="text-gray-400 text-sm mb-4">
          Get the latest internship opportunities and career tips delivered to your inbox.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Responsive Layout: Stack on mobile, side-by-side on larger screens */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg sm:rounded-r-none text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              disabled={status === 'loading'}
              required
            />
            <Button 
              type="submit"
              className="sm:rounded-l-none whitespace-nowrap px-4 sm:px-6"
              disabled={status === 'loading' || !email}
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </div>
          
          {/* Status Messages */}
          {message && (
            <div className={`text-sm p-3 rounded-lg ${
              status === 'success' 
                ? 'bg-green-800/20 text-green-300 border border-green-600' 
                : status === 'error'
                ? 'bg-red-800/20 text-red-300 border border-red-600'
                : ''
            }`}>
              {message}
            </div>
          )}
          
          {/* Privacy Notice */}
          <p className="text-gray-500 text-xs">
            By subscribing, you agree to receive emails. You can unsubscribe anytime.
          </p>
        </form>
      </div>
    </div>
  );
};

export default NewsletterForm;
