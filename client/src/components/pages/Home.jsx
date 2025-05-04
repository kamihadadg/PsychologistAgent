import React, { useEffect } from 'react';
import { FaBook, FaPencilAlt, FaHeart, FaStar, FaUsers, FaQuestionCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './Home.css';

import Header from './Header';

function Home() {
  const { t, i18n } = useTranslation();

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
          data="/assets/education-bg.svg"
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
              >
                {t('home.hero.getStarted')}
              </motion.a>
            </div>
          </motion.div>
          <motion.div
            className="hero-image"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img src="/assets/education-hero.png" alt="Educational Tests" className="hero-img" />
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
          >
            {t('home.features.title')}
          </motion.h2>
          <div className="feature-list">
            <motion.div
              className="feature-item"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <FaBook className="feature-icon" />
              <h3>{t('home.features.learning.title')}</h3>
              <p>{t('home.features.learning.description')}</p>
            </motion.div>
            <motion.div
              className="feature-item"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <FaPencilAlt className="feature-icon" />
              <h3>{t('home.features.quizzes.title')}</h3>
              <p>{t('home.features.quizzes.description')}</p>
            </motion.div>
            <motion.div
              className="feature-item"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <FaHeart className="feature-icon" />
              <h3>{t('home.features.wellbeing.title')}</h3>
              <p>{t('home.features.wellbeing.description')}</p>
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
          >
            {t('home.pricing.title')}
          </motion.h2>
          <div className="pricing-list">
            <motion.div
              className="pricing-item"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <FaStar className="pricing-icon" />
              <h3>{t('home.pricing.free.title')}</h3>
              <p className="price">{t('home.pricing.free.price')}</p>
              <ul>
                {t('home.pricing.free.features', { returnObjects: true }).map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <motion.a
                href="#signup"
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('home.pricing.free.button')}
              </motion.a>
            </motion.div>
            <motion.div
              className="pricing-item popular"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <FaBook className="pricing-icon" />
              <h3>{t('home.pricing.premium.title')}</h3>
              <p className="price">{t('home.pricing.premium.price')}</p>
              <ul>
                {t('home.pricing.premium.features', { returnObjects: true }).map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <motion.a
                href="#signup"
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('home.pricing.premium.button')}
              </motion.a>
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
              <h3>{t('home.pricing.family.title')}</h3>
              <p className="price">{t('home.pricing.family.price')}</p>
              <ul>
                {t('home.pricing.family.features', { returnObjects: true }).map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <motion.a
                href="#signup"
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('home.pricing.family.button')}
              </motion.a>
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
          >
            {t('home.about.title')}
          </motion.h2>
          <motion.div
            className="about-content"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <p>{t('home.about.description')}</p>
            <div className="team">
              <motion.div className="team-member" whileHover={{ scale: 1.05 }}>
                <FaQuestionCircle className="team-icon" />
                <h3>{t('home.about.team.lead.name')}</h3>
                <p>{t('home.about.team.lead.title')}</p>
              </motion.div>
            </div>
            <motion.a
              href="#contact"
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('home.about.contactButton')}
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="content">
          <p>© {new Date().getFullYear()} LearnEasy. All Rights Reserved.</p>
          <div className="footer-links">
            <a href="/terms">{t('home.footer.terms')}</a> | <a href="/privacy">{t('home.footer.privacy')}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;