import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import Helmet from 'react-helmet'
// import 'prismjs/themes/prism-twilight.css'
import '../styles/libs/prism-darcula.css'
import '../styles/default.scss'
import './style.scss'

import config from './config.json'

const Header = () => (
  <div className="top-banner">
    <div className="wrapper">
      <h1>
        <Link className="site-name" to="/">
          Richie's Blog
        </Link>
      </h1>
    </div>
  </div>
)

const TemplateWrapper = ({ children }) => (
  <div>
    <Helmet title="Chuqi's Lab" meta={config.meta} />
    <Header />
    <div className="template-wrapper">{children()}</div>
  </div>
)

TemplateWrapper.propTypes = {
  children: PropTypes.func,
}

export default TemplateWrapper
