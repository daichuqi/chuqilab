import React, { useState } from 'react'
import { Link } from 'gatsby'
import { Form, Input, Button } from 'antd'
import { navigate } from '@reach/router'
import { Auth } from 'aws-amplify'

import { setUser, isLoggedIn } from '../utils/auth'
import Error from '../components/Error'
import Layout from '../components/Layout'

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
}

export default function Login() {
  if (isLoggedIn()) {
    navigate('/page')
  }

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

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  return (
    <Layout>
      {error && <Error errorMessage={error} />}
      <Form
        {...layout}
        name="basic"
        onFinish={login}
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
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <div style={{ textAlign: 'center' }}>
          <Button loading={loading} type="primary" htmlType="submit">
            Sign In
          </Button>
          <Link to="/signup">Sign Up</Link>
        </div>
      </Form>
    </Layout>
  )
}
