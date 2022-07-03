import {
  PlusCircleOutlined,
  PushpinFilled,
  PushpinOutlined,
  SplitCellsOutlined,
  StopFilled,
} from '@ant-design/icons'
import React, { useContext } from 'react'
import { Button } from 'antd'
import { AppContext } from '../../../../context/AppProvider'
import { updateDocument } from '../../../../firebase/services'
import { arrayRemove, arrayUnion } from 'firebase/firestore'

export default function SettingOptions() {
  const {
    selectedRoom,
    setModalConfirmLeaveVisible,
    setSelectedRoomLeave,
    userInfo,
    setIsInviteMemberVisible,
  } = useContext(AppContext)

  const openModalConfirm = () => {
    setModalConfirmLeaveVisible(true)
    setSelectedRoomLeave(selectedRoom)
  }
  const handlePin = () => {
    updateDocument('users', userInfo.uid, {
      pinnedRoomsId: arrayUnion(selectedRoom.id),
    })
  }
  const handleUnpin = () => {
    updateDocument('users', userInfo.uid, {
      pinnedRoomsId: arrayRemove(selectedRoom.id),
    })
  }
  return (
    <>
      <div className='btn' onClick={() => setIsInviteMemberVisible(true)}>
        <Button icon={<PlusCircleOutlined />} type='text'>
          Invite friend
        </Button>
      </div>
      {userInfo?.pinnedRoomsId?.includes(selectedRoom.id) ? (
        <div className='btn' onClick={handleUnpin}>
          <Button icon={<PushpinOutlined />} type='text'>
            UnPin this conversation
          </Button>
        </div>
      ) : (
        <div className='btn' onClick={handlePin}>
          <Button icon={<PushpinFilled />} type='text'>
            Pin this conversation
          </Button>
        </div>
      )}
      {selectedRoom.isAGroup ? (
        <div className='btn' onClick={openModalConfirm}>
          <Button type='text' icon={<SplitCellsOutlined />}>
            Leave this room
          </Button>
        </div>
      ) : null}
    </>
  )
}
