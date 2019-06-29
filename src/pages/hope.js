import React, { Component } from 'react'
import { Button, Modal } from 'antd'

import hope from '../assets/hope.jpg'
import airpod from '../assets/airpod.png'
import dance from '../assets/dance.gif'

const text = ['点我', '再点我', '再来一次', '用力一点~', '再用力一点....']
export default class Hope extends Component {
  state = {
    n: 0,
  }
  render() {
    return (
      <div
        style={{
          backgroundColor: 'black',
          height: '100vh',
          border: '30px solid #ff2c2c',
        }}
      >
        <div
          style={{
            textAlign: 'center',
          }}
        >
          <img
            style={{
              width: 400,
              height: 400,
              filter: 'contrast(100)',
            }}
            src={hope}
            alt="hope"
          ></img>

          <div
            style={{
              fontSize: 50,
            }}
          >
            🎊
          </div>
        </div>

        <div
          style={{
            marginTop: 30,
            fontSize: 24,
            textAlign: 'center',
            color: '#ccc',
          }}
        >
          <div>恭喜程小晗同学成功晋级D2</div>
          <div>特此表扬!</div>

          <Button
            type="primary"
            onClick={() => {
              if (this.state.n === 4) {
                this.setState({ loading: true })
                setTimeout(() => {
                  Modal.success({
                    className: 'airpod-modal',
                    title: 'AirPod特别定制版',
                    okText: 'I Love it!',
                    onOk: () => {
                      Modal.success({
                        className: 'airpod-modal',
                        title: '',
                        okText: <span>LOL</span>,
                        onOk: () => {},
                        content: (
                          <div>
                            <img
                              style={{
                                width: '100%',
                              }}
                              src={dance}
                            ></img>
                          </div>
                        ),
                      })
                    },
                    content: (
                      <div>
                        <img src={airpod}></img>
                      </div>
                    ),
                  })

                  this.setState({ loading: false, n: 0 })
                }, 1000)
              }
              this.setState({ n: this.state.n + 1 })
            }}
            loading={this.state.loading}
            size="large"
            style={{
              marginTop: 40,
              transition: 'all 200ms',
            }}
          >
            {text[this.state.n]}
          </Button>
        </div>
      </div>
    )
  }
}
