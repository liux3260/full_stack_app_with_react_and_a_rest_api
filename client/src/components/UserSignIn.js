import React, { Component } from 'react';
import { Link } from 'react-router-dom';
//import axios from 'axios';

export default class UserSignIn extends Component {
    constructor(props){
        super(props);
        this.state = {
            authenticatedUser: null,
            emailAddress: '',
            password: '',
            errors: [],
          };
    
        this.change = this.change.bind(this);
        this.submit = this.submit.bind(this);
        this.cancel = this.cancel.bind(this);
        //this.signIn = this.signIn.bind(this);
    }


      //Cookies.getJSON('authenticatedUser') |
  render() {
    const {
        emailAddress,
      password,
    } = this.state;

    return (
        <div className="bounds">
            <div className="grid-33 centered signin">
            <h1>Sign In</h1>
            <div>
                <form>
                <div><input id="emailAddress" name="emailAddress" type="text" className="" placeholder="Email Address" value={emailAddress}  onChange={this.change}  /></div>
                <div><input id="password" name="password" type="password" className="" placeholder="Password" value={password}  onChange={this.change}  /></div>
                <div className="grid-100 pad-bottom"><button className="button" type="submit" onClick ={this.submit}>Sign In</button><button className="button button-secondary" onClick={this.cancel}>Cancel</button></div>
                </form>
            </div>
            <p>&nbsp;</p>
            <p>Don't have a user account? <Link to="/signup">Click here</Link> to sign up!</p>
            </div>
        </div>
    );
  }

  change = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(() => {
      return {
        [name]: value
      };
    });
  }

  submit = (event) => {
    event.preventDefault();
    const { context } = this.props;
    const { emailAddress, password } = this.state;
    //const { from } = this.props.location.state || { from: { pathname: '/' } };
    context.actions.signIn(emailAddress,password)
        .then(user => {
            //console.log("User: " +user.data);
            //console.log("password: " + context.password);
            if(user.data == null){
                console.log('Sign-in was unsuccessful');
                this.setState(() => {
                  return { errors: [ 'Sign-in was unsuccessful' ] };
                });
            }
            else{
                /*
                this.setState({
                    authenticatedUser: response.data,
                });
                Cookies.set('authenticatedUser',JSON.stringify(response.data), { expires: 1 });*/
                //this.props.history.push(from);
                console.log(`SUCCESS! ${user.data.emailAddress} is now signed in!`);
                this.props.history.goBack();
            }
        })
        .catch(error => {
            if(error.response.status ===500){
                this.props.history.push("/error");
            }
            //console.log(context.password);
            console.log('Error getting user', error.response);
        });

  }

  cancel = (event) => {
    event.preventDefault();
    this.props.history.push('/');
  }
/*
  signIn = async (emailAddress,password) => {
    await this.getUser(emailAddress,password);
    console.log(this.authenticatedUser);
    const user = this.authenticatedUser;
    if (user !== null) {
      // Set cookie
      Cookies.set('authenticatedUser',JSON.stringify(user), { expires: 1 });
    }
    return user;
  }

   getUser =async(emailAddress,password)=>{
      console.log("username: " + emailAddress);
      console.log("password: " +password);
    return await axios.get(`http://localhost:5000/api/users`,{
        auth:{
            username:emailAddress,
            password:password
        }
    })

  }*/
}