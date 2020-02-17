import Axios from 'axios'

const BASE_URL = 'https://chengyuhan.me/api'

export const fetchOrCreateUser = async username => {
  const res = await Axios.get(`${BASE_URL}/users/${username}`)
  return res.data
}
