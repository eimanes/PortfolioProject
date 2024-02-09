// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ViewCreate from './views/Create';
import ViewUpdate from './views/Update';
import ViewConnect from './views/TestConnect';
import ViewRead from './views/Read';
import SignUp from './Auth/SignUp';
import SignIn from './Auth/SignIn';
import Welcome from './views/components/Welcome'


function App() {
  return (
    <Router>
      <Header />
        <div className='flex mx-10 p-5 mt-10 bg-green-100 rounded-md'>
          <Routes>
              <Route path="/" exact element={<Welcome />}  />
              <Route path="/new" element={<ViewCreate />} />
              <Route path="/edit" element={<ViewUpdate />} />
              <Route path="/connect" element={<ViewConnect />} />
              <Route path="/info" element={<ViewRead />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/sign-in" element={<SignIn />} />
            </Routes>
        </div>
      <Footer />
    </Router>
  );
}




export default App;
