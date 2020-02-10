import React, { useState } from 'react'
import { Form, Input, Button } from 'antd'
import { Link, navigate } from 'gatsby'
import { Auth } from 'aws-amplify'

import Layout from '../components/Layout'
import Error from '../components/Error'
import { setUser } from '../utils/auth'

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
}

export default function Login() {
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
          <Button
            style={{ width: 200 }}
            loading={loading}
            type="primary"
            htmlType="submit"
          >
            Login
          </Button>

          <div>
            <Link to="/signup">Sign up</Link>
          </div>
        </div>
      </Form>
    </Layout>
  )
}
