import React from 'react'
import Link from 'gatsby-link'
import Login from '../Login'
import './style.scss'

const Header = () => (
  <div className="header-component">
    <div className="wrapper">
      <div className="site-name">
        <Link className="site-name-text" to="/">
          CQ
        </Link>
      </div>
      <Login />
    </div>
  </div>
)

export default Header
