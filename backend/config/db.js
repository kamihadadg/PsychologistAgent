const { Pool } = require('pg');
require('dotenv').config();
const dbConfig = require('../dbConfig');

// تنظیمات اتصال به دیتابیس PostgreSQL
const pool = new Pool(dbConfig);

// اتصال اولیه به دیتابیس
pool.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('PostgreSQL connection error:', err));

// ایجاد یک رابط ساده برای کوئری‌ها
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
}; 