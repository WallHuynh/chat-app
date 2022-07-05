import React, { useContext, useEffect, useState } from 'react'
import { Modal } from 'antd'
import { ExclamationCircleTwoTone } from '@ant-design/icons'
import { updateDocument } from '../../firebase/services'
import { arrayRemove } from 'firebase/firestore'
import { AppContext } from '../../context/AppProvider'

export default function ModalConfirmLeaveRoom() {
  const {
    modalConfirmLeaveVisible,
    setModalConfirmLeaveVisible,
    selectedRoomLeave,
    setSelectedRoomLeave,
    userInfo,
  } = useContext(AppContext)

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
    setModalConfirmLeaveVisible(false)
    setSelectedRoomLeave({})
  }
  return (
    <Modal
      className='noselect'
      centered
      visible={modalConfirmLeaveVisible}
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
      {`Are you sure to leave ${selectedRoomLeave.name}?`}
    </Modal>
  )
}
