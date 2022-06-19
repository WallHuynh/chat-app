import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Row, Col } from 'antd'
import Sidebar from './Sidebar/Sidebar'
import ChatWindow from './ChatWindow'
import { AppContext } from '../../context/AppProvider'

export default function ChatRoom() {
  const { selectedRoomId } = useContext(AppContext)
  return (
    <div>
      <Row>
        <Col
          className={
            selectedRoomId
              ? 'room-list-responsive-close'
              : 'room-list-responsive-open'
          }
          span={6}>
          <Sidebar />
        </Col>
        <Col
          className={
            selectedRoomId
              ? 'chat-window-responsive-open'
              : 'chat-window-responsive-close'
          }
          span={18}>
          <ChatWindow />
        </Col>
      </Row>
    </div>
  )
}
