require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const dbConfig = require('./dbConfig');
const cors = require('cors');
const app = express();

app.use(cors({
    origin: ['http://localhost:3101','http://192.168.1.112:3101'],
    // origin: ['*'],
    credentials: true
  }));
app.use(bodyParser.json());

const pool = new Pool(dbConfig);
pool.connect()
    .then(() => console.log("Database connected!"))
    .catch(err => console.error("Database error: ", err));

const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];
    if (!token) return res.sendStatus(403);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.get('/', (req, res) => res.send('Node.js + Express API with PostgreSQL and JWT!'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports = { authenticateJWT };


app.use('/api/dimuser', require('./routes/dimuser'));
app.use('/api/auth', require('./routes/authRoutes'));