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
    
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

  render() {
    const {
        emailAddress,
      password,
      errors,
    } = this.state;

    let errorList = [];
    if(errors)
    {
      errorList = errors.map((error,index)=>
        <li key ={index}>{error} </li>
    );
    }

    return (
        <div className="bounds">
            <div className="grid-33 centered signin">
            <h1>Sign In</h1>
            {errors && errors.length>0 
            ?
            <div>
                <h2 className="validation--errors--label">Validation errors</h2>
                <div className="validation-errors">
                <ul>
                    {errorList}
                </ul>
                </div>
            </div>
            :
            <div></div>

            }
            <div>
                <form>
                <div><input id="emailAddress" name="emailAddress" type="text" className="" placeholder="Email Address" value={emailAddress}  onChange={this.handleChange}  /></div>
                <div><input id="password" name="password" type="password" className="" placeholder="Password" value={password}  onChange={this.handleChange}  /></div>
                <div className="grid-100 pad-bottom"><button className="button" type="submit" onClick ={this.handleSubmit}>Sign In</button><button className="button button-secondary" onClick={this.handleCancel}>Cancel</button></div>
                </form>
            </div>
            <p>&nbsp;</p>
            <p>Don't have a user account? <Link to="/signup">Click here</Link> to sign up!</p>
            </div>
        </div>
    );
  }

  handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(() => {
      return {
        [name]: value
      };
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { context } = this.props;
    const { emailAddress, password } = this.state;
    let errorArray = []
    
    if(!emailAddress){
      errorArray.push("Email Address is required.");
    }

    if(!password){
      errorArray.push("Password is required.");
    }
    context.actions.signIn(emailAddress,password)
        .then(user => {
            //console.log("User: " +user.data);
            //console.log("password: " + context.password);
            if(user.data == null){
                //console.log('Sign-in was unsuccessful');
                this.setState(() => {
                  return { errors: [ 'Sign-in was unsuccessful' ] };
                });
            }
            else{
                this.props.history.goBack();
            }
        })
        .catch(error => {
            if(error.response.status ===500){
                this.props.history.push("/error");
            }
            errorArray.push(error.response.data.message);
            this.setState({ 
              errors:  errorArray
          });
        });

  }

  handleCancel = (event) => {
    event.preventDefault();
    this.props.history.push('/');
  }
}