import React from 'react';
import utils from '../utils/routeService';
import { useLocation } from 'react-router-dom';


const ViewRead = () => {
    const location = useLocation();
    const { action } = location.state || {};
  
    return (
      <div>
        <h1 className='text-5xl text-blue-800 mb-20'>Successfully { action } </h1>
        <p className='text-2xl' > Back <a href='/' className='text-2xl text-blue-800' >Home</a> </p>
        <Data></Data>
      </div>
    );
};

const Data = () => {
    const userData = localStorage.getItem('session');
    console.log(userData);
    const data = userData ? JSON.parse(userData) : null;

    return data.token;
}
  
export default ViewRead;
