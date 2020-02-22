import React from 'react'
import Layout from '../components/Layout'
import { Router } from '@reach/router'

import Room from '../components/Room'

export default () => {
  return (
    <Layout>
      <Router basepath="/room">
        <Room path="/" />
      </Router>
    </Layout>
  )
}
