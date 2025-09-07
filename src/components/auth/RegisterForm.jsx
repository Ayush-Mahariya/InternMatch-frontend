import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import EmailVerification from '../auth/EmailVerification';

const RegisterForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');

  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await register(formData);
    
    if (result.success) {
      if (result.needsVerification) {
        // Show OTP verification step
        setVerificationEmail(result.email || formData.email);
        setShowVerification(true);
      } else {
        // Registration complete without verification
        onSuccess();
      }
    } else {
      setError(result.message);
    }
    
    setIsLoading(false);
  };

  const handleVerificationSuccess = (user, token) => {
    // OTP verification completed successfully
    setShowVerification(false);
    onSuccess(user, token);
  };

  const handleBackToRegistration = () => {
    // Go back to registration form
    setShowVerification(false);
    setVerificationEmail('');
  };

  // Render OTP verification if needed
  if (showVerification) {
    return (
      <EmailVerification
        email={verificationEmail}
        onVerified={handleVerificationSuccess}
        onBack={handleBackToRegistration}
      />
    );
  }

  // Render registration form
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      
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
      
      <Select
        label="I am a..."
        value={formData.role}
        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        options={[
          { value: 'student', label: 'Student looking for internships' },
          { value: 'company', label: 'Company hiring interns' }
        ]}
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}
      
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );
};

export default RegisterForm;
