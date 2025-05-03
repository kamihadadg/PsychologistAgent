import React, { useEffect } from 'react';
import { FaRobot, FaChartLine, FaCoins, FaShieldAlt, FaRocket, FaCog, FaUsers, FaHeadset } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './Home.css';

import Header from './Header';

function Home() {
  const { t,i18n } = useTranslation();

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

  return (
    <div className="home-container" dir={i18n.dir()}>
      {/* Animated Background SVG */}
      <div className="background-svg">
        <object 
          data="/assets/hero-bg.svg" 
          type="image/svg+xml" 
          className="background-image"
          aria-label="Animated Background"
        >
          Your browser does not support SVG
        </object>
      </div>

      {/* Header */}
<Header />

      {/* Hero Section */}
      <section className="hero">
        <div className="content">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>{t('home.hero.title')}</h1>
            <p>{t('home.hero.description')}</p>
            <div className="hero-buttons">
              <motion.a 
                href="#start" 
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >{t('home.hero.getStarted')}</motion.a>
            </div>
          </motion.div>
          <motion.div 
            className="hero-image"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img src="/assets/hero-image.jpg" alt="Crypto Trading Bot" className="hero-img" />
            {/* <img src="/assets/Agentcreat.jpg" alt="Crypto Trading Bot" className="hero-img" /> */}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="content">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >{t('home.features.title')}</motion.h2>
          <div className="feature-list">
            <motion.div 
              className="feature-item"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <FaRobot className="feature-icon" />
              <h3>{t('home.features.automation.title')}</h3>
              <p>{t('home.features.automation.description')}</p>
            </motion.div>
            <motion.div 
              className="feature-item"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <FaChartLine className="feature-icon" />
              <h3>{t('home.features.analysis.title')}</h3>
              <p>{t('home.features.analysis.description')}</p>
            </motion.div>
            <motion.div 
              className="feature-item"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <FaCoins className="feature-icon" />
              <h3>{t('home.features.crypto.title')}</h3>
              <p>{t('home.features.crypto.description')}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing" id="pricing">
        <div className="content">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >{t('home.pricing.title')}</motion.h2>
          <div className="pricing-list">
            <motion.div 
              className="pricing-item"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <FaCog className="pricing-icon" />
              <h3>{t('home.pricing.basic.title')}</h3>
              <p className="price">{t('home.pricing.basic.price')}</p>
              <ul>
                {t('home.pricing.basic.features', { returnObjects: true }).map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <motion.a 
                href="#signup" 
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >{t('home.pricing.basic.button')}</motion.a>
            </motion.div>
            <motion.div 
              className="pricing-item popular"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <FaRocket className="pricing-icon" />
              <h3>{t('home.pricing.pro.title')}</h3>
              <p className="price">{t('home.pricing.pro.price')}</p>
              <ul>
                {t('home.pricing.pro.features', { returnObjects: true }).map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <motion.a 
                href="#signup" 
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >{t('home.pricing.pro.button')}</motion.a>
            </motion.div>
            <motion.div 
              className="pricing-item"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <FaUsers className="pricing-icon" />
              <h3>{t('home.pricing.business.title')}</h3>
              <p className="price">{t('home.pricing.business.price')}</p>
              <ul>
                {t('home.pricing.business.features', { returnObjects: true }).map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <motion.a 
                href="#signup" 
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >{t('home.pricing.business.button')}</motion.a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="about" id="about">
        <div className="content">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >About Us</motion.h2>
          <motion.div 
            className="about-content"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <p>
              {t('about.description')}
            </p>
            <div className="team">
              <motion.div 
                className="team-member"
                whileHover={{ scale: 1.05 }}
              >
                <FaShieldAlt className="team-icon" />
                <h3>{t('about.founder.name')}</h3>
                <p>{t('about.founder.title')}</p>
              </motion.div>
            </div>
            <motion.a 
              href="#contact" 
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >{t('about.contactButton')}</motion.a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="content">
          <p>© {new Date().getFullYear()} KMG1 Trading. All Rights Reserved.</p>
          <div className="footer-links">
            <a href="/terms">Terms of Use</a> | <a href="/privacy">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;