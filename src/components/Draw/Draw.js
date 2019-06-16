import React, { Component } from 'react'
import './index.scss'

let deg = 0 // 转盘旋转角度
let prizeIndex = 0 //获取的奖品
//设置奖品，ratio为概率
let data = [
  { label: 'A Kiss', ratio: 0 },
  { label: 'IPhone XS', ratio: 0 },
  { label: 'Amazon $10', ratio: 0 },
  { label: 'Watch Series 4', ratio: 1 },
  { label: 'Movie Ticket', ratio: 0 },
  { label: '谢谢参与', ratio: 0 },
]

export default class Draw extends Component {
  constructor(props) {
    super(props)
    deg = 0
    prizeIndex = 0
  }

  componentDidMount() {
    // 奖品数量
    let num = data.length

    let rotateDeg = 360 / num / 2 + 90 // 扇形回转角度
    let html = [] //奖项
    let turnNum = 1 / num // 文字旋转 turn 值

    // 获取绘图上下文
    let ctx = this.canvas.getContext('2d')
    for (let i = 0; i < num; i++) {
      // 保存当前状态
      ctx.save()
      // 开始一条新路径
      ctx.beginPath()
      // 位移到圆心，下面需要围绕圆心旋转
      ctx.translate(150, 150)
      // 从(0, 0)坐标开始定义一条新的子路径
      ctx.moveTo(0, 0)
      // 旋转弧度,需将角度转换为弧度,使用 degrees * Math.PI/180 公式进行计算。
      ctx.rotate((((360 / num) * i - rotateDeg) * Math.PI) / 180)
      // 绘制圆弧
      ctx.arc(0, 0, 150, 0, (2 * Math.PI) / num, false)
      // 颜色间隔
      if (i % 2 === 0) {
        ctx.fillStyle = '#ff274d'
      } else {
        ctx.fillStyle = '#ff647f'
      }
      // 填充扇形
      ctx.fill()
      // 绘制边框
      ctx.lineWidth = 0.5
      ctx.strokeStyle = 'white'
      ctx.stroke()
      // 恢复前一个状态
      ctx.restore()

      // 奖项列表
      html.push(
        '<li><span style="transform: rotate(' +
          i * turnNum +
          'turn)">' +
          data[i].label +
          '</span></li>'
      )
      if (i + 1 === num) {
        this.prizeUL.innerHTML = html.join('')
      }
    }
    // 旋转事件-结束
    this.container.addEventListener(
      'transitionend',
      this.transitionEnd.bind(this)
    )
  }

  componentWillUnmount() {
    this.container.removeEventListener(
      'transitionend',
      this.transitionEnd.bind(this)
    )
  }

  /* 转盘旋转结束 */
  transitionEnd() {
    this.props.done()
    // this.label.innerHTML = data[prizeIndex].label
  }

  /* 点击抽奖 */
  onClick() {
    let num = data.length
    prizeIndex = this.calculateRatio() //Math.random() * num >>> 0;    // 奖品index
    deg = deg + (360 - (deg % 360)) + (360 * 10 - prizeIndex * (360 / num)) // 转盘旋转到奖品所需角度
    this.container.style.transform = 'rotate(' + deg + 'deg)'
  }

  /* 根据概率计算奖品index */
  calculateRatio() {
    let totalRatio = 0 //总概率
    data.forEach(item => {
      totalRatio += item.ratio
    })

    let temp = []
    data.forEach((item, index) => {
      for (let i = 0; i < Math.round((item.ratio / totalRatio) * 100); i++) {
        temp.push(index)
      }
    })
    //乱序
    temp.sort(() => (Math.random() > 0.5 ? -1 : 1))

    let index = (Math.random() * temp.length) >>> 0
    return temp[index]
  }

  render() {
    return (
      <div className="lottery-container">
        <div className="lottery-box">
          <div className="lottery-box-c" ref={ref => (this.container = ref)}>
            <canvas
              ref={ref => (this.canvas = ref)}
              width="300"
              height="300"
              className="lottery-canvas"
            />
            <ul ref={ref => (this.prizeUL = ref)} />
          </div>
          <div className="lottery-btn" onClick={this.onClick.bind(this)}>
            GO
          </div>
        </div>
        <div style={{ margin: 20 }}>
          <span ref={ref => (this.label = ref)} />
        </div>
      </div>
    )
  }
}
