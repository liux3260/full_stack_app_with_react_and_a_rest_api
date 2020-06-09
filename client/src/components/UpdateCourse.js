import React, { Component } from 'react';
//import { Redirect } from 'react-router-dom';
import axios from 'axios';

export default class updatedCourse extends Component {

    constructor(props) {
        super(props);
        this.state = {
            course: {
                User: {id: 0, firstName: "", lastName: "", emailAddress: ""},
                description: "",
                estimatedTime: undefined,
                id: 0,
                materialsNeeded: undefined,
                title: "",
                userId: 0,
            },
            errors: [],
          };
    
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
      }

  getCoursebyId= async (id)=>{
    const { context } = this.props;
    await axios.get(`http://localhost:5000/api/courses/${id}`)
    .then(response => {
        if(!response.data){
            this.props.history.push("/notfound");
        }
        if(!context.authenticatedUser || context.authenticatedUser.id!==response.data.User.id){
        this.props.history.push("/forbidden");
    }
      this.setState({
        course:response.data
      });
    })
    .catch(error => {
      if(error.response && error.response.status ===500){
        this.props.history.push("/error");
        }
        else{
        this.props.history.push("/notfound");
        }
    });
  }

  updateCoursebyId= async(id)=>{
    const { context } = this.props;
    await axios.put(`http://localhost:5000/api/courses/${id}`,{
        description: this.state.course.description,
        estimatedTime: this.state.course.estimatedTime,
        id: this.state.course.id,
        materialsNeeded: this.state.course.materialsNeeded,
        title: this.state.course.title,
    },{
        headers: {
            'Authorization': `Basic ${context.token}`
          }
    })
    .then(response => {
      this.props.history.push("/");
      })
    .catch(error => {
        if(error.response.status ===500){
            this.props.history.push("/error");
        }
        this.setState({ 
            errors:  error.response.data.errors
        });
    });
  }

  componentDidMount(){
    const id = this.props.match.params.id;
    this.getCoursebyId(id);

  }

  handleChange(event) {
      const updatedCourse = this.state.course;
      const id = event.target.id;
      updatedCourse[id] = event.target.value;
    this.setState({course: updatedCourse});
  }

  handleClick(event){
    event.preventDefault();
    let path = `/courses/${this.state.course.id}`;
    this.props.history.push(path);
  }

  handleUpdate(event){
    event.preventDefault();
    this.updateCoursebyId(this.state.course.id);
  }

  render() {
      const errorList = this.state.errors.map((error)=>
        <li>{error}</li>
    );

    return (
        <div className="bounds course--detail">
        <h1>Update Course</h1>
        {this.state.errors.length>0 
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
            <div className="grid-66">
              <div className="course--header">
                <h4 className="course--label">Course</h4>
                <div>
                    <input id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..."
                    value = {this.state.course?this.state.course.title:""} onChange = {this.handleChange}  /> 

                </div>
                <p>By {`${this.state.course?this.state.course.User.firstName:""} ${this.state.course?this.state.course.User.lastName:""}`}</p>
              </div>
              <div className="course--description">
                <div><textarea id="description" name="description" className="" placeholder="Course description..." value = {this.state.course?this.state.course.description:""} onChange = {this.handleChange}> 
                </textarea></div>
              </div>
            </div>
            <div className="grid-25 grid-right">
              <div className="course--stats">
                <ul className="course--stats--list">
                  <li className="course--stats--list--item">
                    <h4>Estimated Time</h4>
                    <div><input id="estimatedTime" name="estimatedTime" type="text" className="course--time--input"
                        placeholder="Hours" value={this.state.course && this.state.course.estimatedTime?this.state.course.estimatedTime:undefined} onChange = {this.handleChange}></input></div>
                  </li>
                  <li className="course--stats--list--item">
                    <h4>Materials Needed</h4>
                    <div><textarea id="materialsNeeded" name="materialsNeeded" className="" placeholder="List materials..." onChange = {this.handleChange} 
                    value = {this.state.course && this.state.course.materialsNeeded? this.state.course.materialsNeeded:undefined}></textarea>

                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="grid-100 pad-bottom">
            <button className="button" type="submit" onClick={this.handleUpdate}>Update Course</button>
            <button className="button button-secondary" onClick={this.handleClick}>Cancel</button></div>
          </form>
        </div>
      </div>
        
      
    );
  }


}