import React from 'react'
import Layout from '../components/Layout'
import { Router } from '@reach/router'

import SecretPage from '../components/SecretPage'

export default () => {
  return (
    <Layout>
      <Router basepath="/app">
        <SecretPage path="/" />
      </Router>
    </Layout>
  )
}
