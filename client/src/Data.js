import axios from 'axios';


export default class Data{

      getUser =async(emailAddress,password)=>{
        console.log("username: " + emailAddress);
        console.log("password: " +password);
       return await axios.get(`http://localhost:5000/api/users`,{
          auth:{
              username:emailAddress,
              password:password
          }
      })
      .then(response=>response);
  
    }
}