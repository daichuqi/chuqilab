import React from 'react'
import { Tag } from 'antd'

export default function Tags({ tags, style }) {
  if (tags && tags.length > 0) {
    return (
      <div style={style}>
        <span style={{ marginRight: 5 }}>Tags: </span>
        {tags.map(tag => (
          <Tag key={tag} color="magenta">
            {tag}
          </Tag>
        ))}
      </div>
    )
  }
  return <div />
}
