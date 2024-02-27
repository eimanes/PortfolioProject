// views/ViewC.js
import React, { useEffect, useState } from 'react';
import connectSocket from '../services/ws';

const ViewConnect = () => {

  return (
    <div>
      <WebSocketComponent></WebSocketComponent>
    </div>
  );
};


const WebSocketComponent = () => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [jwtToken, setJwtToken] = useState(null);

  const userData = localStorage.getItem('session');
  const data = userData ? JSON.parse(userData) : null;

  useEffect(() => {
    const setupWebSocket = async () => {
      try {
        // If JWT token is not available, fetch it asynchronously
        await connectSocket.FetchSocket((newToken) => {
          console.log('New JWT Token:', newToken);
          setJwtToken(newToken);

          // Create a new websocket connection with the obtained or existing token
          const wsUrl = 'ws://localhost:3050';
          const newSocket = new WebSocket(`${wsUrl}?token=${newToken}`);

          // Set up event listeners for the websocket
          newSocket.addEventListener('open', (event) => {
            console.log('WebSocket connection opened:', event);
            // You can send initial data or perform other actions when the connection is open
            newSocket.send('Hello, server!');
          });

          newSocket.addEventListener('message', (event) => {
            // Handle incoming messages from the server
            const newMessage = event.data;
            setMessages((prevMessages) => [...prevMessages, newMessage]);
          });

          newSocket.addEventListener('close', (event) => {
            console.log('WebSocket connection closed:', event);
            // You can handle reconnection logic here if needed
          });

          // Set the socket state
          setSocket(newSocket);
        });
    
        // ... rest of the code
      } catch (error) {
        console.error('Error setting up WebSocket:', error);
      }
    };

    setupWebSocket();

    // Dependency array is empty, so this effect runs once after the initial render
  }, [jwtToken]);

  const [formData, setFormData] = useState({
    send: '',
    // email: '',
    // password: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };      

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!data){

      alert('Please Sign In');
    }else{
      
      try {
        socket.send( formData.send);
  
        } catch (error) {
          console.error('Error during send:', error);
        }
    }

    }

  return (
    <div>
      <h1 className='text-7xl text-blue-800 mb-5'>Test Connection</h1>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
      <div>
          <div className='pt-10'>
              <form onSubmit={handleSubmit}>
                  
                  <div>
                      <label htmlFor='send' className='text-xl text-blue-800'>Message:</label><br />
                      <input id='send' type='text' placeholder='Enter your message' value={formData.send} onChange={handleChange}></input>
                  </div>
                  <br />
                  <button type='submit' className="bg-blue-200 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                      Submit
                  </button>
              </form>
          </div>
      </div>
    </div>
  );
};




export default  ViewConnect ;