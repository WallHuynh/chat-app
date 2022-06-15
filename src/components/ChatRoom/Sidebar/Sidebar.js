import React, { useContext } from 'react'
import User from './User'
import RoomList from './RoomList'
import { AppContext } from '../../../context/AppProvider'
import UserStatus from './UserStatus'
import './Sidebar.scss'

export default function Sidebar() {
  const { showUserStatus } = useContext(AppContext)
  return (
    <div className='sidebar'>
      <User />
      {showUserStatus ? <UserStatus /> : <RoomList />}
    </div>
  )
}
