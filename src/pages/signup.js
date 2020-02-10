import React, { useState } from 'react'
import { Form, Input, Button, Select } from 'antd'
import { navigate } from 'gatsby'
import { Auth } from 'aws-amplify'

import Layout from '../components/Layout'
import Error from '../components/Error'

const { Option } = Select

export default function SignUp() {
  const [stage, setStage] = useState(0)
  const [error, setError] = useState('')
  const [username, setUsername] = useState('')
  const [form] = Form.useForm()

  const onSignup = async ({
    username,
    password,
    email,
    phone_number,
    prefix,
  }) => {
    try {
      await Auth.signUp({
        username,
        password,
        attributes: { email, phone_number: `+${prefix}${phone_number}` },
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

  const onFinishFailed = ({ errorFields }) => {
    form.scrollToField(errorFields[0].name)
  }

  return (
    <Layout>
      {error && <Error errorMessage={error} />}
      <div
        style={{
          fontSize: 28,
          width: '100%',
          maxWidth: 260,
          margin: '100px auto 20px',
        }}
      >
        Signup
      </div>

      {stage === 0 && (
        <Form
          onFinish={onSignup}
          onFinishFailed={onFinishFailed}
          style={{
            textAlign: 'center',
            margin: '0px auto 0px',
            width: '100%',
            maxWidth: 260,
          }}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please enter your username!' }]}
          >
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { min: 6, message: 'Length must greater than or equal to 6' },
              { required: true, message: 'Please input your password!' },
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Password" />
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
                  return Promise.reject(
                    'The two passwords that you entered do not match!'
                  )
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm Password" />
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
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="phone_number"
            rules={[{ required: true, message: 'Please enter Phone number!' }]}
          >
            <Input
              maxLength={11}
              placeholder="Phone Number"
              addonBefore={
                <Form.Item name="prefix" noStyle>
                  <Select style={{ width: 70 }} defaultValue="1">
                    <Option value="1">+1</Option>
                    <Option value="86">+86</Option>
                  </Select>
                </Form.Item>
              }
              style={{ width: '100%' }}
            />
          </Form.Item>

          <div style={{ textAlign: 'center', width: '100%' }}>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Sign up
            </Button>
          </div>
        </Form>
      )}

      {stage === 1 && (
        <Form onFinish={confirmSignUp} onFinishFailed={onFinishFailed}>
          <Form.Item name="authCode">
            <Input placeholder="Authorization Code" />
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
