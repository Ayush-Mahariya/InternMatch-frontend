import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Get API base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [pendingVerification, setPendingVerification] = useState(null);

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData.data);
        setPendingVerification(null); // Clear pending verification
      } else {
        console.log('Token invalid, logging out');
        logout();
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      logout();
    }
  };

  const login = async (email, password) => {
    try {
      // console.log('Attempting login to:', `${API_BASE_URL}/api/auth/login`);
      
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      console.log('Login response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        return { success: true };
      } else {
        const error = await response.json();
        console.error('Login failed:', error);
        // Check if email verification is needed
        if (error.needsVerification) {
          setPendingVerification(error.email);
          return { 
            success: false, 
            message: error.message,
            needsVerification: true,
            email: error.email
          };
        }
        return { success: false, message: error.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login network error:', error);
      return { success: false, message: 'Network error. Please check your connection and try again.' };
    }
  };

  const register = async (userData) => {
    try {
      // console.log('Attempting registration to:', `${API_BASE_URL}/api/auth/register`);
      
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        const data = await response.json();
        // Check if email verification is needed
        if (data.needsVerification) {
          setPendingVerification(data.email);
          return { 
            success: true, 
            message: data.message,
            needsVerification: true,
            email: data.email
          };
        }
        else{
          setToken(data.token);
          setUser(data.user);
          localStorage.setItem('token', data.token);
          return { success: true };
        }
      } else {
        const error = await response.json();
        console.error('Registration failed:', error);
        return { success: false, message: error.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration network error:', error);
      return { success: false, message: 'Network error. Please check your connection and try again.' };
    }
  };

  const verifyEmail = async (email, otp) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-email`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, otp })
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        setPendingVerification(null);
        return { success: true, user: data.user, token: data.token };
      } else {
        const error = await response.json();
        return { success: false, message: error.message || 'Verification failed' };
      }
    } catch (error) {
      console.error('Email verification error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setPendingVerification(null);
    localStorage.removeItem('token');
  };

  const clearPendingVerification = () => {
    setPendingVerification(null);
  };


  return (
    <AuthContext.Provider value={{ user, token, login, pendingVerification, verifyEmail, register, logout, clearPendingVerification }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
