const express = require('express');
const http = require('http');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser'); // Import body-parser
require('dotenv').config();
const crypto = require('crypto');


const app = express();

app.use(bodyParser.json());

// HTTP request authentication with JWT
const existingRoom = async (req, res) => {
    try {
        // For simplicity, assume the client sends credentials in the request body
        const { username, room } = req.body;

        const secretKey = process.env.SECRET_KEY; // Replace with a strong secret key in production
        const expiration = process.env.JWT_EXPIRATION;

        // Perform authentication logic 
        // If authentication succeeds, create a JWT
        const token = jwt.sign({ username, role: 'user', room }, secretKey, { expiresIn: expiration });

        // Send the JWT token to the client
        res.json({ token, username, room });

    }catch(error){

        console.error(error);

    }
};

const newRoom = async (req, res) => {
    try {
        // For simplicity, assume the client sends credentials in the request body
        const { username } = req.body;

        const secretKey = process.env.SECRET_KEY; // Replace with a strong secret key in production
        const expiration = process.env.JWT_EXPIRATION;

        // Perform authentication logic 
        const room = generateRandomId(8);

        console.log(room);

        const token = jwt.sign({ username, role: 'user', room }, secretKey, { expiresIn: expiration });

        // Send the JWT token to the client
        res.json({ token, username, room  });

    }catch(error){
        
        console.error(error);

    }
};

const generateRandomId = (length = 10) => (
    crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length)
);

module.exports = {
    // verifyToken,
    existingRoom,
    newRoom
  };