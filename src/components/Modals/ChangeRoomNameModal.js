import React, { useContext, useState } from 'react'
import { Modal, Form, Input, Button } from 'antd'
import { AppContext } from '../../context/AppProvider'
import './Modals.scss'
import { updateDocument } from '../../firebase/services'

export default function ChangeRoomNameModal() {
  const {
    userInfo,
    changeRoomNameVisible,
    setChangeRoomNameVisible,
    selectedRoom,
  } = useContext(AppContext)
  const [form] = Form.useForm()
  const [isFieldChange, setIsFieldChange] = useState(false)

  const handleCancel = () => {
    setChangeRoomNameVisible(false)
    form.resetFields()
    setIsFieldChange(false)
  }

  const handleUpdateRoomName = () => {
    if (form.getFieldValue().name.trim() !== selectedRoom.name) {
      updateDocument('rooms', selectedRoom.id, {
        name: form.getFieldValue().name,
      })
      handleCancel()
    }
  }
  return (
    <Modal
      className='change-room-name noselect'
      footer={
        <>
          <Button className='btn-primary ' onClick={handleCancel}>
            Cancel
          </Button>

          <Button
            className={isFieldChange ? 'confirm-btn' : 'disabled-btn'}
            disabled={!isFieldChange}
            onClick={handleUpdateRoomName}>
            Update
          </Button>
        </>
      }
      centered
      width={350}
      title='Update room name'
      visible={changeRoomNameVisible}
      onCancel={handleCancel}>
      <Form form={form} layout='vertical'>
        <Form.Item
          label='New room name will be displayed to all members'
          name='name'
          initialValue={selectedRoom.name}>
          <Input maxLength={40} onChange={() => setIsFieldChange(true)} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
