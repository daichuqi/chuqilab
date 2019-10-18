import React from 'react'
import { Link } from 'gatsby'
import { Icon } from 'antd'

const NextPrevButton = ({ next, prev }) => {
  let nextButton, prevButton

  if (prev) {
    prevButton = (
      <Link to={`blog/${prev.slug}`} style={{ float: 'left' }}>
        <Icon type="caret-left" /> {prev.title}
      </Link>
    )
  }
  if (next) {
    nextButton = (
      <Link to={`blog/${next.slug}`} style={{ float: 'right' }}>
        {next.title} <Icon type="caret-right" />
      </Link>
    )
  }
  return (
    <div style={{ margin: '10px 0 30px', padding: 1 }}>
      {prevButton}
      {nextButton}
    </div>
  )
}

export default NextPrevButton
