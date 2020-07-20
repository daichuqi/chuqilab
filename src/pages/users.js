import React, { useState, useRef } from 'react'
import { Row, Col, Input, Button, Select, Upload, Slider } from 'antd'
import { Link, navigate, graphql } from 'gatsby'
import { Router } from '@reach/router'
import Img from 'gatsby-image'
import AvatarEditor from 'react-avatar-editor'
import get from 'lodash/get'

import Api from '../Api'
import Layout from '../components/Layout'
import FourOFour from './404'

import { setUser, getCurrentUser } from '../utils/auth'
const { Option } = Select

const DEFAULT_SCALE = 1.2

const UserDetails = props => {
  const currentUser = getCurrentUser() || {}

  const { userId } = props
  const editorRef = useRef()
  const [image, setImage] = useState()
  const [loading, setLoading] = useState(false)
  const [scale, setScale] = useState(DEFAULT_SCALE)

  const onClickSave = () => {
    if (editorRef) {
      // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
      // drawn on another canvas, or added to the DOM.
      // const canvas = editorRef.current.getImage()
      // console.log('canvas', canvas)
      // If you want the image resized to the canvas size (also a HTMLCanvasElement)
      const canvas = editorRef.current.getImageScaledToCanvas()
      const ctx = canvas.getContext('2d')

      ctx.canvas.toBlob(async blob => {
        const file = new File([blob], 'fileName', {
          type: 'image/jpeg',
          lastModified: Date.now(),
        })

        const fileName = image.name
        setLoading(true)
        const user = await Api.node.uploadAvatar({ file, fileName, userId })
        setUser(user)
        setLoading(false)
      })
    }
  }

  return (
    <Row gutter={[16, 16]}>
      <Col flex="200px">
        <AvatarEditor
          ref={editorRef}
          image={
            image ||
            currentUser.profile_image_url ||
            'https://chuqi-gatsby.s3-us-west-1.amazonaws.com/default-avatar.png'
          }
          border={50}
          color={[255, 255, 255, 0.6]} // RGBA
          scale={scale}
          rotate={0}
        />

        <Slider
          style={{ width: '100%' }}
          defaultValue={DEFAULT_SCALE}
          max={5}
          min={1}
          onChange={setScale}
          step={0.1}
          disabled={!image}
        />

        <Upload
          customRequest={request => {
            setImage(request.file)
          }}
          showUploadList={false}
          onChange={info => {
            if (info.file.status === 'done') {
              // info.file.originFileObj
              console.log('info', info)
              setImage(info.file.originFileObj)
            }
          }}
        >
          <Button>Upload</Button>
        </Upload>

        <Button type="primary" loading={loading} disabled={!image} onClick={onClickSave}>
          Save
        </Button>
      </Col>
    </Row>
  )
}

export default function Profile(props) {
  return (
    <Layout>
      <Router>
        <FourOFour path="/users" />
        <UserDetails path="/users/:userId" />
      </Router>
    </Layout>
  )
}
