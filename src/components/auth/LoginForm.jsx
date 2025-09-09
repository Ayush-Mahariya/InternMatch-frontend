import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import Button from '../ui/Button';
import Input from '../ui/Input';
import EmailVerification from '../auth/EmailVerification';
import ForgotPassword from '../auth/ForgotPassword';

const LoginForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      // Login successful
      onSuccess();
    } else {
      if (result.needsVerification) {
        // User exists but email not verified - show OTP verification
        setVerificationEmail(result.email || formData.email);
        setShowVerification(true);
      } else {
        // Login failed - show error
        setError(result.message);
      }
    }
    
    setIsLoading(false);
  };

  const handleVerificationSuccess = (user, token) => {
    // OTP verification completed successfully
    setShowVerification(false);
    onSuccess(user, token);
  };

  const handleForgotPasswordSuccess = () => {
    setShowForgotPassword(false);
  };

  const handleBackToLogin = () => {
    // Go back to login form
    setShowVerification(false);
    setVerificationEmail('');
  };

  // Show forgot password form
  if (showForgotPassword) {
    return (
      <ForgotPassword
        onBack={() => setShowForgotPassword(false)}
      />
    );
  }

  // Render OTP verification if needed
  if (showVerification) {
    return (
      <EmailVerification
        email={verificationEmail}
        onVerified={handleVerificationSuccess}
        onBack={handleBackToLogin}
      />
    );
  }

  // Render login form
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      
      <Input
        label="Password"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}
      
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>

      <div className="text-center mt-4">
        <button
          type="button"
          onClick={() => setShowForgotPassword(true)}
          className="text-blue-600 hover:text-blue-700 text-sm"
        >
          Forgot your password?
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
