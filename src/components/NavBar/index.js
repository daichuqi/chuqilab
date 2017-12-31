import React from 'react'
import Link from 'gatsby-link'
import Login from '../Login'
import './style.scss'

const NavBar = () => (
  <div className="nav-component pattern">
    <div className="wrapper">
      <div className="site-name">
        <Link className="site-name-text" to="/">
          CQ
        </Link>
      </div>
      <Login />
      <Link className="nav-item" to="/about">
        About
      </Link>
    </div>
  </div>
)

export default NavBar
