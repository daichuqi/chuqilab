import React from 'react'
import ImageEditor from '@toast-ui/react-image-editor'
import Image from '../../assets/me.jpg'

import 'tui-image-editor/dist/tui-image-editor.css'

export default function ImageEditorIndex() {
  console.log('Image', Image)
  const myTheme = {}
  return (
    <ImageEditor
      includeUI={{
        loadImage: {
          path: '../assets/me.jpg',
          name: 'SampleImage',
        },
        theme: myTheme,
        menu: ['shape', 'filter'],
        initMenu: 'filter',
        uiSize: {
          width: '1000px',
          height: '700px',
        },
        menuBarPosition: 'bottom',
      }}
      cssMaxHeight={500}
      cssMaxWidth={700}
      selectionStyle={{
        cornerSize: 20,
        rotatingPointOffset: 70,
      }}
      usageStatistics={true}
    />
  )
}
