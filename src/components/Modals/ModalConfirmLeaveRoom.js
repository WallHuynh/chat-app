import React, { useContext, useEffect, useState } from 'react'
import { Modal } from 'antd'
import { ExclamationCircleTwoTone } from '@ant-design/icons'
import { updateDocument } from '../../firebase/services'
import { arrayRemove } from 'firebase/firestore'
import { AppContext } from '../../context/AppProvider'

export default function ModalConfirmLeaveRoom() {
  const {
    modalConfirmVisible,
    setModalConfirmVisible,
    selectedRoomLeave,
    setSelectedRoomLeave,
    userInfo,
    setSelectedRoomId,
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
    setModalConfirmVisible(false)
    setSelectedRoomLeave({})
  }
  return (
    <div>
      <Modal
        centered
        visible={modalConfirmVisible}
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
        {`Are you sure to leave ${selectedRoomLeave.name}`}
      </Modal>
    </div>
  )
}
