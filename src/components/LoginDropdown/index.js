import React, { Component } from 'react'
import enhanceWithClickOutside from 'react-click-outside'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../state/actions'
import { FaClose } from 'react-icons/lib/fa'
import './style.scss'

class LoginDropdown extends Component {
  constructor(props) {
    super(props)
  }

  handleClickOutside() {
    this.props.toggleLogin(false)
  }

  render() {
    const background = 'https://s3-us-west-1.amazonaws.com/chuqi-gatsby/skull.jpg';
    return (
      <div className="login-dropdown">
        <div
          className="close-button"
          onClick={() => {
            this.props.toggleLogin(false)
          }}
        >
          <FaClose size={24} />
        </div>
        <div className="crop">
          <img className="background-image" src={background} />
        </div>
        <div className="login-panel">
          <input className="username" type="text" placeholder="username" />
          <input className="password" type="password" placeholder="password" />
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
