const io = require('socket.io-client')

const URL = 'https://chengyuhan.me'
// const URL = 'localhost:3000'

export default function() {
  const socket = io.connect(URL)

  function registerHandler(onMessageReceived) {
    socket.on('message', onMessageReceived)
  }

  function unregisterHandler() {
    socket.off('message')
  }

  socket.on('error', function(err) {
    console.log('received socket error:')
    console.log(err)
  })

  function register(name, cb) {
    socket.emit('register', name, cb)
  }

  function join(chatroomName, cb) {
    socket.emit('join', chatroomName, cb)
  }

  function leave(chatroomName, cb) {
    socket.emit('leave', chatroomName, cb)
  }

  function message(chatroomName, msg, cb) {
    socket.emit('message', { chatroomName, message: msg }, cb)
  }

  function disconnect() {
    socket.disconnect()
  }

  function getChatrooms() {
    return new Promise((resolve, reject) => {
      socket.emit('chatrooms', null, (err, chatrooms) => {
        if (err) {
          reject(err)
        }
        resolve(chatrooms)
      })
    })
  }

  function getAvailableUsers(cb) {
    socket.emit('availableUsers', null, cb)
  }

  return {
    disconnect,
    register,
    join,
    leave,
    message,
    getChatrooms,
    getAvailableUsers,
    registerHandler,
    unregisterHandler,
  }
}
