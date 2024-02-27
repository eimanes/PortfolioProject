import React from 'react';

const Data = () => {
  const userData = localStorage.getItem('session');
  console.log(userData);
  const data = userData ? JSON.parse(userData) : null;

  if(data){
    return <div className='col-span-2 pt-10 mr-5 mt-6'>
              <a href='/sign-in' className='text-3xl text-blue-400 hover:text-blue-700 ' >{ data.user.username }</a>
          </div>
  }else{
    return <div className='col-span-2 pt-10 mr-5'>
              <button className="bg-blue-200 hover:bg-blue-700 text-white font-bold mt-6 px-4 py-2 rounded">
                  <a href='/sign-in' className='text-xl text-white' >Sign In</a>
              </button>
          </div>
  }
}

const handleSelectChange = (e) => {
  const selectedValue = e.target.value;

  // Check if the selected value is '/logout'
  if (selectedValue === '/logout') {
    // Call your logout function or perform logout logic here
    localStorage.removeItem('session');
    window.location.reload();

    // Optionally, reset the selected value to an empty string or a default value
    e.target.value = '';
  } else {
    // Navigate to the selected route
    window.location.href = selectedValue;
  }
};

const Header = () => {
  return (
    <header className=' bg-slate-100 h-40'>
      <div className="grid grid-cols-12 gap-4">
      <div className='col-span-9 pt-10'>
        <h1 className='text-7xl text-blue-400 ml-10' >
          <a href='/' className='text-7xl text-blue-400' >Perisian AE</a>
        </h1>
      </div>
      
      <Data></Data>

      <div className='col-span-1 pt-10 pr-10 w-10 mr-auto '>
        <nav className='pt-6'>
        <div className="relative inline-block">
            <select 
              onChange={ handleSelectChange }
              className="appearance-none bg-transparent border-none align-right pr-8 py-2 rounded-lg cursor-pointer">
              <option value=""></option>
              <option value="/">Home</option>
              <option value="/new">New</option>
              <option value="/edit">Edit</option>
              <option value="/connect">Connect</option>
              <option value="/info">Info</option>
              <option value="/logout">Signout</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg 
                className="w-6 h-6 text-gray-400 pointer-events-none"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </div>
          </div>
        </nav>
      </div>
      </div>
    </header>
  );
};

export default Header;
