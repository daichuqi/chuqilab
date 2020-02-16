import React, { useReducer } from 'react'
// import { Provider } from 'react-redux'
// const store = createStore()
// import createStore from './src/state/createStore'

import { TwilioVideoContext } from './src/hooks/use-twilio-video'

const initialContext = {
  identity: false,
  room: false,
  token: false,
  activeRoom: false,
}

const reducer = (store, action) => {
  switch (action.type) {
    case 'join':
      return {
        ...store,
        token: action.token,
        room: action.room,
        identity: action.identity,
      }

    case 'set-active-room':
      return {
        ...store,
        activeRoom: action.activeRoom,
      }

    case 'disconnect':
      store.activeRoom && store.activeRoom.disconnect()
      return initialContext

    default:
      console.error(`Unknown action type: ${action.type}`)
      return store
  }
}

export const TwilioVideoProvider = ({ children }) => (
  <TwilioVideoContext.Provider value={useReducer(reducer, initialContext)}>
    {children}
  </TwilioVideoContext.Provider>
)

export const wrapWithProvider = ({ element }) => (
  <TwilioVideoProvider>{element}</TwilioVideoProvider>
)

// export default ({ element }) => <Provider store={store}>{element}</Provider>
