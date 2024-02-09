// views/ViewD.js
import React from 'react';
import utils from '../utils/routeService';

const ViewRead = () => {
  return (
    <div>
      <h1 className='text-5xl text-blue-800 mb-20'>View Data</h1>
      <p>Component D</p>
      <Read></Read>
    </div>
  );
};
const Read = () => {
  return utils.fetchData();
}
export default ViewRead;
