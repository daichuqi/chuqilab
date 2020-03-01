import React from 'react'
import { AppleFilled } from '@ant-design/icons'
import Helmet from 'react-helmet'
import { graphql, useStaticQuery } from 'gatsby'
import Img from 'gatsby-image'

import Layout from '../components/Layout'
import '../styles/home.scss'

export default () => {
  const profileImg = useStaticQuery(graphql`
    query MyQuery {
      file(name: { eq: "profile_img" }) {
        childImageSharp {
          fluid {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `)

  return (
    <Layout>
      <Helmet title="Home | Chuqi" />
      <div className="home-container">
        <div className="main">
          <div className="left-section">
            <div className="about">About</div>
            <div className="text">Richie is a dreamer.</div>
            <div className="text">
              He is currently working for
              <span style={{ margin: '0 5px' }}>
                <AppleFilled />
              </span>
              in Sunnyvale CA.
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
            <Img fluid={profileImg.file.childImageSharp.fluid} alt="me" size="200" />
          </div>
        </div>
      </div>
    </Layout>
  )
}
