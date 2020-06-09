import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default class Courses extends Component {
  state = {
    courses: [],
    errors: [],
  }

  getCourses=()=>{
    axios.get(`http://localhost:5000/api/courses`)
    .then(response => {
      this.setState({
        courses:response.data
      });
    })
    .catch(error => {
        if(error.response.status ===500){
            this.props.history.push("/error");
        }
        this.setState({ 
            errors:  error.response.data.errors
        });
      console.log('Error fetching and parsing data', error.response.data.errors);
    });
  }
  componentDidMount(){
    this.getCourses();
    window.onpopstate = () =>{
        this.getCourses();
    }
  }

  render() {
    const courseList = this.state.courses.map((course)=>
        <div className="grid-33" key = {course['id']}>
            <React.Fragment>
                <Link to={`/Courses/${course['id']}`} className = "course--module course--link">
                    <h4 className="course--label">Course</h4>
                    <h3 className="course--title">{course['title']}</h3>
                </Link>
            </React.Fragment>
        </div>
    );

    return (
      <div className="bounds">
        {courseList}
        <div className="grid-33">
            <Link className="course--module course--add--module" to="/courses/create">
            <h3 className="course--add--title"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                viewBox="0 0 13 13" className="add">
                <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
              </svg>New Course</h3>
            </Link>
        </div>
      </div>
    );
  }


}