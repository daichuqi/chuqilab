import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactTransitionGroup from 'react-addons-css-transition-group'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

import NavBar from '../components/NavBar'
import LoginDropdown from '../components/LoginDropdown'

import '../styles/libs/prism-darcula.css'
import '../styles/default.scss'
import '../styles/responsive.scss'
import './style.scss'

import config from './config.json'

class TemplateWrapper extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div>
        <Helmet title="CQ" meta={config.meta} />
        <NavBar />
        <div className="template-wrapper">{this.props.children()}</div>
        <ReactTransitionGroup
          transitionEnterTimeout={150}
          transitionLeaveTimeout={100}
          transitionName="login">
          {this.props.show && <LoginDropdown />}
        </ReactTransitionGroup>
      </div>
    )
  }
}

TemplateWrapper.propTypes = {
  children: PropTypes.func,
}

const mapStateToProps = ({ show }) => {
  return { show }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(TemplateWrapper)
