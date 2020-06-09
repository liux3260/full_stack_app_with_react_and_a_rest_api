import axios from 'axios';

/**
 * Data class will be used in Context.js
 */
export default class Data{

      getUser =async(emailAddress,password)=>{

       return await axios.get(`http://localhost:5000/api/users`,{
          auth:{
              username:emailAddress,
              password:password
          }
      })
      .then(response=>response);
  
    }
}