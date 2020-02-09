import React from 'react'
import { Icon } from '@ant-design/compatible'

import Helmet from 'react-helmet'
import Img from 'gatsby-image'
import { graphql, useStaticQuery } from 'gatsby'
import Amplify from 'aws-amplify'

import Layout from '../components/Layout'
import '../styles/home.scss'
import { getCurrentUser } from '../utils/auth'

Amplify.configure({
  aws_project_region: 'us-west-2',
  aws_cognito_identity_pool_id:
    'us-west-2:5e98bf19-2dc9-4e8e-9a8e-5fe81f326e29',
  aws_cognito_region: 'us-west-2',
  aws_user_pools_id: 'us-west-2_wZAbsHVp5',
  aws_user_pools_web_client_id: '30g872mgto7qqk7mrjvvmkrgt8',
})

export default () => {
  const user = getCurrentUser()

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
            <div className="text">
              Richie is a dreamer living in Zürich, Switzerland
              <span role="img" aria-label="flag">
                🇨🇭
              </span>
            </div>
            <div className="text">
              He is currently work for <Icon type="apple" /> in SPG.
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
            <Img
              fluid={profileImg.file.childImageSharp.fluid}
              alt="me"
              size="200"
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}
