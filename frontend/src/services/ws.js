import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import WebSocket from 'ws';
// require('dotenv').config();


const FetchSocket = async ( callback ) => {
    const userData = localStorage.getItem('session');
    console.log(userData);
    const data = userData ? JSON.parse(userData) : null;
    const user = data.user.username;
    try {
      let jwtToken = '';
      let data = JSON.stringify({
        "username": user,
        "room": "9"
      });
      
      let config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: 'http://localhost:3050/login/existing',
        headers: { 
          'Content-Type': 'application/json',
        },
        data: data
      };
      
      const response = await axios.request(config);
      jwtToken = response.data.token;
  
      console.log(JSON.stringify(jwtToken));
  
      // Invoke the callback with the obtained JWT token
      if (callback && typeof callback === 'function') {
        callback(jwtToken);
      }
  
      return jwtToken;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  

export default { FetchSocket }