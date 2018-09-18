import React, { Component } from 'react'
import GoogleMap from '../components/GoogleMap'
import '../styles/about.scss'

export default class About extends Component {
  render() {
    return (
      <div className="about-page">
        <GoogleMap />
      </div>
    )
  }
}
