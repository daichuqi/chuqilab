import React from 'react'
import { Avatar, Menu, Dropdown } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { Link } from 'gatsby'
import { navigate } from '@reach/router'

import { logout, isLoggedIn, getCurrentUser } from '../../utils/auth'

import './Navbar.scss'
import 'antd/dist/antd.css'
import '../../styles/libs/prism-darcula.css'
import '../../styles/default.scss'
import '../../styles/style.scss'
import '../../styles/form.scss'

export default ({ overlay, hide, children }) => {
  const loggedIn = isLoggedIn()
  const currentUser = getCurrentUser()

  const sigunout = async () => {
    try {
      logout(() => navigate('/login'))
    } catch (error) {
      console.log('error', error)
    }
  }

  const menu = (
    <Menu size="large">
      <Menu.Item>
        <span className="nav-item" onClick={sigunout}>
          Logout
        </span>
      </Menu.Item>
    </Menu>
  )

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
              {loggedIn && (
                <Link className="nav-item" to="/page">
                  Blog
                </Link>
              )}

              {loggedIn && (
                <Link className="nav-item" to="/room">
                  Room
                </Link>
              )}

              {loggedIn ? (
                <span className="nav-item">
                  <Dropdown overlay={menu} placement="bottomLeft">
                    <Avatar
                      shape="square"
                      src={currentUser.profile_image}
                      icon={<UserOutlined />}
                    />
                  </Dropdown>
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
