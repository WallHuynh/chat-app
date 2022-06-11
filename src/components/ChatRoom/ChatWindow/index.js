import { Row, Col, Alert } from 'antd'
import React, { useContext } from 'react'
import { AppContext } from '../../../Context/AppProvider'
import ChatFrame from './ChatFrame'
import GroupInfo from './GroupInfo'

export default function ChatWindow() {
  const { selectedRoom } = useContext(AppContext)
  return (
    <>
      {selectedRoom.id ? (
        <>
          <Row>
            <Col span={16}>
              <ChatFrame />
            </Col>
            <Col span={8}>
              <GroupInfo />
            </Col>
          </Row>
        </>
      ) : (
        <Alert
          message='chose your room'
          type='info'
          showIcon
          style={{ top: '15px', left: '15px', width: '70%' }}
          closable
        />
      )}
    </>
  )
}
