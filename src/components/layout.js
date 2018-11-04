import React, { Component } from 'react'
import Navbar from './Navbar'

import 'antd/dist/antd.css'
import '../styles/libs/prism-darcula.css'
import '../styles/default.scss'
import '../styles/responsive.scss'
import '../styles/style.scss'
import '../styles/birthday.scss'

class Template extends Component {
  render() {
    const { children } = this.props
    return (
      <div>
        <Navbar />
        {children}
      </div>
    )
  }
}

export default Template
