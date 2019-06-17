import React from 'react'
import { Link } from 'gatsby'

import './Navbar.scss'

const NavBar = ({ overlay }) => (
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
)

export default NavBar
