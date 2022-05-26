import React from "react";
import Cookies from "universal-cookie";

// Deal with authentication
const cookies = new Cookies();

// Class for the React Application
class App extends React.Component {

  // Initialize variables 
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      email: "",
      password: "",
      password2: "",
      error: "",
      isAuthenticated: false,
      signUp: false,
    };

    this.count = 0;

  }

  // Initialize sessions 
  componentDidMount = () => {
    this.getSession();
  }

  // Get if authenticated already or not 
  getSession = () => {
    fetch("/api/session/", {
      credentials: "same-origin",
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.isAuthenticated) {
        this.setState({isAuthenticated: true});
      } else {
        this.setState({isAuthenticated: false});
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }

  // Get "who am i" for authentication 
  whoami = () => {
    fetch("/api/whoami/", {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
    })
    .then((res) => res.json())
    .then((data) => {
      console.log("You are logged in as: " + data.username);
      this.setState({username: data.username});
    })
    .catch((err) => {
      console.log(err);
    });
  }

  handlePasswordChange = (event) => {
    // update password on form change 
    this.setState({password: event.target.value});
  }

  handleUserNameChange = (event) => {
    // update username information on form change 
    this.setState({username: event.target.value});
  }

  handleEmailChange = (event) => {
    // update email information on form change 
    this.setState({email: event.target.value});
  }

  handlePassword2Change = (event) => {
    // update confirm password information on input change 
    this.setState({password2: event.target.value});
  }

  updateLogin = () => {
    // Change between login and signup
    this.setState({signUp: !this.state.signUp})
  }

  isResponseOk(response) {
    // repsonse is good 
    if (response.status >= 200 && response.status <= 299) {
      return response.json();
    } else {
      throw Error(response.statusText);
    }
  }

  login = (event) => {
    // login api
    event.preventDefault();
    fetch("/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
      },
      credentials: "same-origin",
      body: JSON.stringify({username: this.state.username, password: this.state.password}),
    })
    .then(this.isResponseOk)
    .then((data) => {
      console.log(data);
      this.setState({isAuthenticated: true, username: "", password: "", error: ""});
    })
    .catch((err) => {
      console.log(err);
      this.setState({error: "Wrong username or password."});
    });

  }
  
  register = (event) => {
    // registration api
    event.preventDefault();
    fetch("/api/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
      },
      credentials: "same-origin",
      body: JSON.stringify({username: this.state.username, email: this.state.email, password1: this.state.password, password2: this.state.password2}),
    })
    .catch((err) => {
      console.log(err);
      this.setState({error: err});
    });

    // Update state 
    if (this.state.error == "") {
      this.setState({signUp: false});
    }

    this.setState({error: ""});
  }

  logout = () => {
    // Logout api
    fetch("/api/logout", {
      credentials: "same-origin",
    })
    .then(this.isResponseOk)
    .then((data) => {
      console.log(data);
      this.setState({isAuthenticated: false});
    })
    .catch((err) => {
      console.log(err);
    });

    this.count = 0;
  };


  render() {
    // check if authenticated 
    if (!this.state.isAuthenticated) {

      if (!this.state.signUp)
      {
        // Login Page 
        return (
          <div className="container mt-3">
            <h1>Boilerplate React Cookie Auth</h1>
            <br />
            <h2>Login</h2>
            <form onSubmit={this.login}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input type="text" className="form-control" id="username" name="username" value={this.state.username} onChange={this.handleUserNameChange} />
              </div>
              <div className="form-group">
                <label htmlFor="username">Password</label>
                <input type="password" className="form-control" id="password" name="password" value={this.state.password} onChange={this.handlePasswordChange} />
                <div>
                  {this.state.error &&
                    <small className="text-danger">
                      {this.state.error}
                    </small>
                  }
                </div>
              </div>
              <button type="submit" className="btn btn-primary">Login</button>
            </form>
            {/* <button type="button" className="btn btn-link" onClick={this.updateLogin}>Sign Up</button> */}
            <a className="btn-link" onClick={this.updateLogin}>Sign Up</a>
          </div>
        );
      }
      else {
        // Sign Up Page 
        return (
          <div className="container mt-3">
            <h1>Boilerplate React Cookie Auth</h1>
            <br />
            <h2>Registration</h2>
            <form onSubmit={this.register}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input type="text" className="form-control" id="username" name="username" value={this.state.username} onChange={this.handleUserNameChange} />
              </div>
              <div className="form-group">
                <label htmlFor="username">Email</label>
                <input type="text" className="form-control" id="email" name="email" value={this.state.email} onChange={this.handleEmailChange} />
              </div>
              <div className="form-group">
                <label htmlFor="username">Password</label>
                <input type="password" className="form-control" id="password" name="password" value={this.state.password} onChange={this.handlePasswordChange} />
                <div>
                  {this.state.error &&
                    <small className="text-danger">
                      {this.state.error}
                    </small>
                  }
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="username">Confirm Password</label>
                <input type="password" className="form-control" id="password2" name="password2" value={this.state.password2} onChange={this.handlePassword2Change} />
                <div>
                  {this.state.error &&
                    <small className="text-danger">
                      {this.state.error}
                    </small>
                  }
                </div>
              </div>
              <button type="submit" className="btn btn-primary">Register</button>
            </form>
            {/* <button type="button" className="btn btn-link" onClick={this.updateLogin}>Login</button> */}
            <a className="btn-link" onClick={this.updateLogin}>Login</a>
          </div>
        );
      }

    }

    // Collect user information
    if (this.count < 1) {
      this.whoami();
      this.count += 1;
    }

    return (
      // Dashboard / Main site
      <div className="container mt-3">
        <h1>React Cookie Auth</h1>
        <p>You are logged in!</p>
        <p>{`Welcome ${this.state.username}!`}</p>
        {/* <button className="btn btn-primary mr-2" onClick={this.whoami}>WhoAmI</button> */}
        <button className="btn btn-danger" onClick={this.logout}>Log out</button>
      </div>
    )
  }
}

export default App;