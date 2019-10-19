import React, { Component } from 'react'
import Helmet from 'react-helmet'
import { Button } from 'antd'
import get from 'lodash/get'
import { graphql, navigate } from 'gatsby'
import { Keys } from 'react-keydown'

import Countdown from '../components/Countdown'
import NextPrevButtons from '../components/NextPrevButtons'
import HeaderImage from '../components/HeaderImage/'
import TagsLabel from '../components/Tags/TagsLabel'
import Layout from '../components/Layout'

import ReactAudioPlayer from 'react-audio-player'

import './blog-post.scss'

const { LEFT, RIGHT } = Keys

export default class BlogPostTemplate extends Component {
  state = {
    playing: false,
    duration: 0,
    musicReady: false,
  }

  componentWillMount = () => {
    document.addEventListener('keydown', this.handleKeydown)
  }

  componentWillUnmount = () => {
    clearInterval(this.intervalHandle)
    document.removeEventListener('keydown', this.handleKeydown)
  }

  startCountdown = () => {
    this.intervalHandle = setInterval(() => {
      const duration = this.state.duration - 1
      this.setState({ duration })

      if (duration === 0) {
        clearInterval(this.intervalHandle)
      }
    }, 1000)
  }

  handleKeydown = ({ keyCode }) => {
    const { prev, next } = this.props.pageContext

    if (prev && keyCode === LEFT) {
      navigate(`/blog/${prev.slug}`)
    }
    if (next && keyCode === RIGHT) {
      navigate(`/blog/${next.slug}`)
    }
  }

  onVideoButtonClick = () => {
    if (!this.state.playing) {
      this.rap.audioEl.play()
      this.startCountdown()
      this.setState({ playing: true })
    } else {
      clearInterval(this.intervalHandle)
      this.rap.audioEl.pause()
      this.setState({ playing: false })
    }
  }

  render() {
    const post = get(this.props, 'data.contentfulBlogPost')
    const { prev, next } = this.props.pageContext
    const { title, heroImage, publishDate, body, tags, music } = post
    const { playing, duration, musicReady } = this.state

    return (
      <Layout onKeydown={this.keydownHandler}>
        <Helmet title={`${title} | Chuqi `} />
        <HeaderImage sizes={heroImage.sizes}>
          {music && (
            <div className="player-control">
              <Countdown duration={duration}></Countdown>
              <Button
                size="large"
                shape="circle"
                icon={playing ? 'pause' : 'caret-right'}
                disabled={!musicReady}
                onClick={() => {
                  console.log('this.props', this.props)
                  this.onVideoButtonClick()
                }}
              />

              <ReactAudioPlayer
                onEnded={() => {
                  this.setState({
                    duration: this.rap.audioEl.duration,
                    playing: false,
                  })
                  clearInterval(this.intervalHandle)
                }}
                onCanPlay={() => {
                  this.setState({
                    musicReady: true,
                    duration: this.rap.audioEl.duration,
                  })
                }}
                ref={element => (this.rap = element)}
                src={`https:${music.file.url}`}
              />
            </div>
          )}
        </HeaderImage>

        <div className="blog-post-page template-wrapper">
          <div className="blog-detail-header">
            <div className="title">{title}</div>
            <div className="date">{publishDate}</div>

            <div
              className="blog-content"
              dangerouslySetInnerHTML={{
                __html: body.childMarkdownRemark.html,
              }}
            />
          </div>
          <TagsLabel tags={tags} style={{ marginTop: 30 }} />
          <NextPrevButtons prev={prev} next={next} />
        </div>
      </Layout>
    )
  }
}

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    contentfulBlogPost(slug: { eq: $slug }) {
      title
      excerpt
      slug
      tags
      place
      music {
        title
        file {
          url
        }
      }
      publishDate(formatString: "MMMM Do, YYYY")
      heroImage {
        sizes(maxWidth: 1180, background: "rgb:000000") {
          ...GatsbyContentfulSizes_withWebp
        }
      }
      body {
        childMarkdownRemark {
          html
        }
      }
    }
  }
`
