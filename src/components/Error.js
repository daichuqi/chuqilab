//https://github.com/wesbos/dump
import React from 'react'

const Error = props => (
  <div>
    {Object.entries(props).map(([err, val]) => (
      <pre err={err} key={err}>
        <strong>{err}: </strong>
        {JSON.stringify(val, '', ' ')}
      </pre>
    ))}
  </div>
)

export default Error
