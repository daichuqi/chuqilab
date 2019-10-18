import React, { Component } from 'react'

import Baroque from '../projects/baroque/js'
import Layout from '../components/Layout'

export default class Hanhan extends Component {
  render() {
    return (
      <Layout overlay>
        <Baroque />
      </Layout>
    )
  }
}
