import React from 'react'
import Layout from '../components/Layout'
import { Router } from '@reach/router'

import Join from '../components/Join'
import VideoDisplay from '../components/VideoDisplay'

export default () => {
  return (
    <Layout>
      <Router basepath="/room">
        <Join path="/" />
        <VideoDisplay path="/:roomID" />
      </Router>
    </Layout>
  )
}
