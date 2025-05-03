import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaRobot, FaGoogle, FaGithub, FaDiscord, FaGitlab, FaEthereum } from 'react-icons/fa';
import './Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, login, loginWithGoogle, loginWithMetaMask, loading } = useAuth();
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
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID ,
      callback: handleGoogleResponse,
      auto_select: false,
    });

    window.google.accounts.id.renderButton(
      document.getElementById('google-login-button'),
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
    const success = await loginWithGoogle(response);
    if (success) {
      navigate('/dashboard');
    } else {
      alert('Google authentication failed. Please try again.');
    }
  };

  const handleGoogleLogin = () => {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      window.google.accounts.id.prompt();
    } else {
      console.error('Google API not loaded yet');
      alert('Google authentication is not ready yet. Please try again later.');
    }
  };

  const handleMetaMaskLogin = async () => {
    setMetamaskError('');
    
    if (!window.ethereum) {
      setMetamaskError('Please install MetaMask to use this feature.');
      return;
    }
    
    try {
      const success = await loginWithMetaMask();
      if (success) {
        navigate('/dashboard');
      } else {
        setMetamaskError('MetaMask authentication failed. Please try again.');
      }
    } catch (error) {
      console.error('MetaMask login error:', error);
      setMetamaskError('Failed to connect with MetaMask. ' + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/login`,
        {
          username: email,
          userpass: password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      login(response.data.data);
      navigate('/dashboard'); // Redirect to dashboard after successful login
    } catch (error) {
      console.error('Login failed:', error);
      alert(error.response?.data?.message || 'Login failed. Please check your credentials and try again.');
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
        <h2>Sign In</h2>
        <p>Welcome back, please sign in to continue.</p>

        <div className="social-login">
         
          {/* <button className="social-btn github" disabled>
            <FaGithub className="social-icon" /> GitHub
          </button>
          <button className="social-btn discord" disabled>
            <FaDiscord className="social-icon" /> Discord
          </button> */}
         
          <button 
            className="social-btn google" 
            // onClick={handleGoogleLogin}
            disabled
          >
            <FaGoogle className="social-icon" /> Google
          </button>
          <button 
            className="social-btn metamask"
            onClick={handleMetaMaskLogin}
            disabled={isLoadingState}
          >
            <FaEthereum className="social-icon" /> MetaMask
          </button>

        </div>
        
        {metamaskError && <p className="error-message">{metamaskError}</p>}
        
        {/* Hidden div for Google button rendering */}
        <div id="google-login-button" style={{ display: 'none' }}></div>
        
        <div className="or-separator">OR</div>

        <form onSubmit={handleSubmit}>
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
          <div className="remember-forgot">
            <label>
              <input type="checkbox" disabled={isLoadingState} /> Remember me
            </label>
            <a href="/forgot-password">Forgot Password?</a>
          </div>
          <button type="submit" className="sign-in-btn" disabled={isLoadingState}>
            {isLoadingState ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>

        <p className="signup-link">
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
        <p className="copyright">Copyright © {new Date().getFullYear()} KMG1 Trading. All Rights Reserved.</p>
      </div>
    </div>
  );
}

export default Login;