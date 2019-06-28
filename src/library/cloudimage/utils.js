const window = window ? window : window

export const checkOnMedia = size => {
  try {
    const array = size.split(',')

    return array.length > 1
  } catch (e) {
    return false
  }
}

export const checkIfRelativeUrlPath = src => {
  if (src.indexOf('//') === 0) {
    src = window.location.protocol + src
  }
  return (
    src.indexOf('http://') !== 0 &&
    src.indexOf('https://') !== 0 &&
    src.indexOf('//') !== 0
  )
}

export const getImgSrc = (src, isRelativeUrlPath = false, baseUrl = '') => {
  if (isRelativeUrlPath) return baseUrl + src

  return src
}

export const getSizeAccordingToPixelRatio = size => {
  const splittedSizes = size.toString().split('x')
  const result = []

  ;[].forEach.call(splittedSizes, size => {
    result.push(size * Math.round(window.devicePixelRatio || 1))
  })

  return result.join('x')
}

export const generateUrl = (operation, size, filters, imgSrc, config) => {
  const { ultraFast, token, container, queryString } = config
  const isUltraFast = ultraFast ? 'https://scaleflex.ultrafast.io/' : 'https://'
  const cloudUrl = isUltraFast + token + '.' + container + '/'

  return (
    cloudUrl +
    operation +
    '/' +
    size +
    '/' +
    filters +
    '/' +
    imgSrc +
    queryString
  )
}

export const getParentWidth = (img, config) => {
  if (
    !(img && img.parentElement && img.parentElement.getBoundingClientRect) &&
    !(img && img.width)
  )
    return config.width

  const parentContainer = getParentContainerWithWidth(img)
  const currentWidth = parseInt(parentContainer, 10)
  const computedWidth = parseInt(window.getComputedStyle(img).width)

  if (
    (computedWidth && (computedWidth < currentWidth && computedWidth > 15)) ||
    !currentWidth
  ) {
    return getSizeLimit(computedWidth)
  } else {
    if (!currentWidth) return img.width || config.width

    return getSizeLimit(currentWidth)
  }
}

const getParentContainerWithWidth = img => {
  let parentNode = null
  let width = 0

  do {
    parentNode = (parentNode && parentNode.parentNode) || img.parentNode
    width = parentNode.getBoundingClientRect().width
  } while (parentNode && !width)

  const letPadding =
    width &&
    parentNode &&
    parseInt(window.getComputedStyle(parentNode).paddingLeft)
  const rightPadding = parseInt(
    window.getComputedStyle(parentNode).paddingRight
  )

  return width + (width ? -letPadding - rightPadding : 0)
}

export const generateSources = (
  operation,
  size,
  filters,
  imgSrc,
  isAdaptive,
  config,
  isPreview
) => {
  const { previewQualityFactor } = config
  const sources = []

  if (isAdaptive) {
    size.forEach(({ size: nextSize, media: mediaQuery }) => {
      if (isPreview) {
        nextSize = nextSize
          .split('x')
          .map(size => Math.floor(size / previewQualityFactor))
          .join('x')
      }

      sources.push({
        mediaQuery,
        srcSet: generateSrcset(operation, nextSize, filters, imgSrc, config),
      })
    })
  } else {
    if (isPreview) {
      size = size
        .split('x')
        .map(size => Math.floor(size / previewQualityFactor))
        .join('x')
    }

    sources.push({
      srcSet: generateSrcset(operation, size, filters, imgSrc, config),
    })
  }
  return sources
}

export const getAdaptiveSize = (size, config) => {
  const arrayOfSizes = size.split(',')
  const sizes = []

  arrayOfSizes.forEach(string => {
    const groups = string.match(/(([a-z_][a-z_]*)|(\([\S\s]*\)))\s*([0-9xp]*)/)
    const media = groups[3] ? groups[3] : config.presets[groups[2]]

    sizes.push({ media, size: groups[4] })
  })

  return sizes
}

const generateSrcset = (operation, size, filters, imgSrc, config) => {
  const imgWidth = size.toString().split('x')[0]
  const imgHeight = size.toString().split('x')[1]

  return generateImgSrc(
    operation,
    filters,
    imgSrc,
    imgWidth,
    imgHeight,
    1,
    config
  )
}

export const getRatioBySize = (size, config) => {
  let width, height

  if (typeof size === 'object') {
    const breakPointSource = getBreakPoint(size)
    let breakPointSize = breakPointSource ? breakPointSource.size : size[0].size

    width = breakPointSize.toString().split('x')[0]
    height = breakPointSize.toString().split('x')[1]
  } else {
    width = size.toString().split('x')[0]
    height = size.toString().split('x')[1]
  }

  if (width && height) return width / height

  return null
}

const getBreakPoint = size =>
  [...size].reverse().find(item => window.matchMedia(item.media).matches)

const generateImgSrc = (
  operation,
  filters,
  imgSrc,
  imgWidth,
  imgHeight,
  factor,
  config
) => {
  let imgSize = Math.trunc(imgWidth * factor)

  if (imgHeight) imgSize += 'x' + Math.trunc(imgHeight * factor)

  return generateUrl(
    operation,
    getSizeAccordingToPixelRatio(imgSize),
    filters,
    imgSrc,
    config
  )
    .replace('http://scaleflex.ultrafast.io/', '')
    .replace('https://scaleflex.ultrafast.io/', '')
    .replace('//scaleflex.ultrafast.io/', '')
    .replace('///', '/')
}

const getSizeLimit = currentSize => {
  if (currentSize <= 25) return '25'
  if (currentSize <= 50) return '50'

  return (Math.ceil(currentSize / 100) * 100).toString()
}
