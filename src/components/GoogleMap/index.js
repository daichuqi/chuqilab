import React, { Component } from 'react'
import './style.scss'
// import MapStyles from './map-style.json'
import MapStylesWhite from './map-style-white.json'

class GoogleMap extends Component {
  componentWillMount() {
    if (typeof window !== 'undefined') {
      const loader = require('scriptjs');
      loader(`https://maps.googleapis.com/maps/api/js`, () => {
        this.initMap()
      })
    }
  }

  initMap() {
    const myhome = { lat: 37.38, lng: -121.99 }
    const map = new google.maps.Map(
      document && document.getElementById('GoogleMap'),
      {
        zoom: 11,
        center: myhome,
        styles: MapStylesWhite,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
      }
    )
    const marker = new google.maps.Marker({
      position: myhome,
      map,
    })
  }

  render() {
    return <div id="GoogleMap" className="google-map-component" />
  }
}

export default GoogleMap
