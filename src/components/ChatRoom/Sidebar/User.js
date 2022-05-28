import { Avatar, Button, Dropdown, Menu, Tooltip, Typography } from 'antd'
import React, { useContext } from 'react'
import styled from 'styled-components'
import { AppContext } from '../../../Context/AppProvider'
import { AuthContext } from '../../../Context/AuthProvider'
import { auth } from '../../../firebase/config'
import {
  LogoutOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from '@ant-design/icons'

const DivStyled = styled.div`
  display: flex;
  height: 70px;
  padding: 14px 16px;
  border-bottom: 1px solid rgb(230, 230, 230);

  .avt-name {
    width: 80%;
    display: flex;
    .username {
      max-width: 80%;
      color: white;
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

const DropdownStyled = styled(Dropdown)`
  text-align: center;
  cursor: pointer;
`

export default function User() {
  const {
    user: { displayName, photoURL, uid },
  } = useContext(AuthContext)

  const { clearState, setIsAddRoomVisible, setIsAddFriendVisible } =
    React.useContext(AppContext)

  const handleAddRoom = () => {
    setIsAddRoomVisible(true)
  }
  const handleAddFriend = () => {
    setIsAddFriendVisible(true)
  }
  const menu = (
    <Menu
      items={[
        {
          label: (
            <Button icon={<UserOutlined />} type='text'>
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
          <Avatar src={photoURL} size='large'>
            {photoURL ? '' : displayName?.charAt(0)?.toUpperCase()}
          </Avatar>
        </DropdownStyled>
        <p className='username'>
          {displayName !== null ? displayName : 'Your name'}
        </p>
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
