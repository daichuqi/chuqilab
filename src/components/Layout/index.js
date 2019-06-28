import React, { Component } from 'react'
import Navbar from './Navbar'

import { CloudimageProvider } from '../../library/cloudimage'

import 'antd/dist/antd.css'
import '../../styles/libs/prism-darcula.css'
import '../../styles/default.scss'
import '../../styles/style.scss'
import '../../styles/birthday.scss'

const cloudimageConfig = {
  token: 'arflvvvqen',
  baseUrl: 'https://www.daichuqi.com',
  lazyLoading: false,
}

export default class Layout extends Component {
  render() {
    return (
      <CloudimageProvider config={cloudimageConfig}>
        {!this.props.hide && <Navbar overlay={this.props.overlay} />}
        {this.props.children}
      </CloudimageProvider>
    )
  }
}
