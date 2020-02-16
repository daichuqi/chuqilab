import React from 'react'
import Layout from '../components/Layout'
import { Router } from '@reach/router'

import SecretPage from '../components/SecretPage'
import VideoDisplay from '../components/VideoDisplay'

export default () => {
  return (
    <Layout>
      <Router basepath="/room">
        <SecretPage path="/" />
        <VideoDisplay path="/:roomID" />
      </Router>
    </Layout>
  )
}
