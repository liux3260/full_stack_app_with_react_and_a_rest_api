import React, { Component } from 'react';
import Data from './Data';
import Cookies from 'js-cookie';

const Context = React.createContext(); 

export class Provider extends Component {

  state = {
    authenticatedUser: Cookies.getJSON('authenticatedUser') || null,
    //password: null,
    token: Cookies.getJSON('token') || null,
  };
//Cookies.getJSON('authenticatedUser')

  constructor() {
    super();
    this.data = new Data();
  }

  render() {
    const { authenticatedUser,token } = this.state;

    const value ={
      authenticatedUser,
      token,
      data:this.data,
      actions: { 
        signIn: this.signIn,
        signOut: this.signOut
      }
    };
    return (
      <Context.Provider value = {value}>
        {this.props.children}
      </Context.Provider>  
    );
  }

  
  signIn = async (emailAddress,pass) => {
    const user = await this.data.getUser(emailAddress,pass);
    //console.log(user);
    if (user !== null) {
        //console.log("setting state");
        const tk =  Buffer.from(`${user.data.emailAddress}:${pass}`, 'utf8').toString('base64');
      this.setState( {
        authenticatedUser: user.data,
        token: tk,
      });
      // Set cookie
      //console.log("setting cookies");
      Cookies.set('authenticatedUser',JSON.stringify(user.data), { expires: 1 });
      Cookies.set('token',JSON.stringify(tk), { expires: 1 });
      //console.log(tk);

    }

    //console.log("User in context: " +this.state.authenticatedUser);
    //console.log("password in context : " + this.state.password);
    return user;
  }

  signOut = () => {
    this.setState({ 
        authenticatedUser: null,
        token: null
     });
    Cookies.remove('authenticatedUser');
    Cookies.remove('token');
  }
}

export const Consumer = Context.Consumer;

/**
 * A higher-order component that wraps the provided component in a Context Consumer component.
 * @param {class} Component - A React component.
 * @returns {function} A higher-order component.
 */

export default function withContext(Component) {
  return function ContextComponent(props) {
    return (
      <Context.Consumer>
        {context => <Component {...props} context={context} />}
      </Context.Consumer>
    );
  }
}