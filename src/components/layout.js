import React, { Component } from 'react'
import Navbar from './Navbar'

import 'antd/dist/antd.css'
import '../styles/libs/prism-darcula.css'
import '../styles/default.scss'
import '../styles/responsive.scss'
import '../styles/style.scss'
import '../styles/birthday.scss'

export default class Layout extends Component {
  render() {
    return (
      <div>
        {!this.props.hide && <Navbar />}
        {this.props.children}
      </div>
    )
  }
}
