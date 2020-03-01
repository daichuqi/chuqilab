import React from 'react'
import { Link } from 'gatsby'
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons'

export default function NextPrevButton({ next, prev }) {
  return (
    <div style={{ margin: '10px 0 30px', padding: 1 }}>
      {prev && (
        <Link to={`/blog/${prev.slug}`} style={{ float: 'left' }}>
          <CaretLeftOutlined /> {prev.title}
        </Link>
      )}
      {next && (
        <Link to={`/blog/${next.slug}`} style={{ float: 'right' }}>
          {next.title} <CaretRightOutlined />
        </Link>
      )}
    </div>
  )
}
