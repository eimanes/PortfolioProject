import React, { useState } from 'react';
import Auth from './../services/auth';
import { useNavigate } from 'react-router-dom';


const SignUp = () =>{

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        firstname: '',
        lastname: '',
        password: '',
        confirmpassword: '',
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
            await Auth.Register(
              formData.username,
              formData.firstname,
              formData.lastname,
              formData.email,
              formData.password,
              formData.confirmpassword
            );
            navigate('/register-success', { state: { action: 'Signed Up. Please check your email ' + formData.email } });

          } catch (error) {
            console.error('Error during signup:', error);
            // Handle error as needed
          }
      };
    

    return (
        <div>
            <div className='pt-10'>
                <form onSubmit={handleSubmit}>
                    <h1 className='text-7xl text-blue-800 mb-5'>Sign Up</h1>
                    <div>
                        <label htmlFor='username' className='text-xl text-blue-800'>User Name:&nbsp;&nbsp;</label>
                        <input id='username' type='text' placeholder='Enter your username' onChange={handleChange}></input>
                    </div>
                    <br />
                    <div>
                        <label htmlFor='email' className='text-xl text-blue-800'>Email:&nbsp;&nbsp;</label>
                        <input id='email' type='email' placeholder='Enter your email' onChange={handleChange}></input>
                    </div>
                    <br />
                    <div>
                        <label htmlFor='firstname' className='text-xl text-blue-800'>First Name:&nbsp;&nbsp;</label>
                        <input id='firstname' type='text' placeholder='Enter your first name' onChange={handleChange}></input>
                    </div>
                    <br />
                    <div>
                        <label htmlFor='lastname' className='text-xl text-blue-800'>Last Name:&nbsp;&nbsp;</label>
                        <input id='lastname' type='text' placeholder='Enter your last name' onChange={handleChange}></input>
                    </div>
                    <br />
                    <div>
                        <label htmlFor='password' className='text-xl text-blue-800'>Password:&nbsp;&nbsp;</label>
                        <input id='password' type='password' placeholder='Enter your password' onChange={handleChange}></input>
                    </div>
                    <br />
                    <div>
                        <label htmlFor='confirmpassword' className='text-xl text-blue-800'>Confirm Password:&nbsp;&nbsp;</label>
                        <input id='confirmpassword' type='password' placeholder='Confirm your password' onChange={handleChange}></input>
                    </div>
                    <br />
                    <button
                        type='submit'
                        className="bg-blue-200 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        // onClick={ handleClick } // Add the onClick event handler
                        >
                        Submit
                    </button>
                </form>
            </div>
            <div className='pt-10'>
                <p className=' text-blue-800 mb-5'>Already Registered?</p>
                <button className="bg-blue-200 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    <a href='/sign-in' className='text-xl text-white' >Sign In</a>
                </button>
            </div>
        </div>
    )
}

export default SignUp;