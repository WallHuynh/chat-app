import React, { useContext } from 'react'
import User from './User'
import RoomList from './RoomList'
import styled from 'styled-components'
import { AppContext } from '../../../Context/AppProvider'
import UserStatus from './UserStatus'

const SidebarStyled = styled.div`
  height: 100vh;
  border-right: 1px solid rgb(230, 230, 230);
  background-color: #f0fff0;
  color: rgb(40, 40, 40);
`
export default function Sidebar() {
  const { showUserStatus } = useContext(AppContext)
  return (
    <SidebarStyled>
      <User />
      {showUserStatus ? <UserStatus /> : <RoomList />}
    </SidebarStyled>
  )
}
