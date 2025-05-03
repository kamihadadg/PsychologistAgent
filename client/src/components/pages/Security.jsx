import React, { useState, useEffect } from 'react';
import { FaShieldAlt, FaLock, FaKey, FaMobileAlt, FaGoogle, FaEnvelope } from 'react-icons/fa';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './Security.css';
import Sidebar from './Sidebar';

function Security() {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('password');
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    emailNotifications: true,
    smsNotifications: false,
    googleAuthenticator: false,
  });

  useEffect(() => {
    fetchSecuritySettings();
  }, []);

  const fetchSecuritySettings = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/security`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setFormData(response.data);
      setLoading(false);
    } catch (err) {
      setError(t('security.errors.loadFailed'));
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError(t('security.errors.passwordMismatch'));
      return;
    }

    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/users/change-password`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setError(null);
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError(t('security.errors.passwordChangeFailed'));
    }
  };

  const handleTwoFactorToggle = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/two-factor`,
        {
          enabled: !formData.twoFactorEnabled,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setFormData({
        ...formData,
        twoFactorEnabled: !formData.twoFactorEnabled,
      });
    } catch (err) {
      setError(t('security.errors.twoFactorUpdateFailed'));
    }
  };

  const handleNotificationSettings = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/notifications`,
        {
          email: formData.emailNotifications,
          sms: formData.smsNotifications,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
    } catch (err) {
      setError(t('security.errors.notificationUpdateFailed'));
    }
  };

  if (loading) {
    return <div className="loading">{t('common.loading')}</div>;
  }

  return (
    <div className="security-container" dir={i18n.dir()}>
      <Sidebar />
      <div className="security-header">
        <h1>{t('security.title')}</h1>
        <p>{t('security.subtitle')}</p>
      </div>

      <div className="security-content">
        <div className="security-sidebar">
          <button
            className={activeTab === 'password' ? 'active' : ''}
            onClick={() => setActiveTab('password')}
          >
            <FaLock />
            <span>{t('security.tabs.password')}</span>
          </button>
          <button
            className={activeTab === '2fa' ? 'active' : ''}
            onClick={() => setActiveTab('2fa')}
          >
            <FaShieldAlt />
            <span>{t('security.tabs.twoFactor')}</span>
          </button>
          <button
            className={activeTab === 'notifications' ? 'active' : ''}
            onClick={() => setActiveTab('notifications')}
          >
            <FaEnvelope />
            <span>{t('security.tabs.notifications')}</span>
          </button>
          <button
            className={activeTab === 'devices' ? 'active' : ''}
            onClick={() => setActiveTab('devices')}
          >
            <FaMobileAlt />
            <span>{t('security.tabs.devices')}</span>
          </button>
        </div>

        <div className="security-main">
          {error && <div className="error-message">{error}</div>}

          <motion.div
            className="security-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'password' && (
              <>
                <h2>
                  <FaLock />
                  {t('security.password.title')}
                </h2>
                <form onSubmit={handlePasswordChange}>
                  <div className="form-group">
                    <label>{t('security.password.current')}</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('security.password.new')}</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('security.password.confirm')}</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <button type="submit" className="btn-primary">
                    {t('security.password.update')}
                  </button>
                </form>
              </>
            )}

            {activeTab === '2fa' && (
              <>
                <h2>
                  <FaShieldAlt />
                  {t('security.twoFactor.title')}
                </h2>
                <div className="security-feature">
                  <div className="feature-header">
                    <h3>{t('security.twoFactor.googleAuthenticator')}</h3>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={formData.googleAuthenticator}
                        onChange={handleTwoFactorToggle}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <p>{t('security.twoFactor.description')}</p>
                  {formData.googleAuthenticator && (
                    <div className="qr-code">
                      <img src="/assets/qr-code.png" alt={t('security.twoFactor.qrAlt')} />
                      <p>{t('security.twoFactor.qrInstruction')}</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === 'notifications' && (
              <>
                <h2>
                  <FaEnvelope />
                  {t('security.notifications.title')}
                </h2>
                <div className="notification-settings">
                  <div className="checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        name="emailNotifications"
                        checked={formData.emailNotifications}
                        onChange={handleInputChange}
                      />
                      {t('security.notifications.email')}
                    </label>
                    <p>{t('security.notifications.emailDescription')}</p>
                  </div>
                  <div className="checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        name="smsNotifications"
                        checked={formData.smsNotifications}
                        onChange={handleInputChange}
                      />
                      {t('security.notifications.sms')}
                    </label>
                    <p>{t('security.notifications.smsDescription')}</p>
                  </div>
                  <button className="btn-primary" onClick={handleNotificationSettings}>
                    {t('security.notifications.save')}
                  </button>
                </div>
              </>
            )}

            {activeTab === 'devices' && (
              <>
                <h2>
                  <FaMobileAlt />
                  {t('security.devices.title')}
                </h2>
                <div className="devices-list">
                  <div className="device-item">
                    <div className="device-info">
                      <h3>{t('security.devices.device1.name')}</h3>
                      <p>{t('security.devices.device1.lastActive')}</p>
                    </div>
                    <button className="btn-secondary">{t('security.devices.revoke')}</button>
                  </div>
                  <div className="device-item">
                    <div className="device-info">
                      <h3>{t('security.devices.device2.name')}</h3>
                      <p>{t('security.devices.device2.lastActive')}</p>
                    </div>
                    <button className="btn-secondary">{t('security.devices.revoke')}</button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Security;