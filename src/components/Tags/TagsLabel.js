import React from 'react'
import { Tag } from 'antd'

const TagsLabel = props => {
  if (props.tags.length > 0) {
    return (
      <div style={props.style}>
        <span style={{ marginRight: 5 }}>Tags: </span>
        {props.tags.map(tag => (
          <Tag
            key={tag}
            className="dark-tag"
            style={{
              color: '#f1f1f1',
              background: '#555',
              borderColor: '#7f7f7f'
            }}>
            {tag}
          </Tag>
        ))}
      </div>
    )
  }
  return <div />
}

export default TagsLabel
