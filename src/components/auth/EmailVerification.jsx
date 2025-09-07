import React, { useState } from 'react';
import { Mail, RefreshCw, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
// Get API base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const EmailVerification = ({ email, onVerified, onBack }) => {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);


  const verifyOtp = async () => {
    if (otp.length !== 6) {
      setMessage('Please enter a 6-digit OTP');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage('Email verified successfully!');
        
        // Save token and user data
        localStorage.setItem('token', data.token);
        
        // Call parent callback
        setTimeout(() => {
          onVerified(data.user, data.token);
        }, 1500);
      } else {
        setMessage(data.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setMessage('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/resend-verification-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('New verification code sent to your email');
        setOtp(''); // Clear existing OTP
      } else {
        setMessage(data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="text-center mb-6">
          {isSuccess ? (
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          ) : (
            <Mail className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          )}
          
          <h2 className="text-2xl font-bold text-gray-900">
            {isSuccess ? 'Email Verified!' : 'Verify Your Email'}
          </h2>
          
          <p className="text-gray-600 mt-2">
            {isSuccess 
              ? 'Your email has been successfully verified.' 
              : `We've sent a 6-digit verification code to ${email}`
            }
          </p>
        </div>

        {!isSuccess && (
          <>
            <div className="mb-6">
              <Input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                className="text-center text-2xl tracking-widest"
                maxLength={6}
                disabled={loading}
              />
            </div>

            {message && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${
                message.includes('successfully') || message.includes('sent') 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {message}
              </div>
            )}

            <div className="space-y-3">
              <Button
                onClick={verifyOtp}
                disabled={loading || otp.length !== 6}
                className="w-full"
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </Button>

              <Button
                onClick={resendOtp}
                variant="outline"
                disabled={loading}
                className="w-full"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Resend Code
              </Button>

              {onBack && (
                <Button
                  onClick={onBack}
                  variant="ghost"
                  className="w-full"
                >
                  Back to Registration
                </Button>
              )}
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Didn't receive the code? Check your spam folder or try resending.</p>
              <p className="mt-1">Code expires in 5 minutes.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
