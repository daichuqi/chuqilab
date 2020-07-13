import React from 'react'
import { Alert } from 'antd'

export default function Error(props) {
  return (
    <div>
      <Alert
        closable
        message="Login Failed"
        description={Object.entries(props).map(([err, val]) => (
          <pre err={err} key={err}>
            <strong>{err}: </strong>
            {JSON.stringify(val, '', ' ')}
          </pre>
        ))}
        type="error"
        showIcon
      />
    </div>
  )
}
