import React from 'react'
import './style.scss'

const HeaderImage = ({ imagePosition, image, imageMin }) => (
  <div className="background-image-container">
    <img
      alt=""
      className={`progressive-image`}
      style={{ objectPosition: imagePosition }}
      src={image}
    />
  </div>
)

export default HeaderImage
