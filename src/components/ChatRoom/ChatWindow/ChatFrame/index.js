import React, { useContext } from 'react'
import styled from 'styled-components'
import { Alert } from 'antd'
import { AppContext } from '../../../../Context/AppProvider'
import Header from './Header'
import MessageContent from './MessageContent'

const WrapperStyled = styled.div`
  height: 100vh;
  border-right: 1px solid rgb(230, 230, 230);
`

export default function ChatFrame() {
  const { selectedRoom } = useContext(AppContext)

  return (
    <WrapperStyled>
      {selectedRoom.id ? (
        <>
          <Header />
          <MessageContent />
        </>
      ) : (
        <Alert
          message='Hãy chọn phòng'
          type='info'
          showIcon
          style={{ top: '15px', left: '15px', width: '70%' }}
          closable
        />
      )}
    </WrapperStyled>
  )
}
