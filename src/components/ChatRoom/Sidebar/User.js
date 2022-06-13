import { Avatar, Badge, Button, Dropdown, Menu, Tooltip } from 'antd'
import React, { useContext } from 'react'
import { AppContext } from '../../../Context/AppProvider'
import { AuthContext } from '../../../Context/AuthProvider'
import {
  BellOutlined,
  LogoutOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { auth } from '../../../firebase/config'

export default function User() {
  const {
    clearState,
    setIsAddRoomVisible,
    setIsFindFriendVisible,
    setUserAccountVisible,
    setShowUserStatus,
    status,
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
  const handleShowStatus = () => {
    setShowUserStatus(true)
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
      handleShowStatus()
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
            <Badge size='default' dot={true} color='cyan' count={status.length}>
              <Button icon={<BellOutlined />} type='text'>
                Status
              </Button>
            </Badge>
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
    <div className='user-bar noselect'>
      <div className='avt-name'>
        <Dropdown className='dropdown-list' overlay={menu} trigger={['click']}>
          <Badge size='small' color='cyan' count={status.length}>
            <Avatar className='avatar' src={photoURL} size='large'>
              {photoURL ? '' : displayName?.charAt(0)?.toUpperCase()}
            </Avatar>
          </Badge>
        </Dropdown>
        <p className='username'>{displayName}</p>
      </div>
      <div className='btns'>
        <Tooltip
          className='addfriend'
          placement='bottom'
          title='Add friend'
          color='#b8a3f5'>
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
          color='#b8a3f5'>
          <Button
            type='text'
            icon={<UsergroupAddOutlined />}
            onClick={handleAddRoom}
          />
        </Tooltip>
      </div>
    </div>
  )
}
