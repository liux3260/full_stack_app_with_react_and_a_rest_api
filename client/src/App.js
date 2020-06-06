import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import withContext from './Context';
import PrivateRoute from './PrivateRoute';


import Header from './components/Header';
import Courses from './components/Courses';
import UpdateCourse from './components/UpdateCourse';
import UserSignUp from './components/UserSignUp';
import UserSignIn from './components/UserSignIn';
import UserSignOut from './components/UserSignOut';
import CreateCourse from './components/CreateCourse';
import CourseDetail from './components/CourseDetail';
import NotFound from './components/NotFound';
import Forbidden from './components/Forbidden';
import UnhandledError from './components/UnhandledError';

//const HeaderWithContext = withContext(Header);
//const UserSignUpWithContext = withContext(UserSignUp);
// Connect UserSignIn to context
//const UserSignInWithContext = withContext(UserSignIn);
//const AuthWithContext = withContext(Authenticated);
//const UserSignOutWithContext = withContext(UserSignOut);
//<Route path="/courses/create" component={CreateCourse} />

const UserSignInWithContext = withContext(UserSignIn);
const CourseDetailWithContext = withContext(CourseDetail);
const CreateCourseWithContext = withContext(CreateCourse);
const UpdateCourseWithContext = withContext(UpdateCourse);
const HeaderWithContext = withContext(Header);
const UserSignOutWithContext = withContext (UserSignOut);


class App extends Component{
  render(){
    return(
      <Router>
      <div>
        <HeaderWithContext />

        <Switch>
          <Route exact path="/" component={Courses} />
          <PrivateRoute path="/courses/create" component={CreateCourseWithContext} />
          <Route exact path="/courses/:id" component={CourseDetailWithContext} />
          <PrivateRoute path="/courses/:id/update" component={UpdateCourseWithContext} />
          <Route path="/signin" component={UserSignInWithContext} />
          <Route path="/signup" component={UserSignUp} />
          <Route path="/signout" component={UserSignOutWithContext} />
          <Route path = "/forbidden" component={Forbidden} />
          <Route path = "/error" component={UnhandledError} />
          <Route path = "/notfound" component={NotFound} />
          <Route render={() => <Redirect to="/notfound" />} />
        </Switch>
    </div>
    </Router>
    );
  }
}

export default App;
