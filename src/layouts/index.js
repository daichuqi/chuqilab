import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactTransitionGroup from 'react-addons-css-transition-group'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

import NavBar from '../components/NavBar'

import '../styles/libs/prism-darcula.css'
import '../styles/default.scss'
import './style.scss'
import '../styles/responsive.scss'

import config from './config.json'

class TemplateWrapper extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div>
        {this.props.show && <div className="dark-overlay" />}
        <Helmet title="CQ" meta={config.meta} />
        <NavBar />
        <div>{this.props.children()}</div>
        <ReactTransitionGroup
          style={{ postion: 'absolute' }}
          transitionEnterTimeout={150}
          transitionLeaveTimeout={100}
          transitionName="login"
        />
      </div>
    )
  }
}

TemplateWrapper.propTypes = {
  children: PropTypes.func
}

const mapStateToProps = ({ show }) => {
  return { show }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TemplateWrapper)

// export const pageQuery = graphql`
//   query IndexQuery {
//     resolution: imageSharp(id: { regex: "/skull.jpg/" }) {
//       resolutions(width: 600) {
//         src
//       }
//     }
//   }
// `
