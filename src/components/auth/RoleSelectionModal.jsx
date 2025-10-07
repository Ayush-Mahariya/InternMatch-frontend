// src/components/auth/RoleSelectionModal.jsx
import React, { useState } from 'react';
import { User, Building2 } from 'lucide-react';
import Button from '../ui/Button';

const RoleSelectionModal = ({ isOpen, onRoleSelected, userName }) => {
  const [selectedRole, setSelectedRole] = useState('student');

  if (!isOpen) return null;

  const handleSubmit = () => {
    onRoleSelected(selectedRole);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome, {userName}!
          </h2>
          <p className="text-gray-600">
            Please select your role to complete your profile setup
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <label className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
            selectedRole === 'student' 
              ? 'border-blue-500 bg-blue-50 text-blue-700' 
              : 'border-gray-300 hover:border-gray-400'
          }`}>
            <input
              type="radio"
              name="role"
              value="student"
              checked={selectedRole === 'student'}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="sr-only"
            />
            <User className="mr-3" size={20} />
            <div className="text-left">
              <div className="font-medium">Student</div>
              <div className="text-sm text-gray-500">Looking for internships and jobs</div>
            </div>
          </label>

          <label className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
            selectedRole === 'company' 
              ? 'border-blue-500 bg-blue-50 text-blue-700' 
              : 'border-gray-300 hover:border-gray-400'
          }`}>
            <input
              type="radio"
              name="role"
              value="company"
              checked={selectedRole === 'company'}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="sr-only"
            />
            <Building2 className="mr-3" size={20} />
            <div className="text-left">
              <div className="font-medium">Company</div>
              <div className="text-sm text-gray-500">Hiring students and professionals</div>
            </div>
          </label>
        </div>

        <Button onClick={handleSubmit} className="w-full py-3">
          Continue
        </Button>
      </div>
    </div>
  );
};

export default RoleSelectionModal;
