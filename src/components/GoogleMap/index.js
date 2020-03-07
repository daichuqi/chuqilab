import React from 'react'
import GoogleMapReact from 'google-map-react'

// import MapStyles from './map-style.json'
import MapStylesWhite from './map-style-white.json'
import './style.scss'

const GOOGLE_MAP_API = 'AIzaSyBrUFUbL2fJBsKBjDrdwSepNPpF9t6OZmA'

export default function GoogleMap(props) {
  const createMapOptions = maps => ({
    panControl: false,
    mapTypeControl: false,
    scrollwheel: false,
    styles: MapStylesWhite,
  })

  return (
    <div id="GoogleMap" className="google-map-component">
      <GoogleMapReact
        options={createMapOptions}
        bootstrapURLKeys={{ key: GOOGLE_MAP_API }}
        defaultCenter={props.center}
        defaultZoom={props.zoom}
      >
        <div lat={props.center.lat} lng={props.center.lng}>
          <img
            alt="my-apt"
            style={{
              transform: 'translate(-50%, -50%)',
            }}
            src="https://s3.amazonaws.com/sneakpeeq-sites/jacklinks/images/marker.png"
          />
        </div>
      </GoogleMapReact>
    </div>
  )
}
