import React from 'react'

export default function Error(props) {
  return (
    <div>
      {Object.entries(props).map(([err, val]) => (
        <pre err={err} key={err}>
          <strong>{err}: </strong>
          {JSON.stringify(val, '', ' ')}
        </pre>
      ))}
    </div>
  )
}
