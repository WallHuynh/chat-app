import { Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../firebase/config'

export const AuthContext = React.createContext()

export default function AuthProvider({ children }) {
  const [user, setUser] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscibed = auth.onAuthStateChanged(user => {
      if (user) {
        const { uid, photoURL, displayName, email } = user
        setUser({
          uid,
          photoURL,
          displayName,
          email,
        })

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
      <Spin
        spinning={isLoading}
        size='large'
        style={{
          position: 'fixed',
          inset: '47%',
        }}
      />
      {!isLoading && children}
    </AuthContext.Provider>
  )
}
