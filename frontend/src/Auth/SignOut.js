import { useNavigate } from 'react-router-dom';

const SignOut = () => {
  // Call useNavigate at the beginning of your component
    const navigate = useNavigate();

  // Clear the 'session' key from local storage
    localStorage.removeItem('session');

  // Navigate to '/info'
    navigate('/');
    // window.location.reload();
}



export default SignOut;