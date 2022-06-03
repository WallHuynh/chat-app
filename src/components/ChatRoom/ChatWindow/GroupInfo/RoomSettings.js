import { SplitCellsOutlined } from '@ant-design/icons'
import React, { useState } from 'react'
import { Button, Popconfirm } from 'antd'

export default function RoomSettings() {
  const [popConfirmVisivle, setPopConfirmVisible] = useState(false)

  const handleLeaveRoom = () => {
    popConfirmCancel()
    console.log('leaving')
  }
  const openPopConfirm = () => {
    setPopConfirmVisible(true)
  }
  const popConfirmCancel = () => {
    setPopConfirmVisible(false)
  }
  return (
    <Popconfirm
      visible={popConfirmVisivle}
      placement='bottom'
      title={'Are you sure to leave?'}
      onConfirm={handleLeaveRoom}
      okText='Yes'
      cancelText='No'
      onCancel={popConfirmCancel}>
      <Button
        type='text'
        icon={<SplitCellsOutlined />}
        onClick={openPopConfirm}>
        Leave this group
      </Button>
    </Popconfirm>
  )
}
