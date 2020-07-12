import Axios from 'axios'

const BASE_URL = 'https://chuqi-node.herokuapp.com'

export const signup = async ({ username, password, email }) => {
  const res = await Axios.post(`${BASE_URL}/users/signup`, {
    username,
    password,
    email,
  })
  return res.data
}

export const login = async ({ username, password }) => {
  const res = await Axios.post(`${BASE_URL}/users/login`, {
    username,
    password,
  })
  return res.data
}
