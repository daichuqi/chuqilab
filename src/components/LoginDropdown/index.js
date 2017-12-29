import React, { Component } from 'react'
import enhanceWithClickOutside from 'react-click-outside'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../state/actions'
import './style.scss'

class LoginDropdown extends Component {
  constructor(props) {
    super(props)
  }

  handleClickOutside() {
    this.props.toggleLogin(false)
  }

  render() {
    return <div className="login-dropdown">hi</div>
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
