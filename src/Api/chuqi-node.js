import Axios from 'axios'

const isDev = false

const PROD_URL = 'https://chuqi-node.herokuapp.com'
const DEV_URL = 'http://localhost:3001'

export const signup = async ({ username, password, email }) => {
  const res = await Axios.post(`${isDev ? DEV_URL : PROD_URL}/api/users/signup`, {
    username,
    password,
    email,
  })
  return res.data
}

export const login = async ({ username, password }) => {
  const res = await Axios.post(`${isDev ? DEV_URL : PROD_URL}/api/users/login`, {
    username,
    password,
  })
  return res.data
}

export const uploadAvatar = async ({ file, fileName, userId }) => {
  const formData = new FormData()
  formData.append(fileName, file, fileName)
  const res = await Axios.post(
    `${isDev ? DEV_URL : PROD_URL}/api/users/avatar?userId=${userId}`,
    formData
  )

  return res.data
}
