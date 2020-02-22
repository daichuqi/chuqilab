import React, { useEffect, useState, useRef } from 'react'
import { Button, Input, Row, Col } from 'antd'
import { Icon } from '@ant-design/compatible'
import classnames from 'classnames'

import useTwilioVideo from '../hooks/use-twilio-video'
import { getCurrentUser } from '../utils/auth'

import socket from '../socket'
import VideoDisplay from './VideoDisplay'

import './Join.scss'

const { Search } = Input

function useClient() {
  const [client, setClient] = useState(undefined)

  useEffect(() => {
    const client = socket()
    setClient(client)

    return () => {
      client.disconnect()
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

  const ROOM_NAME = 'chatroom'

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(scrollToBottom, [messages])

  useEffect(() => {
    if (client) {
      client.registerHandler(newMessage => {
        setMessages(messages => [...messages, newMessage])

        client.getAvailableUsers((_, users) => setOnlineUsers(users))
      })

      client.register(currentUser.username, hello => {
        client.join(ROOM_NAME, (_, chatHistory) => {
          setMessages(chatHistory)
          setJoined(true)
          client.getAvailableUsers((_, users) => {
            setOnlineUsers(users)
          })
        })
      })
    }
  }, [client])

  const join = async () => {
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
              {messages.map(({ message, user, event }, i) => (
                <div
                  key={i}
                  className={classnames('message', {
                    self: user.username === currentUser.username,
                  })}
                >
                  {event && (
                    <div className="event-message">
                      {user.name} {event}
                    </div>
                  )}

                  {user.username === currentUser.username
                    ? message && (
                        <>
                          <div className="message-text">{message}</div>
                          <img className="user-profile" src={user.profile_image} />
                        </>
                      )
                    : message && (
                        <>
                          <img className="user-profile" src={user.profile_image} />
                          <div className="message-text">{message}</div>
                        </>
                      )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="tool-bar">
              <div className="camera-button">
                {token ? (
                  <Button loading={loading} type="primary" onClick={leaveRoom}>
                    <Icon type="video-camera" />
                  </Button>
                ) : (
                  <Button loading={loading} onClick={join}>
                    <Icon type="video-camera" />
                  </Button>
                )}
              </div>
            </div>

            <Search
              enterButton={<span style={{ fontSize: 18 }}>Send</span>}
              disabled={!joined}
              className="message-input"
              value={inputValue}
              onSearch={onPressEnter}
              onChange={({ target }) => setInputValue(target.value)}
            />
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default Join
