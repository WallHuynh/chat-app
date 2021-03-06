import { Avatar, Badge, Button, Dropdown, Menu, Tooltip } from 'antd'
import React, { useContext } from 'react'
import { ACTIONS, AppContext } from '../../../context/AppProvider'
import {
  BellOutlined,
  LogoutOutlined,
  SearchOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { auth } from '../../../firebase/config'

export default function UserHeader() {
  const { clearState, dispatch, status, state, userInfo } =
    useContext(AppContext)

  const handleAddRoom = () => {
    dispatch({ type: ACTIONS.TG_ADDROOM, payload: true })
  }

  const handleAddFriend = () => {
    dispatch({ type: ACTIONS.TG_FIND_FRIEND, payload: true })
  }

  const handleUserAccountVisible = () => {
    dispatch({ type: ACTIONS.TG_ACCOUNT, payload: true })
  }
  const handleShowStatus = () => {
    dispatch({ type: ACTIONS.TG_STATUS, payload: true })
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
            <Button
              className='btn-dropdown-list'
              icon={<UserOutlined />}
              type='text'>
              User
            </Button>
          ),
          key: '0',
        },
        {
          label: (
            <Badge size='default' dot={true} color='cyan' count={status.length}>
              <Button
                className='btn-dropdown-list'
                icon={<BellOutlined />}
                type='text'>
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
            <Button
              className='btn-dropdown-list'
              icon={<LogoutOutlined />}
              type='text'>
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
        <Dropdown className='dropdown-list' overlay={menu} trigger={['hover']}>
          <Badge size='small' color='cyan' count={status.length}>
            <Avatar className='avatar' src={userInfo.photoURL} size='large'>
              {userInfo.photoURL
                ? ''
                : userInfo.displayName?.charAt(0)?.toUpperCase()}
            </Avatar>
          </Badge>
        </Dropdown>
        <p className='username'>{userInfo.displayName}</p>
      </div>
      <div className='btns'>
        <Tooltip
          className='addfriend'
          placement='bottom'
          title='Find friend'
          color='#b8a3f5'>
          <Button
            type='text'
            icon={<SearchOutlined />}
            onClick={handleAddFriend}
          />
        </Tooltip>
        <Tooltip
          className='addroom'
          placement={state.viewWidth < 800 ? 'bottomRight' : 'bottom'}
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
