// views/ViewA.js
import React from 'react';
import utils from '../utils/routeService';
import ComponentSubmitNew from './components/submitNew';

const ViewCreate = () => {
  return (
    <div>
      <h1 className='text-5xl text-blue-800 mb-20'>Create Data</h1>
      <p>Insert Form</p>
      <Create></Create>

      <ComponentSubmitNew></ComponentSubmitNew>
    </div>
  );
};

const Create = () => {
    return utils.postData();
}
export default ViewCreate;
