import Axios from 'axios'

const BASE_URL = ' http://52.37.228.245'

export const fetchOrCreateUser = async username => {
  const res = await Axios.get(`${BASE_URL}/users/${username}`)
  return res.data
}
