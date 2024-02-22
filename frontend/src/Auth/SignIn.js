import React, { useState } from 'react';
import Auth from './../services/auth';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        // email: '',
        password: '',
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
        try {
            const responseData = await Auth.Login(
              formData.username,
            //   formData.email,
              formData.password,
            );

            // Store the data in local storage
            localStorage.setItem('session', JSON.stringify(responseData));
            // Navigate to another page
            // navigate('/');
            // Reload the other page
            window.location.replace('/');

          } catch (error) {
            console.error('Error during signup:', error);
            // Handle error as needed
          }
      };
    return (
        <div>
            <div className='pt-10'>
                <form onSubmit={handleSubmit}>
                    <h1 className='text-7xl text-blue-800 mb-5'>Sign In</h1>
                    <div>
                        <label htmlFor='username' className='text-xl text-blue-800'>Username:</label><br />
                        <input id='username' type='text' placeholder='Enter your username' onChange={handleChange}></input>
                    </div>
                    <br />
                    {/* <div>
                        <label htmlFor='email' className='text-xl text-blue-800'>Email:</label><br />
                        <input id='email' type='email' placeholder='Enter your email' onChange={handleChange}></input>
                    </div>
                    <br /> */}
                    <div>
                        <label htmlFor='password' className='text-xl text-blue-800'>Password:</label><br />
                        <input id='password' type='password' placeholder='Enter your password' onChange={handleChange}></input>
                    </div>
                    <br />
                    <button type='submit' className="bg-blue-200 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Submit
                    </button>
                </form>
            </div>
            <div className='pt-10'>
                <p className=' text-blue-800 mb-5'>Not yet Registered?</p>
                <button className="bg-blue-200 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    <a href='/sign-up' className='text-xl text-white' >Sign Up</a>
                </button>
            </div>
        </div>
    )
}

export default SignIn;