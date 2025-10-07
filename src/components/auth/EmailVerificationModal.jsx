// src/components/auth/EmailVerificationModal.jsx
import React, { useState } from 'react';
import { Mail, RefreshCw, X, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

const EmailVerificationModal = ({ 
  isOpen, 
  onClose, 
  userEmail, 
  userName = null,
  onResendSuccess 
}) => {
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [resendError, setResendError] = useState('');
  
  const { user } = useAuth();

  const handleResendVerification = async () => {
    setIsResending(true);
    setResendMessage('');
    setResendError('');

    try {
      // Import sendEmailVerification from firebase/auth
      const { sendEmailVerification } = await import('firebase/auth');
      const { auth } = await import('../../firebase/config');
      
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        setResendMessage('Verification email sent successfully!');
        if (onResendSuccess) {
          onResendSuccess();
        }
      } else {
        setResendError('Please try registering again.');
      }
    } catch (error) {
      console.error('Error resending verification email:', error);
      setResendError('Failed to resend verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Verify Your Email</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Success Icon */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Check Your Email
            </h3>
            
            <p className="text-gray-600 text-sm leading-relaxed">
              We've sent a verification email to{' '}
              <span className="font-medium text-gray-900">{userEmail}</span>
              {userName && (
                <>
                  {' '}for <span className="font-medium text-gray-900">{userName}</span>
                </>
              )}
              . Please click the verification link in your email to activate your account.
            </p>
          </div>

          {/* Status Messages */}
          {resendMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                <p className="text-green-700 text-sm">{resendMessage}</p>
              </div>
            </div>
          )}

          {resendError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{resendError}</p>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-blue-900 mb-2">What's Next?</h4>
            <ol className="text-blue-700 text-sm space-y-1 list-decimal list-inside">
              <li>Check your email inbox (and spam folder)</li>
              <li>Click the verification link in the email</li>
              <li>Return to this page and sign in</li>
            </ol>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={handleResendVerification}
              disabled={isResending}
              variant="outline"
              className="w-full flex items-center justify-center"
            >
              <RefreshCw 
                size={16} 
                className={`mr-2 ${isResending ? 'animate-spin' : ''}`} 
              />
              {isResending ? 'Sending...' : 'Resend Verification Email'}
            </Button>

            <Button
              onClick={onClose}
              className="w-full"
            >
              I'll Check My Email
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t text-center">
            <p className="text-xs text-gray-500">
              Didn't receive the email? Check your spam folder or try resending.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationModal;
