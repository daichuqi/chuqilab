import React, { Component } from 'react'
import Navbar from './Navbar'

import 'antd/dist/antd.css'
import '../../styles/libs/prism-darcula.css'
import '../../styles/default.scss'
import '../../styles/style.scss'
import '../../styles/birthday.scss'

export default class Layout extends Component {
  render() {
    return (
      <>
        {!this.props.hide && <Navbar overlay={this.props.overlay} />}
        {this.props.children}
      </>
    )
  }
}
