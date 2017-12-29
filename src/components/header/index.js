import React from 'react'
import Link from 'gatsby-link'

const Header = () => (
  <div className="top-banner">
    <div className="wrapper">
      <h1>
        <Link className="site-name" to="/">
          Richie's Blog
        </Link>
      </h1>
    </div>
  </div>
)

export default Header;
