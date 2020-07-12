import React, { useState } from 'react'
import { Form, Input, Button, Select } from 'antd'
import { Link, navigate, graphql } from 'gatsby'
import Img from 'gatsby-image'
import get from 'lodash/get'

import Api from '../Api'
import Layout from '../components/Layout'
import Error from '../components/Error'

const { Option } = Select

export default function SignUp(props) {
  const asset = get(props, 'data.contentfulAsset')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const onSignup = async ({ username, password, email, phone_number, prefix }) => {
    try {
      setLoading(true)
      await Api.node.signup({ username, password, email })
      navigate('/login')
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const onFinishFailed = ({ errorFields }) => {
    form.scrollToField(errorFields[0].name)
  }

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="1">+1</Option>
        <Option value="86">+86</Option>
      </Select>
    </Form.Item>
  )

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
        <div className="form-title">Signup</div>

        <Form
          onFinish={onSignup}
          onFinishFailed={onFinishFailed}
          style={{ textAlign: 'center', padding: 20 }}
          initialValues={{ prefix: '1' }}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please enter your username!' }]}
          >
            <Input size="large" style={{ width: '100%' }} placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { min: 8, message: 'Length must greater than or equal to 8' },
              { required: true, message: 'Please input your password!' },
            ]}
            hasFeedback
          >
            <Input.Password size="large" style={{ width: '100%' }} placeholder="Password" />
          </Form.Item>

          <Form.Item
            name="confirm"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject('The two passwords that you entered do not match!')
                },
              }),
            ]}
          >
            <Input.Password size="large" style={{ width: '100%' }} placeholder="Confirm Password" />
          </Form.Item>

          <Form.Item
            hasFeedback
            name="email"
            rules={[
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              { required: true, message: 'Please enter your email!' },
            ]}
          >
            <Input size="large" style={{ width: '100%' }} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="phone_number"
            rules={[{ required: true, message: 'Please enter Phone number!' }]}
          >
            <Input
              size="large"
              maxLength={11}
              placeholder="Phone Number"
              addonBefore={prefixSelector}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <div style={{ textAlign: 'center', width: '100%' }}>
            <Button
              loading={loading}
              size="large"
              type="primary"
              htmlType="submit"
              style={{ width: '100%' }}
            >
              Sign up
            </Button>
          </div>

          <div style={{ marginTop: 10 }}>
            <Link to="/login">Login</Link>
          </div>
        </Form>
      </div>
    </Layout>
  )
}

export const pageQuery = graphql`
  query SignupImageQuery($imageTitle: String!) {
    contentfulAsset(title: { eq: $imageTitle }) {
      title
      sizes(maxWidth: 1180, background: "rgb:000000") {
        ...GatsbyContentfulSizes_withWebp
      }
    }
  }
`
