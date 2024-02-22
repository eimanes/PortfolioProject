import axios from 'axios'
import qs from 'qs';
const Register = (userName, firstName, lastName, email, password, confirmPassword) => {
    let data = qs.stringify({
        'username': userName,
        'firstName': firstName,
        'lastName': lastName,
        'email': email,
        'password': password,
        'confirmPassword': confirmPassword 
      });
      
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `http://localhost:3001/auth/signup`,
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded', 
        //   'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NWNmMTMyLTQwMDItNDhhYy05ZTllLTlkZDUyOWMzNjYxZSIsImlhdCI6MTcwNzczMDQ3N30.YXRqpg-NZk24DbbLKflz-H5pa2bwEur0WlzfC6_GBHY', 
        //   'Cookie': 'connect.sid=s%3AeTwTMofez8bzAbOuCOphsQpxXJAxz2TQ.Agt9%2F6K%2F76M9DtJiHMi78tNhjggoxSCTK427gah36kg'
        },
        data : data
      };
      
      axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(userName);
      });
}

const Login = ( userName, password ) => {
    let data = qs.stringify({
        'username': userName,
        'password': password 
      });
      
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:3001/auth/signin',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded', 
        },
        data : data
      };
      
    return axios.request(config)
    .then((response) => {
      // Returning the response data to the caller
      return response.data;
    })
    .catch((error) => {
      // Handle the error or throw it to be caught by the caller
      console.log(error);
      throw error;
    });
}

const FetchPost = () => {
    //somemethod

    return "Fetch Post"
}

export default {Register, Login, FetchPost}