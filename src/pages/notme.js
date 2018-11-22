import React, { Component } from 'react'
import { Upload, Icon, message, Button } from 'antd'
import photoMagician from 'photo-magician'
import Layout from '../components/layout'
import notme from '../assets/notme.png'
import Helmet from 'react-helmet'
import { isMobile } from 'react-device-detect'
import '../styles/notme.scss'

function beforeUpload(file) {
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!')
  }
  return isLt2M
}

export default class Notme extends Component {
  state = {
    image: null,
    waterMarkImage: null,
    url: null
  }

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true })
      return
    }
    if (info.file.status === 'done') {
      const { url } = info.file.response
      this.setState({ url })

      const magician = new photoMagician()
      magician
        .addWaterMark({
          cover: url,
          mode: 'image',
          waterMark: notme,
          width: 1000,
          height: 1000,
          opacity: 0.8,
          coordinate: [0, 100]
        })
        .then(waterMarkImage => {
          this.setState({ waterMarkImage, loading: false })
        })
    }
  }

  render() {
    return (
      <Layout hide>
        <Helmet>
          <link
            href="http://allfont.net/allfont.css?fonts=pragmatica"
            rel="stylesheet"
            type="text/css"
          />
        </Helmet>
        <div className="image-viewer">
          <div style={{ fontSize: 40 }}>
            <strong>D</strong>
            <span role="img" aria-label="shit">
              💩
            </span>
            <strong>G</strong>
          </div>

          <div style={{ marginBottom: 20 }}>(1985 ~ 2018)</div>
          <div>
            <Upload
              name="avatar"
              className="avatar-uploader"
              showUploadList={false}
              action="https://polar-cove-32492.herokuapp.com/image"
              beforeUpload={beforeUpload}
              onChange={this.handleChange}>
              <Button type="primary" size="large">
                <Icon type={this.state.loading ? 'loading' : 'upload'} />
                NOT ME!
              </Button>
            </Upload>
          </div>
          <br />

          {this.state.url && isMobile && (
            <div className="not-me-container">
              <div className="not-me-text">
                <div>Not</div>
                <div>Me</div>
              </div>
              <img
                crossOrigin="anonymous"
                src={this.state.url}
                className="new-image"
                alt="profile"
              />
            </div>
          )}

          {this.state.waterMarkImage && !isMobile && (
            <img
              crossOrigin="anonymous"
              src={this.state.waterMarkImage}
              className="new-image"
              alt="profile"
            />
          )}
        </div>
      </Layout>
    )
  }
}
