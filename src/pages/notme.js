import React, { Component } from 'react'
import { Upload, Icon, message, Button } from 'antd'
import photoMagician from 'photo-magician'
import notme from '../assets/notme.png'
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
    waterMarkImage: null
  }
  onImageUpload = image => {
    this.setState({
      image
    })
  }

  onComplete = image => {
    console.log(image)
  }

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true })
      return
    }
    if (info.file.status === 'done') {
      const { url } = info.file.response
      const magician = new photoMagician()
      magician
        .addWaterMark({
          cover: url,
          mode: 'image',
          waterMark: notme,
          width: 1000,
          height: 1000,
          opacity: 0.8,
          coordinate: [0, 0]
        })
        .then(waterMarkImage => {
          this.setState({ waterMarkImage, loading: false })
        })
    }
  }

  render() {
    return (
      <div className="image-viewer">
        <Upload
          name="avatar"
          className="avatar-uploader"
          showUploadList={false}
          action="https://polar-cove-32492.herokuapp.com/image"
          beforeUpload={beforeUpload}
          onChange={this.handleChange}>
          <Button type="primary" size="large">
            <Icon type={this.state.loading ? 'loading' : 'upload'} />
            上传头像
          </Button>
        </Upload>
        {this.state.waterMarkImage && (
          <img
            src={this.state.waterMarkImage}
            className="new-image"
            alt="profile"
          />
        )}
      </div>
    )
  }
}
