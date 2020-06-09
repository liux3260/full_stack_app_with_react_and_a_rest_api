import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
//import Cookies from 'js-cookie';

export default class UserSignUp extends Component {
    constructor(props){
        super(props);
        this.state = {
            authenticatedUser: null,
            emailAddress: '',
            password: '',
            errors: [],
            firstName:'',
            lastName:'',
            confirmPassword:''
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
      firstName,
      lastName,
      confirmPassword
    } = this.state;

    const errorList = this.state.errors.map((error,index)=>
        <li key ={index}>{error} </li>
    );

    return (
        <div className="bounds">
        <div className="grid-33 centered signin">
          <h1>Sign Up</h1>
          {errors.length>0 
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
              <div><input id="firstName" name="firstName" type="text" className="" placeholder="First Name" value={firstName} onChange={this.handleChange} /></div>
              <div><input id="lastName" name="lastName" type="text" className="" placeholder="Last Name" value={lastName} onChange={this.handleChange} /></div>
              <div><input id="emailAddress" name="emailAddress" type="text" className="" placeholder="Email Address" value={emailAddress} onChange={this.handleChange} /></div>
              <div><input id="password" name="password" type="password" className="" placeholder="Password" value={password} onChange={this.handleChange} /></div>
              <div><input id="confirmPassword" name="confirmPassword" type="password" className="" placeholder="Confirm Password"
                  value={confirmPassword} onChange={this.handleChange} /></div>
              <div className="grid-100 pad-bottom">
                <button className="button" type="submit" onClick ={this.handleSubmit}>Sign Up</button>
                <button className="button button-secondary" onClick={this.handleCancel}>Cancel</button></div>
            </form>
          </div>
          <p>&nbsp;</p>
          <p>Already have a user account? <Link to="/signin">Click here</Link> to sign in!</p>
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
    //console.log(this.state);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.createUser();

  }

  handleCancel = (event) => {
    event.preventDefault();
    this.props.history.push('/');
  }

  createUser= async()=>{
    if(this.state.password === this.state.confirmPassword){
        await axios.post(`http://localhost:5000/api/users`,{
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            emailAddress: this.state.emailAddress,
            password: this.state.password,
        })
        .then(response => {
            //console.log(response);
            this.props.history.goBack();
        })
        .catch(error => {
            if(error.response.status ===500){
                this.props.history.push("/error");
            }
            this.setState({ 
                errors:  error.response.data.errors
            });
            //console.log('Error creating user', error.response.data.errors);
        });
  }
  else{
      //console.error("Passwords doesn't match");
      this.setState(() => {
        return { errors: [ "Passwords doesn't match" ] };
      });
  }
}

}