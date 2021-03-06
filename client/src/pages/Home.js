import React, { Component } from "react";
import {TextLabel, InputBox, Radio} from "../components/inputs";
import {ModalButton, FormButton} from "../components/buttons";
import API from "../utils/index";
import TopBar from "../components/topbar";
import "./landing.css";
import { toast } from 'react-toastify';


const styles = {
  text: {
    color: "black"
  },
  role: {
    display: "inline",
    color: "black",
    paddingLeft: 6
  },
  radio: {
    float: "left",
  }
}

// Defines the messages to the user
const PasswordMatch = ({ name }) => <div> {name}</div>
const IncompleteForm = ({ name }) => <div> {name}</div>
const UsernameUnavailable = ({name}) => <div> {name}</div>
const Success = ({name}) => <div> {name}</div>
const Denied = ({name}) => <div> {name}</div>
 
class Home extends Component {
  state = {
    name: "",
    password: "",
    password_confirmation: "",
    roleSignUp: "",
    roleLogin: ""
  };

  // Handles Input change for form - updates state
  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  // Calls "signUp" request function
  createUser = event => {
    event.preventDefault();
    API.Users.signUp({
      name: this.state.name,
      password: this.state.password,
      role: this.state.roleSignUp
    })
    .then(toast (<Success name="You've signed up please login!"/>))
    .catch(err => console.log(err));

    this.setState({
      name: "",
      password: "",
      roleSignUp: ""
    });
  };

  // Handles form control and alerts user
  handleSignUp = event => {
    event.preventDefault();
    if(this.state.name && this.state.password){
      if(this.state.password === this.state.password_confirmation){
        API.Users.checkAvail(this.state.name)
        .then(res => res.data.length > 0 ? toast(<UsernameUnavailable name="Sorry, that username is taken."/>)
        : this.createUser(event))
        .catch(err => console.log(err));
      }
      else {
        toast(<PasswordMatch name="Sorry, your passwords do not match."/>);
      }
    }
    else {
      toast(<IncompleteForm name="Please complete all fields to sign up."/>);
    }
  };
  
  // Calls "login" request function
  handleLogin = event => {
    event.preventDefault();
    if (this.state.name && this.state.password) {
      API.Users.login({
        name: this.state.name,
        password: this.state.password,
        role: this.state.roleLogin
      })
        .then(res => {
          if (res.data.role === "venue") {
            this.props.history.push("/venue/profile/" + res.data.id);
          } else if (res.data.role === "artist") {
            this.props.history.push("/artist/profile/" + res.data.id);
          }
        })
        .catch(err => toast(<Denied name="Please check your credentials and try again."/>));
    }

    this.setState({
      name: "",
      password: "",
      roleLogin: ""
    });
  };

  // Renders page
  render(){
    return (
    <div className="bodyClass">
    {/* Navbar */}
      <TopBar>
          <ModalButton className={"log-in"} 
          dataEventTarget={"#login-modal"}
          label={"Log In"}
          />
          
          <ModalButton className={"sign-up"} 
          dataEventTarget={"#form-modal"}
          label={"Sign Up"}/>
      </TopBar>


    {/* Login Modal */}
    <div className="modal fade" id="login-modal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" style={styles.text}>Log In</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
              <TextLabel style={styles.text}>Username</TextLabel>
              <InputBox 
              placeholder="Username"
              name="name" 
              value={this.state.name}
              onChange={this.handleInputChange}/>
              <TextLabel style={styles.text}>Password</TextLabel>
              <InputBox 
              placeholder="Password" 
              name="password"
              type="password"
              value={this.state.password}
              onChange={this.handleInputChange}
              />

              <TextLabel style={styles.text}>Are you a Venue or Artist?</TextLabel>
              <Radio value="venue" name="roleLogin" checked={this.state.roleLogin === "venue"} onChange={this.handleInputChange} style={styles.radio}/><p style={styles.role}> Venue</p>
              <Radio value="artist" name="roleLogin" checked={this.state.roleLogin === "artist"} onChange={this.handleInputChange} style={styles.radio}/><p style={styles.role}> Artist</p>
            
          </div>
          <div className="modal-footer">
            <FormButton 
              id={"login-submit"} 
              value={"Submit"} 
              className={"log-in"}
              label={"Log In"}
              onClick={this.handleLogin}
              dataDismiss="modal"
              />  
          </div>
        </div>
      </div>
    </div>


      {/* SignUp Modal */}
    <div className="modal fade" id="form-modal" tabIndex="-1" role="dialog" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" style={styles.text}>Sign Up</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <TextLabel style={styles.text}>Username</TextLabel>
            <InputBox 
              placeholder="Username"
              name="name" 
              value={this.state.name}
              onChange={this.handleInputChange}
            />
            <TextLabel style={styles.text}>Password</TextLabel>
            <InputBox 
              placeholder="Password" 
              name="password"
              type="password"
              value={this.state.password}
              onChange={this.handleInputChange}
            />
            <TextLabel style={styles.text}>Confirm Password</TextLabel>
            <InputBox 
              placeholder="Confirm Password" 
              name="password_confirmation"
              type="password"
              value={this.state.password_confirmation}
              onChange={this.handleInputChange}
            />

            <TextLabel style={styles.text}>Are you a Venue or Artist?</TextLabel>
            <Radio value="venue" name="roleSignUp" checked={this.state.roleSignUp === "venue"} onChange={this.handleInputChange} style={styles.radio}/><p style={styles.role}>Venue</p>
            <Radio value="artist" name="roleSignUp" checked={this.state.roleSignUp === "artist"} onChange={this.handleInputChange} style={styles.radio}/><p style={styles.role}>Artist</p>
          </div>
      
          <div className="modal-footer">
            <FormButton 
              id={"signup-submit"} 
              type={"submit"} 
              value={"Submit"}
              className={"sign-up-main"} 
              label={"Sign Up"}
              onClick={this.handleSignUp}
              dataDismiss="modal"
            /> 
          </div>
        </div>
      </div>
    </div>

      {/* Text and button in center of page */}
      <div className="container">
          <div className="row">
              <div id="main" className="col-12">
                  <h1>Find Talent.</h1>
                  <h1>Find Shows.</h1>
                  <p id="text-desc">The easiest way for bands and venues to stay booked.</p>
                  <ModalButton className={"sign-up-main"} 
                    dataEventTarget={"#form-modal"}
                    label={"Sign Up"}
                  />
              </div>
          </div>
      </div>

      {/* Footer */}
      <footer>
          <div id="footer-text">
              &copy; Copyright 2019
          </div>
      </footer>
    
    </div>
    );
  }
}

export default Home;