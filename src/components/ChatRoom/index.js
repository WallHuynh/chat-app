import React, { useContext, useEffect } from 'react'
import { Row, Col } from 'antd'
import Sidebar from './Sidebar/Sidebar'
import ChatWindow from './ChatWindow'
import { ACTIONS, AppContext } from '../../context/AppProvider'
import useMeasure from 'react-use-measure'

export default function ChatRoom() {
  const { state, dispatch } = useContext(AppContext)
  const [ref, bounds] = useMeasure()

  useEffect(() => {
    setViewWidth(bounds.width)
    if (bounds.width <= 800 && bounds.width !== 0) {
      dispatch({ type: ACTIONS.TG_GROUP_INFOR, payload: false })
    } else {
      dispatch({ type: ACTIONS.TG_GROUP_INFOR, payload: true })
    }
  }, [bounds])

  return (
    <div ref={ref}>
      <Row>
        <Col
          className={
            state.selectedRoomId
              ? 'room-list-responsive-close'
              : 'room-list-responsive-open'
          }
          span={6}>
          <Sidebar />
        </Col>
        <Col
          className={
            state.selectedRoomId
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
