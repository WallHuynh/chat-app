import {
  PlusCircleOutlined,
  PushpinFilled,
  PushpinOutlined,
  SplitCellsOutlined,
  StopFilled,
} from '@ant-design/icons'
import React, { useContext } from 'react'
import { Button } from 'antd'
import { ACTIONS, AppContext } from '../../../../context/AppProvider'
import { updateDocument } from '../../../../firebase/services'
import { arrayRemove, arrayUnion } from 'firebase/firestore'

export default function SettingOptions() {
  const { selectedRoom, userInfo, dispatch } = useContext(AppContext)

  const openModalConfirm = () => {
    dispatch({ type: ACTIONS.TG_COMFIRM_LEAVE, payload: true })
    dispatch({ type: ACTIONS.SELECTED_ROOM_LEAVE, payload: selectedRoom })
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
      <div
        className='btn'
        onClick={() => dispatch({ type: ACTIONS.TG_INVITE, payload: true })}>
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
