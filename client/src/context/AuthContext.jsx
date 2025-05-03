import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = (userData) => {
    console.log('Logging in with user data:', userData);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    console.log('Logging out user');
    setUser(null);
    localStorage.removeItem('user');
  };

  // Set up interceptor to handle 401 and 403 errors
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response, // Successful request
      error => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          console.log('Unauthorized or Forbidden (401/403), logging out...');
          logout(); // Log out when we receive 401 or 403 errors
        }
        return Promise.reject(error);
      }
    );

    // Clear interceptor when component unmounts
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  useEffect(() => {
    console.log('Current user:', user);
  }, [user]);

  // Google authentication handler
  const loginWithGoogle = async (tokenResponse) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/google-auth`,
        {
          token: tokenResponse.credential,
        }
      );
      login(response.data.data);
      return true;
    } catch (error) {
      console.error('Google login failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Google registration handler
  const registerWithGoogle = async (tokenResponse) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/google-auth`,
        {
          token: tokenResponse.credential,
          isRegistration: true,
        }
      );
      login(response.data.data);
      return true;
    } catch (error) {
      console.error('Google registration failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // MetaMask authentication handlers
  const connectMetaMask = async () => {
    if (!window.ethereum) {
      console.error('MetaMask is not installed');
      return { success: false, message: 'MetaMask is not installed' };
    }

    setLoading(true);
    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];
      
      // Get the current chain ID
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      // Get the nonce from the server to sign
      const nonceResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/auth/metamask-nonce?address=${address}`
      );
      
      const nonce = nonceResponse.data.nonce;
      const message = `Sign this message to verify your identity with nonce: ${nonce}`;
      
      // Get signature from user
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, address]
      });
      
      return { 
        success: true, 
        address, 
        chainId, 
        signature, 
        message 
      };
    } catch (error) {
      console.error('MetaMask connection failed:', error);
      return { 
        success: false, 
        message: error.message 
      };
    } finally {
      setLoading(false);
    }
  };

  const loginWithMetaMask = async () => {
    const connection = await connectMetaMask();
    if (!connection.success) {
      return false;
    }
    
    setLoading(true);
    try {
      const { address, signature, message } = connection;
      
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/metamask-auth`,
        {
          address,
          signature,
          message
        }
      );
      
      login(response.data.data);
      return true;
    } catch (error) {
      console.error('MetaMask login failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const registerWithMetaMask = async () => {
    const connection = await connectMetaMask();
    if (!connection.success) {
      return false;
    }
    
    setLoading(true);
    try {
      const { address, signature, message } = connection;
      
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/metamask-auth`,
        {
          address,
          signature,
          message,
          isRegistration: true
        }
      );
      
      login(response.data.data);
      return true;
    } catch (error) {
      console.error('MetaMask registration failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loginWithGoogle, 
      registerWithGoogle,
      loginWithMetaMask,
      registerWithMetaMask,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}