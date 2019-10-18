import React, { Component } from 'react'
import { Icon } from 'antd'
import Helmet from 'react-helmet'

import Img from '../library/cloudimage'
import profileImage from '../assets/profile-image.jpg'
import '../styles/home.scss'

import Layout from '../components/Layout'

export default class Home extends Component {
  render() {
    return (
      <Layout location={this.props.location}>
        <Helmet title="Home | Chuqi" />
        <div className="home-container">
          <div className="main">
            <div className="left-section">
              <div className="about">About</div>
              <div className="text">
                Richie is a dreamer living in Zürich, Switzerland
                <span role="img" aria-label="flag">
                  🇨🇭
                </span>
              </div>
              <div className="text">
                He is currently work for <Icon type="apple" theme="filled" /> in
                SPG.
                <br />
                LOVE design, art and tech.
              </div>
              <br />
              <div className="text">
                <div className="contact">Contact</div>
                <div>daichuqi@gmail.com</div>
              </div>
            </div>
            <div className="right-section">
              <Img src={profileImage} alt="me" size="200" />
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}
