import React, { useContext } from 'react'
import { Alert } from 'antd'
import { AppContext } from '../../../../Context/AppProvider'
import Header from './Header'
import MessageContent from './MessageContent'
import './ChatFrame.scss'

export default function ChatFrame() {
  const { selectedRoom } = useContext(AppContext)

  return (
    <div className='chat-frame-wraper'>
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
    </div>
  )
}
