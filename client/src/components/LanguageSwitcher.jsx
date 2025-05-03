import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaGlobe } from 'react-icons/fa';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="language-switcher">
      <div className="language-selector">
        <FaGlobe className="language-icon" />
        <select
          value={i18n.language}
          onChange={(e) => changeLanguage(e.target.value)}
          className="language-select"
        >
          <option value="en">English</option>
          <option value="fa">فارسی</option>
          <option value="ar">عربی</option>
          <option value="sv">Svenska</option>
          <option value="fi">Suomi</option>
          <option value="tr">Türkçe</option>
        </select>
      </div>
    </div>
  );
};

export default LanguageSwitcher; 