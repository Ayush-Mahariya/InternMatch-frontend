// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../firebase/config';

// Get API base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [isNewGoogleUser, setIsNewGoogleUser] = useState(false);
  const [pendingGoogleUser, setPendingGoogleUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Get the Firebase ID token
          const idToken = await firebaseUser.getIdToken();
          
          // Try to get custom claims (role information)
          const tokenResult = await firebaseUser.getIdTokenResult();
          const role = tokenResult.claims.role || 'student'; // Default to student
          
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            emailVerified: firebaseUser.emailVerified,
            photoURL: firebaseUser.photoURL,
            role: role,
            createdAt: firebaseUser.metadata.creationTime,
            lastLoginAt: firebaseUser.metadata.lastSignInTime
          });
          setToken(idToken);
        } else {
          setUser(null);
          setToken(null);
          setIsNewGoogleUser(false);
          setPendingGoogleUser(null);
        }
      } catch (error) {
        console.error('Error getting user token:', error);
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // Helper: create/login user in backend using Firebase token
  const syncWithBackendAuth = async ({ idToken, role = 'student', name }) => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/firebase-auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firebaseToken: idToken,
          userData: { role, name }
        })
      });
    } catch (error) {
      console.error('Failed to sync with backend auth:', error);
    }
  };

  // Enhanced error message handling
  const getErrorMessage = (error) => {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed. Please try again.';
      case 'auth/popup-blocked':
        return 'Sign-in popup was blocked by your browser. Please allow popups and try again.';
      case 'auth/cancelled-popup-request':
        return 'Sign-in was cancelled. Please try again.';
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with this email using a different sign-in method.';
      default:
        return error.message || 'An unexpected error occurred. Please try again.';
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      const friendlyMessage = getErrorMessage(error);
      throw new Error(friendlyMessage);
    }
  };
  // Register function
  const register = async (email, password, userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update the user profile with the display name. Wait for it to complete.
      if (userData.name) {
        await updateProfile(user, {
          displayName: userData.name
        });
      }

      // Create/login user in backend so MongoDB user exists immediately
      try {
        const idToken = await user.getIdToken(true); // force fresh claims
        await syncWithBackendAuth({ idToken, role: userData.role || 'student', name: userData.name });
      } catch (apiError) {
        console.log('Could not sync user with backend:', apiError);
      }

      // Send email verification. Await this call to ensure it completes.
      await sendEmailVerification(user);
      console.log("Verification email sent!");

      return userCredential;
    } catch (error) {
      const friendlyMessage = getErrorMessage(error);
      throw new Error(friendlyMessage);
    }
  };

  // Enhanced Google Sign In/Up function
  const signInWithGoogle = async (intendedRole = 'student') => {
    try {
      const provider = new GoogleAuthProvider();
      
      // Add custom parameters
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      const result = await signInWithPopup(auth, provider);
      
      // Check if this is a new user
      const isNewUser = result.additionalUserInfo?.isNewUser;
      
      // Ensure user exists in backend (create if first time, update otherwise)
      try {
        const idToken = await result.user.getIdToken(true);
        await syncWithBackendAuth({ idToken, role: intendedRole, name: result.user.displayName });
      } catch (apiError) {
        console.log('Could not sync Google user with backend:', apiError);
      }
      
      console.log('Google authentication successful:', result.user);
      return result;
    } catch (error) {
      console.error('Google authentication error:', error);
      const friendlyMessage = getErrorMessage(error);
      throw new Error(friendlyMessage);
    }
  };

  // Set user role (for new Google users)
  // Optional: expose a role setter if UI needs it later
  const setUserRole = async (_role) => {
    // No-op: role can be sent directly when calling syncWithBackendAuth
    return true;
  };

  // Password reset function
  const resetPassword = async (email) => {
    try {
      const result = await sendPasswordResetEmail(auth, email);
      if(result == undefined) return "Password reset link sent to your email";
    } catch (error) {
      const friendlyMessage = getErrorMessage(error);
      throw new Error(friendlyMessage);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setToken(null);
      setIsNewGoogleUser(false);
      setPendingGoogleUser(null);
    } catch (error) {
      throw new Error('Failed to logout. Please try again.');
    }
  };

  // Refresh token function
  const refreshToken = async () => {
    if (auth.currentUser) {
      try {
        const idToken = await auth.currentUser.getIdToken(true); // Force refresh
        setToken(idToken);
        
        // Update user with fresh token claims
        const tokenResult = await auth.currentUser.getIdTokenResult(true);
        const role = tokenResult.claims.role || 'student';
        
        setUser(prevUser => ({
          ...prevUser,
          role: role
        }));
        
        return idToken;
      } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
      }
    }
    return null;
  };

  // Call this after user verifies their email (e.g., via a button in UI)
  const syncEmailVerification = async (roleIfNeeded = 'student') => {
    if (!auth.currentUser) return;
    try {
      const idToken = await auth.currentUser.getIdToken(true);
      await fetch(`${API_BASE_URL}/api/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firebaseToken: idToken, userData: { role: roleIfNeeded } })
      });
    } catch (error) {
      console.error('Failed to sync email verification:', error);
    }
  };

  // Update user profile
  const updateUserProfile = async (updates) => {
    if (!auth.currentUser) throw new Error('No user logged in');

    try {
      // Update Firebase profile
      await updateProfile(auth.currentUser, updates);
      
      // Update local state
      setUser(prevUser => ({
        ...prevUser,
        ...updates
      }));
      
    } catch (error) {
      throw new Error('Failed to update profile. Please try again.');
    }
  };

  const value = {
    user,
    token,
    loading,
    isNewGoogleUser,
    pendingGoogleUser,
    login,
    register,
    signInWithGoogle,
    setUserRole,
    resetPassword,
    logout,
    refreshToken,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the context itself (for advanced usage)
export { AuthContext };

// Default export the provider
export default AuthProvider;
