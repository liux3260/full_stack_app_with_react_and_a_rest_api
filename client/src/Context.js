import React, { Component } from 'react';
import Data from './Data';
import Cookies from 'js-cookie';

const Context = React.createContext(); 

/**
 * The Context class that will be used through out the program.
 * This class use the functions from Data.js
 */
export class Provider extends Component {

  state = {
    authenticatedUser: Cookies.getJSON('authenticatedUser') || null,
    token: Cookies.getJSON('token') || null,
  };

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

  /**
   * SignIn function that will be used in UserSignIn.js
   */
  signIn = async (emailAddress,pass) => {
    const user = await this.data.getUser(emailAddress,pass);
    if (user !== null) {
        const tk =  Buffer.from(`${user.data.emailAddress}:${pass}`, 'utf8').toString('base64');
      this.setState( {
        authenticatedUser: user.data,
        token: tk,
      });
      // Set cookie
      Cookies.set('authenticatedUser',JSON.stringify(user.data), { expires: 1 });
      Cookies.set('token',JSON.stringify(tk), { expires: 1 });

    }
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