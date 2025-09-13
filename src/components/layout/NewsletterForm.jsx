import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Mail } from 'lucide-react';
import Button from '../ui/Button';

const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(''); // 'loading', 'success', 'error', ''
  const [message, setMessage] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset previous messages
    setMessage('');
    
    // Validation
    if (!email.trim()) {
      setStatus('error');
      setMessage('Email address is required');
      return;
    }

    if (!validateEmail(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch(`${API_BASE_URL}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(),
          subscribedAt: new Date().toISOString(),
          source: 'website_footer'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('🎉 Welcome aboard! Check your email for confirmation.');
        setEmail('');
        
        // Auto-clear success message after 5 seconds
        setTimeout(() => {
          setStatus('');
          setMessage('');
        }, 5000);
      } else {
        setStatus('error');
        if (response.status === 409) {
          setMessage('You are already subscribed to our newsletter!');
        } else {
          setMessage(data.message || 'Subscription failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setStatus('error');
      setMessage('Network error. Please check your connection and try again.');
    }
  };

  const handleReset = () => {
    setStatus('');
    setMessage('');
    setEmail('');
  };

  return (
    <div className="border-t border-gray-800 py-8">
      <div className="max-w-md">
        <div className="flex items-center mb-2">
          <Mail className="w-5 h-5 text-blue-400 mr-2" />
          <h4 className="text-white font-semibold">Stay Updated</h4>
        </div>
        
        <p className="text-gray-400 text-sm mb-4">
          Get the latest internship opportunities and career tips delivered to your inbox.
        </p>
        
        {status === 'success' ? (
          <div className="bg-green-800/20 border border-green-600 rounded-lg p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-green-300 font-medium mb-2">Successfully Subscribed!</p>
            <p className="text-green-200 text-sm mb-3">{message}</p>
            <button
              onClick={handleReset}
              className="text-green-300 hover:text-green-200 text-sm underline"
            >
              Subscribe another email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={`flex-1 px-4 py-2 bg-gray-800 border rounded-l-lg text-white placeholder-gray-500 focus:outline-none transition-colors ${
                  status === 'error' 
                    ? 'border-red-500 focus:border-red-400' 
                    : 'border-gray-700 focus:border-blue-500'
                }`}
                disabled={status === 'loading'}
                required
                autoComplete="email"
              />
              <Button 
                type="submit"
                className="rounded-l-none px-6"
                disabled={status === 'loading' || !email.trim()}
              >
                {status === 'loading' ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Subscribing...
                  </div>
                ) : (
                  'Subscribe'
                )}
              </Button>
            </div>
            
            {/* Error Messages */}
            {status === 'error' && message && (
              <div className="flex items-start space-x-2 bg-red-800/20 border border-red-600 rounded-lg p-3">
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-red-300 text-sm">{message}</p>
              </div>
            )}
            
            {/* Privacy Notice */}
            <p className="text-gray-500 text-xs">
              By subscribing, you agree to receive emails from InternMatch. 
              You can unsubscribe at any time.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default NewsletterForm;
