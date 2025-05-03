import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaRobot, FaGoogle, FaGithub, FaDiscord, FaEthereum } from 'react-icons/fa';
import './Auth.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { user, registerWithGoogle, registerWithMetaMask, loading } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [metamaskError, setMetamaskError] = useState('');

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }

    // Load Google API
    const loadGoogleScript = () => {
      // Load the Google API script
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      script.onload = () => {
        if (window.google) {
          initializeGoogleAuth();
        }
      };
    };

    loadGoogleScript();
  }, [user, navigate]);

  const initializeGoogleAuth = () => {
    window.google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || '781949765644-ld59csr1pej4t3r0g5fkbu14n6v035c4.apps.googleusercontent.com',
      callback: handleGoogleResponse,
      auto_select: false,
    });

    window.google.accounts.id.renderButton(
      document.getElementById('google-signup-button'),
      { 
        theme: 'outline', 
        size: 'large',
        type: 'standard',
        shape: 'rectangular',
        width: '100%',
      }
    );
  };

  const handleGoogleResponse = async (response) => {
    const success = await registerWithGoogle(response);
    if (success) {
      navigate('/dashboard');
    } else {
      alert('Google registration failed. Please try again.');
    }
  };

  const handleGoogleSignup = () => {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      window.google.accounts.id.prompt();
    } else {
      console.error('Google API not loaded yet');
      alert('Google authentication is not ready yet. Please try again later.');
    }
  };

  const handleMetaMaskSignup = async () => {
    setMetamaskError('');
    
    if (!window.ethereum) {
      setMetamaskError('Please install MetaMask to use this feature.');
      return;
    }
    
    try {
      const success = await registerWithMetaMask();
      if (success) {
        navigate('/dashboard');
      } else {
        setMetamaskError('MetaMask registration failed. Please try again.');
      }
    } catch (error) {
      console.error('MetaMask registration error:', error);
      setMetamaskError('Failed to register with MetaMask. ' + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/register`,
        {
          name,
          username: email,
          userpass: password,
          email
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      alert(response.data.message || 'Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      alert(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Combine local and context loading states
  const isLoadingState = isLoading || loading;

  return (
    <div className="auth-container">
      <div className="login-box">
        <div className="logo">
          <FaRobot className="logo-icon" /> KMG1 Trading
        </div>
        <h2>Create Account</h2>
        <p>Sign up to get started with KMG1 Trading.</p>

        <div className="social-login">
          <button 
            className="social-btn google"
            disabled
          >
            <FaGoogle className="social-icon" /> Google
          </button>
          <button 
            className="social-btn metamask"
            onClick={handleMetaMaskSignup}
            disabled={isLoadingState}
          >
            <FaEthereum className="social-icon" /> MetaMask
          </button>
         
        </div>
        
        {metamaskError && <p className="error-message">{metamaskError}</p>}
        
        {/* Hidden div for Google button rendering */}
        <div id="google-signup-button" style={{ display: 'none' }}></div>

        <div className="or-separator">OR</div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            disabled={isLoadingState}
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            disabled={isLoadingState}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            disabled={isLoadingState}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input-field"
            disabled={isLoadingState}
          />
          <button type="submit" className="sign-in-btn" disabled={isLoadingState}>
            {isLoadingState ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <p className="signup-link">
          Already have an account? <a href="/login">Sign In</a>
        </p>
        <p className="copyright">Copyright © {new Date().getFullYear()} KMG1 Trading. All Rights Reserved.</p>
      </div>
    </div>
  );
}

export default Register;