import { Avatar, Button, Typography } from 'antd'
import React, { useContext } from 'react'
import styled from 'styled-components'
import { AppContext } from '../../Context/AppProvider'
import { AuthContext } from '../../Context/AuthProvider'
import { auth } from '../../firebase/config'

const DivStyled = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #b7c8db;

  .username {
    color: white;
    margin-left: 5px;
  }
`

export default function UserInfo() {
  const {
    user: { displayName, photoURL, uid },
  } = useContext(AuthContext)
  const { clearState } = useContext(AppContext)
  return (
    <DivStyled>
      <div>
        <Avatar src={photoURL}>
          {photoURL ? '' : displayName?.charAt(0)?.toUpperCase()}
        </Avatar>
        <Typography.Text className='username'>
          {displayName !== null? displayName : 'Your name'}
        </Typography.Text>
      </div>
      <Button
        ghost
        onClick={() => {
          // clear state in App Provider when logout
          clearState()
          auth.signOut()
        }}>
        Đăng xuất
      </Button>
    </DivStyled>
  )
}
