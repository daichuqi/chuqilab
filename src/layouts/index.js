import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import Header from '../components/header'
import '../styles/libs/prism-darcula.css'
import '../styles/default.scss'
import './style.scss'

import config from './config.json'

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
