const { Pool } = require('pg');
const dbConfig = require('../dbConfig');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const pool = new Pool(dbConfig);

async function getDimUser(username) {
    const result = await pool.query('SELECT * FROM dimuser');
    return result.rows;
}

async function checkUserExist(username) {
    const result = await pool.query('SELECT * FROM dimuser WHERE email = $1', [username]);
    return result.rows.length > 0;
}

async function createUser(username, userpass, email) {
    await pool.query(
        'INSERT INTO dimuser (username, userpass, email) VALUES ($1, $2, $3)',
        [username, userpass, email]
    );
}

async function loginUser(username, password) {
    const result = await pool.query(
        'SELECT * FROM dimuser WHERE email = $1',
        [username]
    );
    
    if (result.rows.length === 0) {
        throw new Error('User not found');
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.userpass);

    if (!isPasswordValid) {
        throw new Error('Invalid password');
    }
    console.log(user)
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return  {
        token,
        username: user.username,
        id: user.userid
    };

}

module.exports = { checkUserExist, createUser, getDimUser, loginUser };
