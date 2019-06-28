import React from 'react'

import Img from '../../library/cloudimage'
import './style.scss'

const HeaderImage = ({ imagePosition, image, imageMin, children }) => (
  <div className="background-image-container">
    {image ? (
      <Img
        className="progressive-image"
        style={{ objectPosition: imagePosition }}
        src={image}
      />
    ) : null}
    {children}
  </div>
)

export default HeaderImage
