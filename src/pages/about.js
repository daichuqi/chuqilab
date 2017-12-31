import React, { Component } from 'react';
import Link from 'gatsby-link'
import '../styles/about.scss'
import GoogleMap from '../components/GoogleMap'

const AnyReactComponent = ({ text }) => <div>{text}</div>;
class About extends Component {
  render() {
    return (
      <div className="about-page">
        <GoogleMap></GoogleMap>
      </div>
    );
  }
}

export default About

