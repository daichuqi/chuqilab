import Axios from 'axios'

export const fetchTodos = () => {
  return Axios.get('/.netlify/functions/todos-read-all')
}

export const fetchUser = async username => {
  const res = await Axios.get(`/.netlify/functions/todos-read/${username}`)
  return res.data
}

// http://52.37.228.245/users/daichuqi
