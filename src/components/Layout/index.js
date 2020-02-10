import React from 'react'
import { Link } from 'gatsby'
import { Auth } from 'aws-amplify'
import { navigate } from '@reach/router'

import { logout, isLoggedIn } from '../../utils/auth'

import './Navbar.scss'
import 'antd/dist/antd.css'
import '../../styles/libs/prism-darcula.css'
import '../../styles/default.scss'
import '../../styles/style.scss'

export default ({ overlay, hide, children }) => {
  const sigunout = async () => {
    try {
      await Auth.signOut()
      logout(() => navigate('/login'))
    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    <div style={{ height: '100vh' }}>
      {!hide && (
        <div className={`nav-component pattern ${overlay ? 'overlay' : ''}`}>
          <div className="wrapper">
            <div className="site-name">
              <Link className="site-name-text" to="/">
                CHUQI
              </Link>
            </div>

            <div className="nav-items">
              {isLoggedIn() && (
                <Link className="nav-item" to="/page">
                  Blog
                </Link>
              )}

              {isLoggedIn() ? (
                <span className="nav-item" onClick={sigunout}>
                  Sign Out
                </span>
              ) : (
                <Link className="nav-item" to="/login">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
      {children}
    </div>
  )
}
