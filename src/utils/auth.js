export const isBrowser = typeof window !== `undefined`

export const setUser = user => (window.localStorage.gatsbyUser = JSON.stringify(user))

const getUser = () => {
  if (window.localStorage.gatsbyUser) {
    let loginInfo = JSON.parse(window.localStorage.gatsbyUser)

    return loginInfo ? loginInfo.user : {}
  }
  return {}
}

export const isLoggedIn = () => {
  if (!isBrowser) return false

  const user = getUser()
  console.log('user', user)
  if (user) return !!user.username
}

export const getCurrentUser = () => isBrowser && getUser()

export const logout = callback => {
  if (!isBrowser) return
  setUser({})
  callback()
}
