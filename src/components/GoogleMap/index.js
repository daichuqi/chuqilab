import React, { Component } from 'react'

// import MapStyles from './map-style.json'
import MapStylesWhite from './map-style-white.json'
import './style.scss'

const GOOGLE_MAP_API = 'AIzaSyBrUFUbL2fJBsKBjDrdwSepNPpF9t6OZmA'
const GOOGLE_MAP_URL = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API}`

export default class GoogleMap extends Component {
  UNSAFE_componentWillMount() {
    if (typeof window !== 'undefined') {
      const loader = require('scriptjs')
      loader(GOOGLE_MAP_URL, () => this.initMap())
    }
  }

  initMap() {
    const myhome = { lat: 37.3875665, lng: -121.99419 }
    const map = new window.google.maps.Map(
      document && document.getElementById('GoogleMap'),
      {
        zoom: 11,
        center: myhome,
        styles: MapStylesWhite,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false
      }
    )
    new window.google.maps.Marker({
      position: myhome,
      icon:
        'https://s3.amazonaws.com/sneakpeeq-sites/jacklinks/images/marker.png',
      map
    })
  }

  render() {
    return <div id="GoogleMap" className="google-map-component" />
  }
}
