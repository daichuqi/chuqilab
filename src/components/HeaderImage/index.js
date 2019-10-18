import React from 'react'

// import Img from '../../library/cloudimage'
import Img from 'gatsby-image'
import './style.scss'

const HeaderImage = ({ sizes, children }) => (
  <div className="background-image-container">
    {sizes ? <Img className="progressive-image" sizes={sizes} /> : null}
    {children}
  </div>
)

export default HeaderImage
