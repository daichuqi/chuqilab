import { createStore as reduxCreateStore } from 'redux'
import * as actions from './actions'

const initialState = {
  show: false,
}

const reducer = (state, { type, payload }) => {
  switch (type) {
    case actions.TOGGLE_LOGIN:
      return {
        ...state,
        show: payload,
      }
    default:
      return state
  }
}

const createStore = () => reduxCreateStore(reducer, initialState)
export default createStore
