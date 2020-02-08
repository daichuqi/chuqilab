import React from 'react'
import { Link } from 'gatsby'

import './Navbar.scss'
import 'antd/dist/antd.css'
import '../../styles/libs/prism-darcula.css'
import '../../styles/default.scss'
import '../../styles/style.scss'

export default ({ overlay, hide, children }) => (
  <div>
    {!hide && (
      <div className={`nav-component pattern ${overlay ? 'overlay' : ''}`}>
        <div className="wrapper">
          <div className="site-name">
            <Link className="site-name-text" to="/">
              CHUQI
            </Link>
          </div>
          <Link className="nav-item" to="/page">
            Blog
          </Link>
        </div>
      </div>
    )}
    {children}
  </div>
)
