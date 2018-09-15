import { createStore as reduxCreateStore } from 'redux'
import * as actions from './actions'

const initialState = {
  show: false
}

const reducer = (state, action) => {
  const { type, payload } = action
  switch (type) {
    case actions.TOGGLE_LOGIN:
      return {
        ...state,
        show: payload
      }
    default:
      return state
  }
}

const createStore = () => reduxCreateStore(reducer, initialState)
export default createStore
