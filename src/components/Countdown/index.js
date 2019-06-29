import React, { Component } from 'react'

const addZero = n => (n <= 9 ? `0${parseInt(n)}` : parseInt(n))

export default class CountDown extends Component {
  static defaultProps = {
    duration: 0,
  }

  render() {
    const minute = Math.floor(this.props.duration / 60)
    const second = this.props.duration - minute * 60

    return (
      <div
        style={{
          display: 'inline-block',
          mixBlendMode: 'darken',
          marginRight: 10,
          verticalAlign: 'bottom',
        }}
      >
        {addZero(minute)}: {addZero(second)}
      </div>
    )
  }
}
