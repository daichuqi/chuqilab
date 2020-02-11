import React from 'react'
import { Link } from 'gatsby'
import Amplify, { Auth } from 'aws-amplify'
import { navigate } from '@reach/router'

import { logout, isLoggedIn } from '../../utils/auth'

import './Navbar.scss'
import 'antd/dist/antd.css'
import '../../styles/libs/prism-darcula.css'
import '../../styles/default.scss'
import '../../styles/style.scss'
import '../../styles/form.scss'

Amplify.configure({
  aws_project_region: 'us-west-2',
  aws_cognito_identity_pool_id:
    'us-west-2:5e98bf19-2dc9-4e8e-9a8e-5fe81f326e29',
  aws_cognito_region: 'us-west-2',
  aws_user_pools_id: 'us-west-2_wZAbsHVp5',
  aws_user_pools_web_client_id: '30g872mgto7qqk7mrjvvmkrgt8',
})

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
