import React, { Component } from 'react';
//import { Link } from 'react-router-dom';
import axios from 'axios';
import Markdown from 'react-markdown';

export default class CourseDetail extends Component {

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
        this.handleDelete = this.handleDelete.bind(this);
      }

  getCoursebyId= (id)=>{
    axios.get(`http://localhost:5000/api/courses/${id}`)
    .then(response => {
      if(!response.data){
        this.props.history.push("/notfound");
      }
      this.setState({
        course:response.data
      });
    })
    .catch(error => {
      if(error.response.status ===500){
        this.props.history.push("/error");
    }
    else{
      this.props.history.push("/notfound");
    }
    });
  }

  deleteCoursebyId= async (id)=>{
    const { context } = this.props;
    await axios.delete(`http://localhost:5000/api/courses/${id}`,
    {
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
      console.log('Error deleting data', error.response.data.errors);
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
    let path = `/`;
    this.props.history.push(path);
  }

  handleUpdate(event){
    event.preventDefault();
    let path = `/courses/${this.state.course.id}/update`;
    this.props.history.push(path);
  }

  handleDelete(event){
    this.deleteCoursebyId(this.state.course.id);

  }

  render() {
      const { context } = this.props;
      let materialsList;
      if(this.state.course && this.state.course.materialsNeeded){
        materialsList = this.state.course.materialsNeeded.split("\n");
        materialsList = materialsList.map((material,index)=>
            <li key = {index}>{<Markdown escapeHtml={false} source = {material} />}</li>
        );
      }

    return (
        <div>
            <div className="actions--bar">
            <div className="bounds">
                {context.authenticatedUser && this.state.course && context.authenticatedUser.id===this.state.course.User.id
                ?
                <div className="grid-100">
                    <button className="button" onClick={this.handleUpdate}>Update Course</button>
                    <button className="button" onClick={this.handleDelete}>Delete Course</button>
                    <button className="button button-secondary" onClick={this.handleClick}>Return to List</button>
                </div>
                :
                <div className="grid-100">
                    <button className="button button-secondary" onClick={this.handleClick}>Return to List</button>
                </div>
                }
            </div>
            </div>

            <div className="bounds course--detail">
            <div className="grid-66">

                <div className="course--header">
                <h4 className="course--label">Course</h4>
                <h3 className="course--title">{this.state.course ? this.state.course.title : ""}</h3>
                <p>By {`${this.state.course? this.state.course.User.firstName : ""} ${this.state.course ? this.state.course.User.lastName : ""}`}</p>
                </div>

                <div className="course--description">
                    <Markdown escapeHtml={false} source ={this.state.course? this.state.course.description : ""} />
                </div>
            </div>

            <div className="grid-25 grid-right">
                <div className="course--stats">
                <ul className="course--stats--list">
                    <li className="course--stats--list--item">
                    <h4>Estimated Time</h4>
                    <h3>{this.state.course ? this.state.course.estimatedTime : ""}</h3>
                    </li>
                    <li className="course--stats--list--item">
                    <h4>Materials Needed</h4>
                    <ul>
                        {materialsList}
                    </ul>
                    </li>
                </ul>
                </div>
            </div>
            </div>
        </div>
      
    );
  }


}