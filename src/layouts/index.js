import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import Helmet from 'react-helmet'

import '../styles/default.css'
import './style.css'

import config from './config.json'

const Header = () => (
  <div className="top-banner">
    <div className="wrapper">
      <h1 style={{ margin: 0 }}>
        <Link className="site-name" to="/"> Chuqi </Link>
      </h1>
    </div>
  </div>
)

const TemplateWrapper = ({ children }) => (
  <div>
    <Helmet title="Chuqi's Lab" meta={config.meta}/>
    <Header />
    <div className="template-wrapper">
      {children()}
    </div>
  </div>
)

TemplateWrapper.propTypes = {
  children: PropTypes.func,
}

export default TemplateWrapper
