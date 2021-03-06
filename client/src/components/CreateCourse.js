import React, { Component } from 'react';
//import { Link } from 'react-router-dom';
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
        this.handleCancel = this.handleCancel.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
      }

      /**
       * An async function that create the course in the database
       */
  createCoursebyId= async()=>{
    const { context } = this.props;
    await axios.post(`http://localhost:5000/api/courses`,{
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


  /**
   * Event handler that handles the changes in the textbox
   * @param event 
   */
  handleChange(event) {
      const updatedCourse = this.state.course;
      const id = event.target.id;
      updatedCourse[id] = event.target.value;
    this.setState({course: updatedCourse});
  }

  /**
   * Event handler that handles the calcel button
   * @param event 
   */
  handleCancel(event){
    event.preventDefault();
    let path = `/`;
    this.props.history.push(path);
  }

  /**
   * Event handler that handles the create button
   * @param  event 
   */
  handleCreate(event){
    event.preventDefault();
    this.createCoursebyId();
  }

  render() {
      const errorList = this.state.errors.map((error)=>
        <li>{error}</li>
    );

    return (

        <div className="bounds course--detail">
            <h1>Create Course</h1>
            <div>
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
            <form>
                <div className="grid-66">
                <div className="course--header">
                    <h4 className="course--label">Course</h4>
                    <div>
                        <input id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..." onChange = {this.handleChange} />
                    </div>
                    <p>By Joe Smith</p>
                </div>
                <div className="course--description">
                    <div><textarea id="description" name="description" className="" placeholder="Course description..." onChange = {this.handleChange}></textarea></div>
                </div>
                </div>
                <div className="grid-25 grid-right">
                <div className="course--stats">
                    <ul className="course--stats--list">
                    <li className="course--stats--list--item">
                        <h4>Estimated Time</h4>
                        <div><input id="estimatedTime" name="estimatedTime" type="text" className="course--time--input"
                            placeholder="Hours" onChange = {this.handleChange}></input></div>
                    </li>
                    <li className="course--stats--list--item">
                        <h4>Materials Needed</h4>
                        <div><textarea id="materialsNeeded" name="materialsNeeded" className="" placeholder="List materials..." onChange = {this.handleChange}></textarea></div>
                    </li>
                    </ul>
                </div>
                </div>
                <div className="grid-100 pad-bottom">
                    <button className="button" type="submit" onClick={this.handleCreate}>Create Course</button>
                    <button className="button button-secondary" onClick={this.handleCancel}>Cancel</button>
                </div>
            </form>
            </div>
        </div>
      
    );
  }


}