import React, { useContext, useEffect, useState } from 'react'
import { Modal } from 'antd'
import { ExclamationCircleTwoTone } from '@ant-design/icons'
import { updateDocument } from '../../firebase/services'
import { arrayRemove } from 'firebase/firestore'
import { ACTIONS, AppContext } from '../../context/AppProvider'

export default function ModalConfirmLeaveRoom() {
  const { state, dispatch, userInfo } = useContext(AppContext)

  const handleLeaveRoom = () => {
    // setSelectedRoomId('')
    updateDocument('rooms', selectedRoomLeave.id, {
      members: arrayRemove(userInfo.uid),
    })
    updateDocument('users', userInfo.uid, {
      pinnedRoomsId: arrayRemove(selectedRoomLeave.id),
    })
    modalConfirmCancel()
  }

  const modalConfirmCancel = () => {
    dispatch({ type: ACTIONS.TG_COMFIRM_LEAVE, payload: false })
    dispatch({ type: ACTIONS.SELECTED_ROOM_LEAVE, payload: {} })
  }
  return (
    <Modal
      className='noselect'
      centered
      visible={state.modalConfirmLeaveVisible}
      placement='bottom'
      title={
        <>
          <ExclamationCircleTwoTone twoToneColor='#ff5500' />
          {` Warning`}
        </>
      }
      width={400}
      okText='Yes'
      cancelText='No'
      onOk={handleLeaveRoom}
      onCancel={modalConfirmCancel}
      closable={false}>
      {`Are you sure to leave ${state.selectedRoomLeave.name}?`}
    </Modal>
  )
}
