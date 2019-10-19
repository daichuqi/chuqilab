import React from 'react'
import Navbar from './Navbar'

import 'antd/dist/antd.css'
import '../../styles/libs/prism-darcula.css'
import '../../styles/default.scss'
import '../../styles/style.scss'
import '../../styles/birthday.scss'

export default ({ overlay, hide, children }) => (
  <>
    {!hide && <Navbar overlay={overlay} />}
    {children}
  </>
)
