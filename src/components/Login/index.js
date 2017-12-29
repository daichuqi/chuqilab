import React, { Component } from 'react'
import { FaUser } from 'react-icons/lib/fa'
import './style.scss'

class Login extends Component {
  render() {
    return (
      <div className="login-button">
        <FaUser className="user-icon" />
        <span>Login</span>
      </div>
    )
  }
}

export default Login
