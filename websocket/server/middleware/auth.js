const express = require('express');
const http = require('http');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser'); // Import body-parser
require('dotenv').config();


const app = express();

app.use(bodyParser.json());

// HTTP request authentication with JWT
const login = async (req, res) => {
    try {
        // For simplicity, assume the client sends credentials in the request body
        const { username, gameid } = req.body;

        const secretKey = process.env.SECRET_KEY; // Replace with a strong secret key in production
        const expiration = process.env.JWT_EXPIRATION;

        // Perform authentication logic (e.g., verify username and password)
        // If authentication succeeds, create a JWT
        const token = jwt.sign({ username, role: 'user' }, secretKey, { expiresIn: expiration });

        // Send the JWT token to the client
        res.json({ token });

    }catch(error){

        console.error(error);

    }
};

module.exports = {
    // verifyToken,
    login,
  };