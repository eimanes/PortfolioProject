import React from 'react';

const SignUp = () =>{

    return (
        <div>
            <div className='pt-10'>
                <form>
                    <h1 className='text-7xl text-blue-800 mb-5'>Sign Up</h1>
                    <div>
                        <label htmlFor='username' className='text-xl text-blue-800'>User Name:&nbsp;&nbsp;</label>
                        <input id='username' type='text' placeholder='Enter your username'></input>
                    </div>
                    <br />
                    <div>
                        <label htmlFor='email' className='text-xl text-blue-800'>Email:&nbsp;&nbsp;</label>
                        <input id='email' type='email' placeholder='Enter your email'></input>
                    </div>
                    <br />
                    <div>
                        <label htmlFor='password' className='text-xl text-blue-800'>Password:&nbsp;&nbsp;</label>
                        <input id='password' type='password' placeholder='Enter your password'></input>
                    </div>
                    <br />
                    <button type='submit' className="bg-blue-200 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
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