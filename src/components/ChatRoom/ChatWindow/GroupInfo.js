import React, { useContext } from 'react'
import styled from 'styled-components'
import { AppContext } from '../../../Context/AppProvider'

const GraperStyled = styled.div`
  height: 100vh;
  background: linear-gradient(to bottom, #33cccc 0%, #003399 100%);
`

const HeaderStyled = styled.div`
  display: flex;
  justify-content: center;
  height: 56px;
  padding: 0 16px;
  align-items: center;
  border-bottom: 1px solid rgb(230, 230, 230);
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px,
    rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
  .title {
    margin: 0;
    font-weight: bold;
    font-size: 20px;
  }
`

export default function GroupInfo() {
  const { selectedRoom, members, setIsInviteMemberVisible } =
    useContext(AppContext)
  return (
    <GraperStyled>
      <HeaderStyled>
        <p className='title'>
          {selectedRoom.isAGroup ? 'Group Info' : 'Communication info'}
        </p>
      </HeaderStyled>
    </GraperStyled>
  )
}
