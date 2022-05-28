import React from 'react'
import { Row, Col } from 'antd'
import User from './User'
import RoomList from './RoomList'
import styled from 'styled-components'

const SidebarStyled = styled.div`
  background: linear-gradient(to bottom, #33cccc 0%, #003399 100%);
  color: white;
  height: 100vh;
  border-right: 1px solid rgb(230, 230, 230);
  box-shadow: rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset,
    rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset;
`
export default function Sidebar() {
  return (
    <SidebarStyled>
      <User />
      <RoomList />
    </SidebarStyled>
  )
}
