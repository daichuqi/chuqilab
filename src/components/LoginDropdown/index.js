import React, { Component } from 'react'
import enhanceWithClickOutside from 'react-click-outside'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../state/actions'
import './style.scss'
import backgroundImage from '../../assets/images/skull.jpg'

class LoginDropdown extends Component {
  constructor(props) {
    super(props)
  }

  handleClickOutside() {
    this.props.toggleLogin(false)
  }

  render() {
    return (
    <div className="login-dropdown">
      <img className="background-image" src={backgroundImage}/>
      <div className="login-panel">
        <input className="username" type="text" placeholder="username" />
        <input className="password" type="password" placeholder="password"/>
        <button className="login-button">Login</button>
        <div className="notice">*registration by invitation only</div>
      </div>
    </div>
    )
  }
}

const mapStateToProps = ({ show }) => {
  return { show }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ ...actions }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(
  enhanceWithClickOutside(LoginDropdown)
)
