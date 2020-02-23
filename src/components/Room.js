import React, { useEffect, useState, useRef } from 'react'
import { Button, Input, Row, Col } from 'antd'
import { Icon } from '@ant-design/compatible'
import classnames from 'classnames'
import moment from 'moment'
import { Picker } from 'emoji-mart'

import useTwilioVideo from '../hooks/use-twilio-video'
import { getCurrentUser } from '../utils/auth'

import socket from '../socket'
import VideoDisplay from './VideoDisplay'

import './Room.scss'
import 'emoji-mart/css/emoji-mart.css'

const { Search } = Input
const ROOM_NAME = 'chatroom'

function useClient() {
  const [client, setClient] = useState(undefined)

  useEffect(() => {
    const client = socket()
    const cleanUp = () => client.leave(ROOM_NAME, client.disconnect)

    setClient(client)
    window.addEventListener('beforeunload', cleanUp)

    return () => {
      cleanUp()
      window.removeEventListener('beforeunload', cleanUp)
    }
  }, [])

  return client
}

const Join = ({ location }) => {
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

  const scrollToBottom = () => messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
  const joinVideoChannel = () => getParticipantToken({ identity: username, room: ROOM_NAME })

  useEffect(scrollToBottom, [messages])

  useEffect(() => {
    if (client) {
      client.registerHandler(newMessage => {
        setMessages(messages => [...messages, newMessage])
        client.getAvailableUsers(setOnlineUsers)
      })

      client.register(username, () => {
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
                      <div className="message-text">{message.content}</div>
                      <img className="user-profile" src={message.profile_image} />
                    </>
                  ) : (
                    <>
                      <img className="user-profile" src={message.profile_image} />
                      <div className="message-text">{message.content}</div>
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
              <Icon type="video-camera" />
            </Button>
          ) : (
            <Button size="large" loading={loading} onClick={joinVideoChannel}>
              <Icon type="video-camera" />
            </Button>
          )}
        </div>

        <div className="emoji-button">
          <Button
            size="large"
            type={showPicker ? 'primary' : ''}
            onClick={() => setShowPicker(!showPicker)}
          >
            <Icon type="smile" />
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
      </div>
    </div>
  )
}

export default Join
