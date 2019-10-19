import React from 'react'

const addZero = n => (n <= 9 ? `0${parseInt(n)}` : parseInt(n))

export default ({ duration = 0 }) => {
  const minute = Math.floor(duration / 60)
  const second = duration - minute * 60

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
