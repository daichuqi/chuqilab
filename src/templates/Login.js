import React, { useState } from 'react'
import { Form, Input, Button } from 'antd'
import { Link, navigate, graphql } from 'gatsby'
import Img from 'gatsby-image'
import get from 'lodash/get'

import Layout from '../components/Layout'
import Error from '../components/Error'
import Api from '../Api'
import { setUser } from '../utils/auth'

export default function Login(props) {
  const asset = get(props, 'data.contentfulAsset')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const login = async ({ username, password }) => {
    try {
      setLoading(true)
      const loginInfo = await Api.node.login({ username, password })

      console.log('loginInfo', loginInfo)

      setUser(loginInfo)
      navigate('/')
    } catch (err) {
      console.log('err', err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const onFinishFailed = ({ errorFields }) => {
    form.scrollToField(errorFields[0].name)
  }

  return (
    <Layout>
      <Img
        fadeIn
        className="progressive-image"
        sizes={asset.sizes}
        imgStyle={{ objectPosition: 'center left' }}
      />
      <div className="form-wrapper">
        {error && <Error errorMessage={error} />}

        <div className="form-title">Welcome</div>
        <Form
          name="basic"
          onFinish={login}
          style={{ textAlign: 'center', padding: 20 }}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input size="large" style={{ width: '100%' }} placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password size="large" style={{ width: '100%' }} placeholder="Password" />
          </Form.Item>

          <div>
            <Button
              size="large"
              style={{ width: '100%' }}
              loading={loading}
              type="primary"
              htmlType="submit"
            >
              {loading ? 'Loading...' : 'Login'}
            </Button>

            <div style={{ marginTop: 10 }}>
              <Link to="/signup">Sign up</Link>
            </div>
          </div>
        </Form>
      </div>
    </Layout>
  )
}

export const pageQuery = graphql`
  query LoginImageQuery($imageTitle: String!) {
    contentfulAsset(title: { eq: $imageTitle }) {
      title
      sizes(maxWidth: 1180, background: "rgb:000000") {
        ...GatsbyContentfulSizes_withWebp
      }
    }
  }
`
