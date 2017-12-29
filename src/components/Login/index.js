import React, { Component } from 'react'
import { FaUser } from 'react-icons/lib/fa'
import LoginDropdown from './LoginDropdown'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../state/actions';
import './style.scss'

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ ...actions }, dispatch)
}

@connect(null, mapDispatchToProps)
class Login extends Component {
  constructor(props) {
    super(props)
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick() {
    this.props.toggleLogin(true);
  }

  render() {
    return (
      <div onClick={this.handleOnClick} className="login-button">
        <FaUser className="user-icon" />
        <span>Login</span>
      </div>
    )
  }
}

export default Login
