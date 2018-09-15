import React, { Component } from 'react'
import '../styles/about.scss'
import GoogleMap from '../components/GoogleMap'

export default class About extends Component {
  render() {
    return (
      <div className="about-page">
        <GoogleMap />
      </div>
    )
  }
}
