import React, { useEffect, useState, useRef } from 'react'
import { Button, Input, Row, Col } from 'antd'
import { VideoCameraOutlined, SmileOutlined, GlobalOutlined } from '@ant-design/icons'
import classnames from 'classnames'
import moment from 'moment'
import { Picker } from 'emoji-mart'
import InnerHTML from 'dangerously-set-html-content'

import useTwilioVideo from '../hooks/useTwilioVideo'
import { getCurrentUser } from '../utils/auth'
import VideoDisplay from './VideoDisplay'
import useClient from '../hooks/useClient'

import './Room.scss'
import 'emoji-mart/css/emoji-mart.css'

const { Search } = Input
const ROOM_NAME = 'chatroom'

export default function Join() {
  const { getParticipantToken, leaveRoom, loading, token } = useTwilioVideo()
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [joined, setJoined] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const { username } = getCurrentUser()
  const client = useClient()
  const [onlineUsers, setOnlineUsers] = useState([])
  const [showPicker, setShowPicker] = useState(false)
  const [shareLocation, setShareLocation] = useState(false)

  const scrollToBottom = () => messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
  const joinVideoChannel = () => getParticipantToken({ identity: username, room: ROOM_NAME })

  useEffect(scrollToBottom, [messages])

  useEffect(() => {
    console.log('client', client)
    if (client) {
      client.registerHandler(newMessage => {
        setMessages(messages => [...messages, newMessage])
        client.getAvailableUsers(setOnlineUsers)
      })
      console.log('username', username)

      client.register(username, () => {
        console.log('username', username)
        client.join(ROOM_NAME, chatHistory => {
          setMessages(chatHistory)
          setJoined(true)
          client.getAvailableUsers(setOnlineUsers)
        })
      })
    }
  }, [client])

  const onPressEnter = () => {
    if (inputValue !== '' && inputValue !== undefined) {
      client.message(ROOM_NAME, inputValue, setInputValue)
    }
  }

  const shareMyLocation = () => {
    if (shareLocation) {
      setShareLocation(false)
    } else {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          console.log('coords', coords)
          const { latitude, longitude } = coords

          client.shareLocation(ROOM_NAME, { longitude, latitude }, users => {
            console.log('hello', users)
          })
          setShareLocation(true)
        },
        () => {},
        {
          // enableHighAccuracy: true,
          // timeout: 5000,
          // maximumAge: 0,
        }
      )
    }
  }

  return (
    <div className="join-container">
      <Row>
        {token && (
          <Col xs={24} sm={24} md={24} lg={8}>
            <VideoDisplay onlineUsers={onlineUsers} />
          </Col>
        )}

        <Col xs={24} sm={24} md={24} lg={token ? 16 : 24}>
          <div className="chat-room">
            <div className="message-container">
              <div className="online-users-container">
                {onlineUsers.map(({ profile_image }, index) => (
                  <img key={index} className="online-user" src={profile_image} />
                ))}
              </div>
              {messages.map((message, i) => (
                <div
                  key={i}
                  className={classnames('message', {
                    self: message.username === username,
                  })}
                >
                  {message.entry_type === 'event' ? (
                    <div className="event-message">
                      {message.name} {message.content}
                      <div>{moment(message.created_at).format('h:mm:ss a')}</div>
                    </div>
                  ) : message.username === username ? (
                    <>
                      <div className="message-text">
                        <InnerHTML html={message.content} />
                      </div>
                      <img className="user-profile" src={message.profile_image} />
                    </>
                  ) : (
                    <>
                      <img className="user-profile" src={message.profile_image} />
                      <div className="message-text">
                        <InnerHTML html={message.content} />
                      </div>
                    </>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </Col>

        <Col span={24}>
          <Search
            ref={inputRef}
            enterButton={<span style={{ fontSize: 18 }}>Send</span>}
            disabled={!joined}
            className="message-input"
            value={inputValue}
            onSearch={onPressEnter}
            onChange={({ target }) => setInputValue(target.value)}
          />
        </Col>
      </Row>

      <div className="tool-bar">
        <div className="camera-button">
          {token ? (
            <Button size="large" loading={loading} type="primary" onClick={leaveRoom}>
              <VideoCameraOutlined />
            </Button>
          ) : (
            <Button size="large" loading={loading} onClick={joinVideoChannel}>
              <VideoCameraOutlined />
            </Button>
          )}
        </div>

        <div className="emoji-button">
          <Button
            size="large"
            type={showPicker ? 'primary' : ''}
            onClick={() => setShowPicker(!showPicker)}
          >
            <SmileOutlined />
          </Button>
          {showPicker && (
            <Picker
              onSelect={emoji => {
                setInputValue(`${inputValue ? inputValue : ''}${emoji.native}`)
                inputRef.current.focus()
              }}
              showPreview={false}
              showSkinTones={false}
              darkMode={false}
            />
          )}
        </div>

        <div className="location-button">
          <Button size="large" type={shareLocation ? 'primary' : ''} onClick={shareMyLocation}>
            <GlobalOutlined />
          </Button>
        </div>
      </div>
    </div>
  )
}
