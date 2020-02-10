import React, { useState } from 'react'
import { Form, Input, Button, Row, Col } from 'antd'
import { Link, navigate, graphql } from 'gatsby'
import { Auth } from 'aws-amplify'
import Img from 'gatsby-image'
import get from 'lodash/get'

import Layout from '../components/Layout'
import Error from '../components/Error'
import { setUser } from '../utils/auth'

export default function Login(props) {
  const asset = get(props, 'data.contentfulAsset')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const login = async ({ username, password }) => {
    try {
      setLoading(true)
      await Auth.signIn(username, password)
      const user = await Auth.currentAuthenticatedUser()
      const userInfo = {
        ...user.attributes,
        username: user.username,
      }
      setUser(userInfo)
      navigate('/')
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <Row style={{ height: 'calc(100% - 46px)' }}>
        <Col xs={24} sm={12} md={8} xxl={6}>
          {error && <Error errorMessage={error} />}

          <div
            style={{
              fontSize: 28,
              width: '100%',
              maxWidth: 260,
              margin: '100px auto 0',
            }}
          >
            Welcome
          </div>
          <Form
            name="basic"
            onFinish={login}
            style={{ textAlign: 'center', padding: 20 }}
            onFinishFailed={errorInfo => {
              console.log('errorInfo', errorInfo)
            }}
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: 'Please input your username!' },
              ]}
            >
              <Input
                style={{ width: '100%', maxWidth: 260 }}
                placeholder="Username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your username!' },
              ]}
            >
              <Input.Password
                style={{ width: '100%', maxWidth: 260 }}
                placeholder="Password"
              />
            </Form.Item>

            <div>
              <Button
                style={{ width: '100%', maxWidth: 260 }}
                loading={loading}
                type="primary"
                htmlType="submit"
              >
                {loading ? 'Loading...' : 'Login'}
              </Button>

              <div>
                <Link to="/signup">Sign up</Link>
              </div>
            </div>
          </Form>
        </Col>
        <Col xs={0} sm={12} md={16} xxl={18}>
          <Img
            fadeIn
            className="progressive-image"
            sizes={asset.sizes}
            style={{ height: '100%' }}
            imgStyle={{
              objectPosition: 'center left',
            }}
          />
        </Col>
      </Row>
    </Layout>
  )
}

export const pageQuery = graphql`
  query ImageQuery($imageTitle: String!) {
    contentfulAsset(title: { eq: $imageTitle }) {
      title
      sizes(maxWidth: 1180, background: "rgb:000000") {
        ...GatsbyContentfulSizes_withWebp
      }
    }
  }
`
