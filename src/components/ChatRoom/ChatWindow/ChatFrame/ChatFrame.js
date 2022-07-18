import React  from 'react'
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
