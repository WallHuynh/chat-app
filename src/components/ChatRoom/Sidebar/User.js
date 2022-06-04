import { Avatar, Button, Dropdown, Menu, Tooltip, Typography } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { AppContext } from '../../../Context/AppProvider'
import { AuthContext } from '../../../Context/AuthProvider'
import {
  LogoutOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { auth } from '../../../firebase/config'

const DivStyled = styled.div`
  display: flex;
  height: 70px;
  padding: 14px 16px;
  border-bottom: 1px solid rgb(230, 230, 230);

  .avt-name {
    width: 80%;
    display: flex;
    .username {
      font-size: 17px;
      font-weight: 500;
      max-width: 80%;
      margin: 0 5px 0 5px;
      text-overflow: ellipsis;
      overflow-x: hidden;
      white-space: nowrap;
      align-self: center;
    }
  }
  .btns {
    width: 20%;
    display: flex;
    .addroom,
    .addfriend {
      align-self: center;
    }
  }
`
const AvatarStyled = styled(Avatar)`
.ant-avatar-string {
  font-size: 20px;
`

const DropdownStyled = styled(Dropdown)`
  text-align: center;
  cursor: pointer;
`

export default function User() {
  const {
    clearState,
    setIsAddRoomVisible,
    setIsAddFriendVisible,
    userAccountVisible,
    setUserAccountVisible,
  } = React.useContext(AppContext)

  const {
    user: { email, displayName, photoURL, uid },
  } = useContext(AuthContext)

  const handleAddRoom = () => {
    setIsAddRoomVisible(true)
  }
  const handleAddFriend = () => {
    setIsAddFriendVisible(true)
  }
  const handleUserAccountVisible = () => {
    setUserAccountVisible(true)
  }
  const menu = (
    <Menu
      items={[
        {
          label: (
            <Button
              icon={<UserOutlined />}
              type='text'
              onClick={handleUserAccountVisible}>
              User
            </Button>
          ),
          key: '0',
        },
        {
          type: 'divider',
        },
        {
          label: (
            <Button
              icon={<LogoutOutlined />}
              type='text'
              onClick={() => {
                clearState()
                auth.signOut()
              }}>
              Log Out
            </Button>
          ),
          key: '3',
        },
      ]}
    />
  )
  return (
    <DivStyled className='noselect'>
      <div className='avt-name'>
        <DropdownStyled overlay={menu} trigger={['click']}>
          <AvatarStyled src={photoURL} size='large'>
            {photoURL ? '' : displayName?.charAt(0)?.toUpperCase()}
          </AvatarStyled>
        </DropdownStyled>
        <p className='username'>{displayName}</p>
      </div>
      <div className='btns'>
        <Tooltip
          className='addfriend'
          placement='bottom'
          title='Add friend'
          color='#ff0066'>
          <Button
            type='text'
            icon={<UserAddOutlined />}
            onClick={handleAddFriend}
          />
        </Tooltip>
        <Tooltip
          className='addroom'
          placement='bottom'
          title='Create a chat room'
          color='#ff0066'>
          <Button
            type='text'
            icon={<UsergroupAddOutlined />}
            onClick={handleAddRoom}
          />
        </Tooltip>
      </div>
    </DivStyled>
  )
}
