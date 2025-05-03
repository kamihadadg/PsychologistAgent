const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { checkUserExist, createUser, getDimUser, loginUser } = require('../models/dimuser');

exports.login = async (req, res) => {
    try {
        const { username, userpass } = req.body;
        const data = await loginUser(username, userpass);
        res.json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getDimUser = async (req, res) => {
    try {
        const data = await getDimUser();
        res.json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.registerDimUser = async (req, res) => {
    const { username, userpass, email } = req.body;

    if (!username || !userpass || !email) {
        return res.status(400).send("All fields are required");
    }

    try {
        const userExists = await checkUserExist(username);
        if (userExists) {
            return res.status(400).send("Username already exists");
        }

        const hashedPassword = await bcrypt.hash(userpass, 10);
        await createUser(username, hashedPassword, email);

        const token = jwt.sign({ username, email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        res.status(500).send(error.message);
    }
};
