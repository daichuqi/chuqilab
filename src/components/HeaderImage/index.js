import React from 'react'
import ProgressiveImage from 'react-progressive-image'
// import BrowserDetection from 'react-browser-detection'

import './style.scss'

const HeaderImage = ({ imagePosition, image, imageMin }) => (
  <div className="background-image-container">
    <img
      className={`progressive-image`}
      style={{ objectPosition: imagePosition }}
      src={image}
    />
    {/* <BrowserDetection>
      {{
        safari: () => (
          <img
            className={`progressive-image`}
            style={{ objectPosition: imagePosition }}
            src={image}
          />
        ),
        default: browser => (
          <ProgressiveImage src={image} placeholder={imageMin || image}>
            {(src, loading) => (
              <img
                className={`progressive-image ${loading ? 'loading' : ''}`}
                style={{ objectPosition: imagePosition }}
                src={src}
              />
            )}
          </ProgressiveImage>
        )
      }}
    </BrowserDetection> */}
  </div>
)

export default HeaderImage
