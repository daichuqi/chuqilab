import React from 'react'
import Navbar from './Navbar'

import 'antd/dist/antd.css'
import '../styles/libs/prism-darcula.css'
import '../styles/default.scss'
import '../styles/responsive.scss'
import '../styles/style.scss'

class Template extends React.Component {
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
