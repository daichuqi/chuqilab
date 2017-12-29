import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import Header from '../components/Header'
import LoginDropdown from '../components/LoginDropdown'
import '../styles/libs/prism-darcula.css'
import '../styles/default.scss'
import '../styles/responsive.scss'
import './style.scss'

import config from './config.json'

const mapStateToProps = ({ show }) => {
  return { show }
}

const mapDispatchToProps = dispatch => {
  return {}
}

@connect(mapStateToProps, mapDispatchToProps)
class TemplateWrapper extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div>
        <Helmet title="Chuqi's Lab" meta={config.meta} />
        <Header />
        <div className="template-wrapper">{this.props.children()}</div>
        {this.props.show && <LoginDropdown />}
      </div>
    )
  }
}

TemplateWrapper.propTypes = {
  children: PropTypes.func,
}

export default TemplateWrapper
