import React, { Component } from 'react'
import { Upload, Icon, message, Button, Radio, Avatar } from 'antd'
import Helmet from 'react-helmet'
// import photoMagician from 'photo-magician'
import Layout from '../components/Layout'
// import notme from '../assets/notme.png'
import { isMobile } from 'react-device-detect'
import classnames from 'classnames'

import '../styles/notme.scss'

const RadioButton = Radio.Button
const RadioGroup = Radio.Group
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
    url: null,
    option: 1,
    position: 'br',
  }

  onChange = e => {
    this.setState({
      option: e.target.value,
    })
  }

  onPosChange = e => {
    this.setState({
      position: e.target.value,
    })
  }

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true })
      return
    }
    if (info.file.status === 'done') {
      const { url } = info.file.response
      this.setState({ url })

      if (isMobile) {
        this.setState({ loading: false })
        return
      }

      // const magician = new photoMagician()
      // magician
      //   .addWaterMark({
      //     cover: url,
      //     mode: 'image',
      //     waterMark: notme,
      //     width: 1000,
      //     height: 1000,
      //     opacity: 0.8,
      //     coordinate: [0, 100]
      //   })
      //   .then(waterMarkImage => {
      //     this.setState({ waterMarkImage, loading: false })
      //   })
    }
  }

  render() {
    return (
      <Layout hide>
        <Helmet>
          <title>D&G's Notme | 抵制辱华品牌</title>
        </Helmet>
        <div className="image-viewer">
          <div style={{ fontSize: 40 }}>
            <strong>D</strong>
            <span>ead</span>
            <span>&</span>
            <strong>G</strong>
            <span>one</span>
          </div>

          <div style={{ marginBottom: 30 }}>(1985 ~ 2018)</div>
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
                Upload Avatar
              </Button>
            </Upload>
          </div>

          <br />

          <div className="not-me-container">
            {this.state.option === 1 && (
              <div className="not-me-text">
                <div>Not</div>
                <div>Me</div>
              </div>
            )}

            {this.state.option === 2 && (
              <div
                className={classnames('not-me-box-logo', {
                  [this.state.position]: true,
                })}>
                Not Me
              </div>
            )}

            <Avatar
              shape="square"
              src={this.state.url}
              size={310}
              icon="user"
            />
          </div>

          {/* {this.state.waterMarkImage && !isMobile && (
            <img
              crossOrigin="anonymous"
              src={this.state.waterMarkImage}
              className="new-image"
              alt="profile"
            />
          )} */}
        </div>

        <div style={{ margin: '10px 0', textAlign: 'center' }}>
          <RadioGroup onChange={this.onChange} defaultValue="1">
            <RadioButton value={1}>Text Overlay</RadioButton>
            <RadioButton value={2}>Logo Box</RadioButton>
          </RadioGroup>
        </div>

        {this.state.option === 2 && (
          <div style={{ margin: '10px 0', textAlign: 'center' }}>
            <RadioGroup onChange={this.onPosChange}>
              <RadioButton value="ur">UR</RadioButton>
              <RadioButton value="br">BR</RadioButton>
              <RadioButton value="bl">BL</RadioButton>
              <RadioButton value="ul">UL</RadioButton>
            </RadioGroup>
          </div>
        )}

        <div style={{ textAlign: 'center', fontSize: 10, marginBottom: 40 }}>
          <Icon type="github" style={{ marginRight: 10 }} />
          Created By Richie
          <a
            rel="noopener noreferrer"
            style={{ marginLeft: 5 }}
            href="https://github.com/daichuqi/chuqilab/blob/master/src/pages/notme.js"
            target="_blank">
            Source Code
          </a>
        </div>
      </Layout>
    )
  }
}
