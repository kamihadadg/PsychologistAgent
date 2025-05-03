import LanguageSwitcher from '../LanguageSwitcher';
import { FaRobot, FaChartLine, FaCoins, FaShieldAlt, FaRocket, FaCog, FaUsers, FaHeadset } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import './Header.css';  
import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
              

function Header() {


    const { t, i18n } = useTranslation();
    const { logout } = useAuth();
    const navigate = useNavigate();
  
    useEffect(() => {
      const header = document.querySelector('.header');
      const handleScroll = () => {
        if (window.scrollY > 50) {
          header.classList.add('shadow');
        } else {
          header.classList.remove('shadow');
        }
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
  
    const handleSignOut = () => {
      logout();
      navigate('/');
    };
    return (
        <>
      {/* Header */}
      <header className="header">
        <div className="content">
          <motion.div 
            className="logo"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FaRobot className="logo-icon" />
            {t('home.logo')}
          </motion.div>
          <nav className="nav" role="navigation">
            <motion.a 
              href="#features"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >{t('home.nav.features')}</motion.a>
            <motion.a 
              href="#pricing"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >{t('home.nav.pricing')}</motion.a>
            <motion.a 
              href="#about"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >{t('home.nav.about')}</motion.a>
            <div className="header-language-switcher">
              <LanguageSwitcher />
            </div>
            <motion.a 
              href="/login" 
              className="btn-login"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >{t('home.nav.signIn')}</motion.a>
            <motion.a 
              href="/signup" 
              className="btn-signup"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >{t('home.nav.getStarted')}</motion.a>
          </nav>
        </div>
      </header>
        </>
    )
}
export default Header ;