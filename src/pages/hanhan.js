import React, { Component } from 'react'

import Layout from '../components/Layout'
import Baroque from '../projects/baroque/js'

export default class Hanhan extends Component {
  render() {
    return (
      <Layout overlay>
        <Baroque />
      </Layout>
    )
  }
}
