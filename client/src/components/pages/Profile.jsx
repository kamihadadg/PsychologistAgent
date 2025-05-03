import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaGlobe, FaLanguage, FaCog } from 'react-icons/fa';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './Profile.css';
import Sidebar from './Sidebar';

function Profile() {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    language: 'en',
    timezone: 'UTC',
    theme: 'light',
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setFormData(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load profile data');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/users/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setError(null);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  if (loading) {
    return <div className="loading">{t('loading_profile')}</div>;
  }

  return (
    <div className="profile-container" dir={i18n.dir()}>
      <Sidebar />
      <div className="profile-header">
        <h1>{t('profile_settings')}</h1>
        <p>{t('manage_personal_info')}</p>
      </div>

      <div className="profile-content">
        <div className="profile-sidebar">
          <button
            className={activeTab === 'general' ? 'active' : ''}
            onClick={() => setActiveTab('general')}
          >
            <FaUser />
            <span>{t('general')}</span>
          </button>
          <button
            className={activeTab === 'preferences' ? 'active' : ''}
            onClick={() => setActiveTab('preferences')}
          >
            <FaCog />
            <span>{t('preferences')}</span>
          </button>
        </div>

        <div className="profile-main">
          {error && <div className="error-message">{t('error_message')}</div>}

          <motion.div
            className="profile-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'general' && (
              <>
                <h2>
                  <FaUser />
                 
                  {t('general_information')}
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>{t('full_name')}</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('email')}</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('phone_number')}</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('country')}</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                    />
                  </div>
                  <button type="submit" className="btn-primary">
                    {t('save_changes')}
                  </button>
                </form>
              </>
            )}

            {activeTab === 'preferences' && (
              <>
                <h2>
                  <FaCog />
                  {t('preferences')}
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>{t('language')}</label>
                    <select
                      name="language"
                      value={formData.language}
                      onChange={handleInputChange}
                    >
                      <option value="en">{t('english')}</option>
                      <option value="es">{t('spanish')}</option>
                      <option value="fr">{t('french')}</option>
                      <option value="de">{t('german')}</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>{t('timezone')}</label>
                    <select
                      name="timezone"
                      value={formData.timezone}
                      onChange={handleInputChange}
                    >
                      <option value="UTC">{t('utc')}</option>
                      <option value="EST">{t('eastern_time')}</option>
                      <option value="PST">{t('pacific_time')}</option>
                      <option value="CET">{t('central_european_time')}</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>{t('theme')}</label>
                    <select
                      name="theme"
                      value={formData.theme}
                      onChange={handleInputChange}
                    >
                      <option value="light">{t('light')}</option>
                      <option value="dark">{t('dark')}</option>
                      <option value="system">{t('system')}</option>
                    </select>
                  </div>
                  <button type="submit" className="btn-primary">
                    {t('save_preferences')}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Profile;