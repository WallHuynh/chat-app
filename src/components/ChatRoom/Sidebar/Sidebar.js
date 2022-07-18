import React, { useContext } from 'react'
import RoomList from './RoomList'
import { AppContext } from '../../../context/AppProvider'
import FriendRequest from './FriendRequest'
import './Sidebar.scss'
import UserHeader from './UserHeader'

export default function Sidebar() {
  const { state } = useContext(AppContext)
  return (
    <div className='sidebar'>
      <UserHeader />
      {state.showUserStatus ? <FriendRequest /> : <RoomList />}
    </div>
  )
}
