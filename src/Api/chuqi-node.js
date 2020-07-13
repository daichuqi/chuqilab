import Axios from 'axios'

const isDev = false

export const signup = async ({ username, password, email }) => {
  const res = await Axios.post(`/api/users/signup`, {
    username,
    password,
    email,
  })
  return res.data
}

export const login = async ({ username, password }) => {
  const res = await Axios.post(`${isDev ? 'http://localhost:3001' : ''}/api/users/login`, {
    username,
    password,
  })
  return res.data
}

export const uploadAvatar = async ({ file, fileName, userId }) => {
  const formData = new FormData()
  formData.append(fileName, file, fileName)
  const res = await Axios.post(
    `${isDev ? 'http://localhost:3001' : ''}/api/users/avatar?userId=${userId}`,
    formData
  )

  return res.data
}
