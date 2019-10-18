import React from 'react'

import Img from 'gatsby-image'
import './style.scss'

const HeaderImage = ({ sizes, children }) => (
  <div className="HeaderImage">
    <div className="background-image-container">
      {sizes ? <Img className="progressive-image" sizes={sizes} /> : null}
    </div>
    {children}
  </div>
)

export default HeaderImage
