import React from 'react';

const SignIn = () => {
    return (
        <div>
            <div className='pt-10'>
                <form>
                    <h1 className='text-7xl text-blue-800 mb-5'>Sign In</h1>
                    <div>
                        <label htmlFor='email' className='text-xl text-blue-800'>Email:</label><br />
                        <input id='email' type='email' placeholder='Enter your email'></input>
                    </div>
                    <br />
                    <div>
                        <label htmlFor='password' className='text-xl text-blue-800'>Password:</label><br />
                        <input id='password' type='password' placeholder='Enter your password'></input>
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