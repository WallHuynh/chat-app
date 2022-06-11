import { Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../firebase/config'
import { getDocument } from '../firebase/services'

export const AuthContext = React.createContext()

export default function AuthProvider({ children }) {
  const [user, setUser] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscibed = auth.onAuthStateChanged(user => {
      console.log('user', user)
      if (user) {
        const { uid, photoURL, displayName, email } = user
        const userRef = getDocument('users', uid)
        const fetchData = async () => {
          const userInfo = await userRef
          setUser({
            uid,
            photoURL,
            displayName,
            email,
            userInfo,
          })
        }
        fetchData()
        setIsLoading(false)
        navigate('/')
        return
      }
      setUser({})
      setIsLoading(false)
      navigate('/login')
    })
    return () => {
      unsubscibed()
    }
  }, [navigate])

  return (
    <AuthContext.Provider value={{ user }}>
      {isLoading ? (
        <Spin size='large' style={{ position: 'fixed', inset: '50vh' }} />
      ) : (
        children
      )}
    </AuthContext.Provider>
  )
}
