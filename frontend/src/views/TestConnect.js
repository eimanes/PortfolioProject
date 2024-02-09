// views/ViewC.js
import React from 'react';
import utils from '../utils/routeService';

const ViewConnect = () => {
  return (
    <div>
      <h1 className='text-5xl text-blue-800 mb-20'>Test Connection</h1>
      <p>Component C</p>
      <Connect></Connect>
    </div>
  );
};

const Connect = () => {
  return utils.connectData();
}

export default ViewConnect;
