import { Avatar, Button, Dropdown, Menu, Tooltip } from 'antd'
import React, { useContext } from 'react'
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
    setIsFindFriendVisible,
    setUserAccountVisible,
    setUserStatusVisible,
  } = React.useContext(AppContext)

  const {
    user: { displayName, photoURL },
  } = useContext(AuthContext)

  const handleAddRoom = () => {
    setIsAddRoomVisible(true)
  }

  const handleAddFriend = () => {
    setIsFindFriendVisible(true)
  }

  const handleUserAccountVisible = () => {
    setUserAccountVisible(true)
  }

  const handleUserStatusVisible = () => {
    setUserStatusVisible(true)
  }
  const handleLogOut = () => {
    clearState()
    auth.signOut()
  }

  const onClick = ({ key }) => {
    if (key === '0') {
      handleUserAccountVisible()
    }
    if (key === '1') {
      handleUserStatusVisible()
    }
    if (key === '2') {
      handleLogOut()
    }
  }
  const menu = (
    <Menu
      onClick={onClick}
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
          label: (
            <Button icon={<UserOutlined />} type='text'>
              Status
            </Button>
          ),
          key: '1',
        },
        {
          type: 'divider',
        },
        {
          label: (
            <Button icon={<LogoutOutlined />} type='text'>
              Log Out
            </Button>
          ),
          key: '2',
        },
      ]}
    />
  )
  return (
    <DivStyled className='noselect'>
      <div className='avt-name'>
        <DropdownStyled
          className='dropdown-list'
          overlay={menu}
          trigger={['click']}>
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
