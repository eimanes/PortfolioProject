// components/Header.js
// Header.js
import React from 'react';

const Header = () => {
  return (
    <header className=' bg-slate-100 h-40'>
      <div className="grid grid-cols-12 gap-4">
      <div className='col-span-9 pt-10'>
        <h1 className='text-7xl text-blue-400 ml-10' >
          <a href='/' className='text-7xl text-blue-400' >AE Software</a>
        </h1>
      </div>
      <div className='col-span-2 pt-10 mr-5'>
          <button className="bg-blue-200 hover:bg-blue-700 text-white font-bold mt-6 px-4 py-2 rounded">
              <a href='/sign-in' className='text-xl text-white' >Sign In</a>
          </button>
      </div>
      <div className='col-span-1 pt-10 pr-10 w-10 mr-auto '>
        <nav className='pt-6'>
        <div className="relative inline-block">
            <select 
              onChange={(e) => window.location.href = e.target.value}
              className="appearance-none bg-transparent border-none align-right pr-8 py-2 rounded-lg cursor-pointer">
              <option value=""></option>
              <option value="/">Home</option>
              <option value="/new">New</option>
              <option value="/edit">Edit</option>
              <option value="/connect">Connect</option>
              <option value="/info">Info</option>
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
