import React from 'react'
import { Button } from 'antd'

import Layout from '../components/Layout'
import GoogleMap from '../components/GoogleMap'

const defaultProps = {
  center: {
    lat: 37.3875665,
    lng: -121.99419,
  },
  zoom: 11,
}

export default () => (
  <Layout>
    <Button
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          success => {
            console.log('success', success)
          },
          () => {},
          {}
        )
      }}
    >
      click
    </Button>

    <GoogleMap {...defaultProps} />
  </Layout>
)
