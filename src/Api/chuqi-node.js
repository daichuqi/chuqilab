import Axios from 'axios'

export const signup = async ({ username, password, email }) => {
  const res = await Axios.post(`https://chuqi-node.herokuapp.com/api/users/signup`, {
    username,
    password,
    email,
  })
  return res.data
}

export const login = async ({ username, password }) => {
  const res = await Axios.post(`https://chuqi-node.herokuapp.com/api/users/login`, {
    username,
    password,
  })
  return res.data
}
