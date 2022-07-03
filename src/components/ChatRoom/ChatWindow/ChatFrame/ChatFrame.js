import React, { useContext } from 'react'
import { Alert } from 'antd'
import { AppContext } from '../../../../context/AppProvider'
import Header from './Header'
import MessageContent from './MessageContent'
import './ChatFrame.scss'

export default function ChatFrame() {
  return (
    <div className='chat-frame-wrapper'>
      <Header />
      <MessageContent />
    </div>
  )
}
