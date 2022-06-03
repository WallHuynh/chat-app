import React from 'react'
import { Row, Col } from 'antd'
import User from './User'
import RoomList from './RoomList'
import styled from 'styled-components'

const SidebarStyled = styled.div`
  height: 100vh;
  border-right: 1px solid rgb(230, 230, 230);
`
export default function Sidebar() {
  return (
    <SidebarStyled>
      <User />
      <RoomList />
    </SidebarStyled>
  )
}
