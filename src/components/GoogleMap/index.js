import React, { Component } from 'react'
import GoogleMapReact from 'google-map-react'

// import MapStyles from './map-style.json'
import MapStylesWhite from './map-style-white.json'
import './style.scss'

const GOOGLE_MAP_API = 'AIzaSyBrUFUbL2fJBsKBjDrdwSepNPpF9t6OZmA'

export default class GoogleMap extends Component {
  static defaultProps = {
    center: {
      lat: 37.3875665,
      lng: -121.99419
    },
    zoom: 11
  }

  createMapOptions = maps => ({
    panControl: false,
    mapTypeControl: false,
    scrollwheel: false,
    styles: MapStylesWhite
  })

  render() {
    return (
      <div id="GoogleMap" className="google-map-component">
        <GoogleMapReact
          options={this.createMapOptions}
          bootstrapURLKeys={{ key: GOOGLE_MAP_API }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}>
          <div lat={this.props.center.lat} lng={this.props.center.lng}>
            <img
              alt="my-apt"
              style={{
                transform: 'translate(-50%, -50%)'
              }}
              src="https://s3.amazonaws.com/sneakpeeq-sites/jacklinks/images/marker.png"
            />
          </div>
        </GoogleMapReact>
      </div>
    )
  }
}
