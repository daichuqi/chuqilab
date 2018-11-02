import React, { Component } from 'react'
import { Modal, Icon, Spin } from 'antd'
import Layout from '../components/layout'
import Draw from '../components/Draw/Draw'
import order from '../assets/order-new.png'
export default class Birthdy extends Component {
  state = {
    visible: false,
    status: 'hide'
  }

  handleOk = () => {
    this.setState({
      visible: false
    })
  }

  done = () => {
    this.setState({
      status: 'order'
    })
    setTimeout(() => {
      this.setState({
        status: 'show'
      })
    }, 20000)
  }

  render() {
    return (
      <Layout>
        <Modal
          closable
          footer={null}
          onCancel={() =>
            this.setState({
              visible: false
            })
          }
          title="Basic Modal"
          visible={this.state.visible}>
          <img src={order} />
        </Modal>

        <div className="birthday">Ivy, Happy Birthday! 🎁</div>
        <div className="subtext">请抽取你的26岁生日礼物， 只有一次机会哦!</div>
        <div className="subtext">点击完之后系统会自动记录结果,</div>
        <div className="subtext">多次点击的结果将不会被改变。</div>
        <Draw done={this.done} />

        {this.state.status === 'order' ? (
          <div className="subtext">
            <Spin
              indicator={
                <Icon
                  type="loading"
                  style={{ fontSize: 24, marginRight: 10 }}
                  spin
                />
              }
            />
            请稍等, 系统下单中....
          </div>
        ) : null}

        {this.state.status === 'show' ? (
          <div
            className="pick-up"
            onClick={() =>
              this.setState({
                visible: true
              })
            }>
            领取礼物 ❤️
          </div>
        ) : null}
      </Layout>
    )
  }
}
