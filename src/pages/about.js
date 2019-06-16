import React, { Component } from 'react'
import GoogleMap from '../components/GoogleMap'
import Layout from '../components/Layout'
export default class About extends Component {
  render() {
    return (
      <Layout>
        <div className="about-page">
          <GoogleMap />
        </div>
      </Layout>
    )
  }
}
