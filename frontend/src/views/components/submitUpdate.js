import React from 'react';
import utils from './../../utils/routeService';

function ComponentSubmitUpdate() {
  // Define your function to be triggered when the button is clicked
  const handleSubmit = () => {
    // Your logic here
    alert('Button Update clicked!');
  };

  return (
    <div>
      {/* Button with onClick event handler */}
      <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Submit
      </button>
    </div>
  );
}

export default ComponentSubmitUpdate;
