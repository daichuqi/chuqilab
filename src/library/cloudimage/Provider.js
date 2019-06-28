import React, { Component } from 'react'
import _ from 'lodash'

export const CloudimageContext = React.createContext()

class CloudimageProvider extends Component {
  constructor({ config = {} }) {
    super()

    const {
      token = '',
      container = 'cloudimg.io',
      ultraFast = false,
      lazyLoading = true,
      imgLoadingAnimation = true,
      lazyLoadOffset = 100,
      width = '400',
      height = '300',
      operation = 'width',
      filters = 'foil1',
      placeholderBackground = '#f4f4f4',
      baseUrl = '/',
      presets,
      queryString = '',
    } = config

    this.state = {
      token,
      container,
      ultraFast,
      lazyLoading,
      imgLoadingAnimation,
      lazyLoadOffset,
      width,
      height,
      operation,
      filters,
      placeholderBackground,
      baseUrl,
      presets: presets
        ? presets
        : {
            xs: '(max-width: 575px)', // to 575       PHONE
            sm: '(min-width: 576px)', // 576 - 767    PHABLET
            md: '(min-width: 768px)', // 768 - 991    TABLET
            lg: '(min-width: 992px)', // 992 - 1199   SMALL_LAPTOP_SCREEN
            xl: '(min-width: 1200px)', // from 1200    USUALSCREEN
          },
      queryString,
      innerWidth: window.innerWidth,
      previewQualityFactor: 10,
      //isChrome: /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)
    }

    window.addEventListener('resize', this.updateDimensions)
  }

  updateDimensions = _.debounce(() => {
    const { innerWidth } = this.state

    if (innerWidth < window.innerWidth)
      this.setState({ innerWidth: window.innerWidth })
  }, 100)

  render() {
    return (
      <CloudimageContext.Provider value={{ config: this.state }}>
        {this.props.children}
      </CloudimageContext.Provider>
    )
  }
}

export default CloudimageProvider
