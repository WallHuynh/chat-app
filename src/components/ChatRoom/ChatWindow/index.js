import { Row, Col } from 'antd'
import React, { useContext } from 'react'
import { AppContext } from '../../../context/AppProvider'
import ChatFrame from './ChatFrame/ChatFrame'
import RoomInfo from './RoomInfo/RoomInfo'

export default function ChatWindow() {
  const { selectedRoom, openGroupInfo } = useContext(AppContext)

  return (
    <>
      {selectedRoom.id ? (
        <>
          <Row>
            <Col span={openGroupInfo ? 16 : 24}>
              <ChatFrame />
            </Col>
            <Col span={openGroupInfo ? 8 : 0}>
              <RoomInfo />
            </Col>
          </Row>
        </>
      ) : (
        <div className='wrapper'>
          <p id='title'>
            welcome to <span>Chat-app</span>!
          </p>
          <p id='description'>Let's choose your room</p>
        </div>
      )}
    </>
  )
}
