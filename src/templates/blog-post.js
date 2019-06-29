import React, { Component } from 'react'
import Helmet from 'react-helmet'
import { Button } from 'antd'
import { graphql, navigate } from 'gatsby'
import keydown, { Keys } from 'react-keydown'
import YouTube from 'react-youtube'

import NextPrevButtons from '../components/NextPrevButtons'
import HeaderImage from '../components/HeaderImage/'
import TagsLabel from '../components/Tags/TagsLabel'
import Layout from '../components/Layout'

import '../styles/blog-post.scss'

const { LEFT, RIGHT } = Keys

class BlogPost extends Component {
  state = {
    player: null,
    playing: false,
  }

  UNSAFE_componentWillReceiveProps = ({ keydown }) => {
    if (keydown.event) {
      const { prev, next } = this.props.pageContext
      const key = keydown.event.which
      if (prev && key === LEFT) {
        const {
          fields: { slug: nextPath },
        } = prev
        navigate(nextPath)
      }

      if (next && key === RIGHT) {
        const {
          fields: { slug: prevPath },
        } = next
        navigate(prevPath)
      }
    }
  }

  onVideoButtonClick = () => {
    if (!this.state.playing) {
      this.state.player.playVideo()
      this.setState({ playing: true })
    } else {
      this.state.player.pauseVideo()
      this.setState({ playing: false })
    }
  }

  render() {
    const { prev, next } = this.props.pageContext
    const { playing, player } = this.state
    const {
      frontmatter: { title, date, image, imageMin, imagePosition, tags, ytid },
      html,
    } = this.props.data.markdownRemark

    return (
      <Layout location={this.props.location}>
        <Helmet title={`${title} | Blog`} />
        <HeaderImage
          imagePosition={imagePosition}
          image={image}
          imageMin={imageMin}
        >
          {ytid && (
            <Button
              className="player-button"
              size="large"
              shape="circle"
              disabled={!player}
              icon={playing ? 'pause' : 'caret-right'}
              onClick={() => this.onVideoButtonClick()}
            />
          )}
        </HeaderImage>

        <div className="blog-post-page template-wrapper">
          <div className="blog-detail-header">
            <div className="title">{title}</div>
            <div className="date">{date}</div>
          </div>

          {ytid && (
            <div style={{ height: 0, width: 0, overflow: 'hidden' }}>
              <YouTube
                videoId={ytid}
                onReady={event => this.setState({ player: event.target })}
              />
            </div>
          )}

          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          <TagsLabel tags={tags} style={{ marginTop: 30 }} />
          <NextPrevButtons prev={prev} next={next} />
        </div>
      </Layout>
    )
  }
}

export default keydown(LEFT, RIGHT)(BlogPost)

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        image
        imageMin
        excerpt
        imagePosition
        tags
        ytid
      }
    }
  }
`
