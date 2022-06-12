import { ExclamationCircleTwoTone, SplitCellsOutlined } from '@ant-design/icons'
import React, { useContext, useState } from 'react'
import { Button, Modal } from 'antd'
import styled from 'styled-components'
import { AppContext } from '../../../../Context/AppProvider'
import { updateDocument } from '../../../../firebase/services'
import { arrayRemove } from 'firebase/firestore'
import { AuthContext } from '../../../../Context/AuthProvider'

const ModalStyled = styled(Modal)`
  .ant-modal-body {
    display: none;
  }
`

export default function RoomSettings() {
  const [modalConfirmVisivle, setModalConfirmVisible] = useState(false)
  const {
    members,
    selectedRoom,
    setUserInfoVisible,
    setSelectedUser,
    setSelectedRoomId,
  } = useContext(AppContext)

  const {
    user: { uid },
  } = useContext(AuthContext)

  const handleLeaveRoom = () => {
    modalConfirmCancel()
    setSelectedRoomId('')
    updateDocument('rooms', selectedRoom.id, {
      members: arrayRemove(uid),
    })
  }
  const openModalConfirm = () => {
    setModalConfirmVisible(true)
  }
  const modalConfirmCancel = () => {
    setModalConfirmVisible(false)
  }
  return (
    <>
      <div className='leave-btn' onClick={openModalConfirm}>
        <Button type='text' icon={<SplitCellsOutlined />}>
          Leave this room
        </Button>
      </div>
      <ModalStyled
        centered
        visible={modalConfirmVisivle}
        placement='bottom'
        title={
          <>
            <ExclamationCircleTwoTone twoToneColor='#ff5500' />{' '}
            {`Are you sure to leave ${selectedRoom.name}?`}
          </>
        }
        width={300}
        okText='Yes'
        cancelText='No'
        onOk={handleLeaveRoom}
        onCancel={modalConfirmCancel}
        closable={false}></ModalStyled>
    </>
  )
}
