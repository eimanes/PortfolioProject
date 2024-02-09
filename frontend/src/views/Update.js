// views/ViewB.js
import React from 'react';
import utils from '../utils/routeService';
import ComponentSubmitUpdate from './components/submitUpdate';

const ViewUpdate = () => {
  return (
    <div>
      <h1 className='text-5xl text-blue-800 mb-20'>Update Data</h1>
      <p>Component B</p>
      <Update></Update>
      <ComponentSubmitUpdate></ComponentSubmitUpdate>
    </div>
  );
};

const Update = () => {
  return utils.updateData();
}

export default ViewUpdate;
