import React, { useEffect, useState, useRef } from 'react'
import { Button, Input, Row, Col } from 'antd'
import { Icon } from '@ant-design/compatible'
import classnames from 'classnames'
import moment from 'moment'

import useTwilioVideo from '../hooks/use-twilio-video'
import { getCurrentUser } from '../utils/auth'

import socket from '../socket'
import VideoDisplay from './VideoDisplay'

import './Room.scss'

const { Search } = Input
const ROOM_NAME = 'chatroom'

function useClient() {
  const [client, setClient] = useState(undefined)

  useEffect(() => {
    const client = socket()
    setClient(client)

    return () => {
      client.leave(ROOM_NAME, () => client.disconnect())
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
  const currentUser = getCurrentUser()
  const client = useClient()
  const [onlineUsers, setOnlineUsers] = useState([])

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(scrollToBottom, [messages])

  useEffect(() => {
    if (client) {
      client.registerHandler(newMessage => {
        console.log('newMessage', newMessage)
        setMessages(messages => [...messages, newMessage])
        client.getAvailableUsers(setOnlineUsers)
      })

      client.register(currentUser.username, () => {
        client.join(ROOM_NAME, chatHistory => {
          setMessages(chatHistory)
          setJoined(true)
          client.getAvailableUsers(setOnlineUsers)
        })
      })
    }
  }, [client])

  const joinVideoChannel = () => {
    getParticipantToken({ identity: currentUser.username, room: ROOM_NAME })
  }

  const onPressEnter = () => {
    if (inputValue !== '' && inputValue !== undefined) {
      client.message(ROOM_NAME, inputValue, () => {
        setInputValue(undefined)
      })
    }
  }

  return (
    <div className="join-container">
      <Row>
        {token && (
          <Col xs={24} sm={12} md={10} lg={8}>
            <VideoDisplay />
          </Col>
        )}

        <Col xs={24} sm={token ? 12 : 24} md={token ? 14 : 24} lg={token ? 16 : 24}>
          <div className="chat-room">
            <div className="message-container">
              <div className="online-users-container">
                {onlineUsers.map(({ profile_image }, index) => (
                  <img key={index} className="online-user" src={profile_image} />
                ))}
              </div>
              {messages.map(
                ({ profile_image, username, name, content, entry_type, created_at }, i) => (
                  <div
                    key={i}
                    className={classnames('message', { self: username === currentUser.username })}
                  >
                    {entry_type === 'event' ? (
                      <div className="event-message">
                        {name} {content}
                        <div>{moment(created_at).format('h:mm:ss a')}</div>
                      </div>
                    ) : username === currentUser.username ? (
                      <>
                        <div className="message-text">{content}</div>
                        <img className="user-profile" src={profile_image} />
                      </>
                    ) : (
                      <>
                        <img className="user-profile" src={profile_image} />
                        <div className="message-text">{content}</div>
                      </>
                    )}
                  </div>
                )
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </Col>
        <Col span={24}>
          <Search
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
      </div>
    </div>
  )
}

export default Join
