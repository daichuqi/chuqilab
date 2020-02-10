import React, { useState } from 'react'
import { Form, Input, Button } from 'antd'
import { navigate } from 'gatsby'
import { Auth } from 'aws-amplify'

import Layout from '../components/Layout'
import Error from '../components/Error'

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
}

export default function SignUp() {
  const [stage, setStage] = useState(0)
  const [error, setError] = useState('')
  const [username, setUsername] = useState('')

  const onSignup = async ({ username, password, email, phone_number }) => {
    try {
      await Auth.signUp({
        username,
        password,
        attributes: { email, phone_number },
      })
      setUsername(username)
      setStage(1)
    } catch (err) {
      setError(err)
    }
  }

  const confirmSignUp = async ({ authCode }) => {
    try {
      await Auth.confirmSignUp(username, authCode)
      navigate('/login')
    } catch (err) {
      setError(err)
    }
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  return (
    <Layout>
      {error && <Error errorMessage={error} />}
      {stage === 0 && (
        <Form
          {...layout}
          name="basic"
          onFinish={onSignup}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Email"
            placeholder="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phone"
            placeholder="Phone Number"
            name="phone_number"
            rules={[{ required: true, message: 'Please input Phone number!' }]}
          >
            <Input />
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Button type="primary" htmlType="submit">
              Sign up
            </Button>
          </div>
        </Form>
      )}

      {stage === 1 && (
        <Form
          {...layout}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={confirmSignUp}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="AuthCode"
            name="authCode"
            placeholder="Authorization Code"
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Confirm Sign Up
            </Button>
          </Form.Item>
        </Form>
      )}
    </Layout>
  )
}
