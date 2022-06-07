import React, { useContext } from 'react'
import { Form, Modal, Input } from 'antd'
import { AppContext } from '../../Context/AppProvider'
import { addDocument, updateDocument } from '../../firebase/services'
import { AuthContext } from '../../Context/AuthProvider'

export default function AddRoomModal() {
  const { isAddRoomVisible, setIsAddRoomVisible, selectedRoom, members } =
    useContext(AppContext)
  const {
    user: { uid, displayName, photoURL },
  } = useContext(AuthContext)
  const [form] = Form.useForm()

  const handleOk = () => {
    if (form?.getFieldsValue()?.name) {
      addDocument('rooms', {
        ...form.getFieldsValue(),
        members: [uid],
        isAGroup: true,
        typing: {
          user1: { uid: null, name: null, isTyping: false },
          user2: { uid: null, name: null, isTyping: false },
        },
        newestMess: { createAt: null, displayName: null, text: null },
        groupPhoto: null,
        standByPhoto: {
          lastThreeMembers: [
            {
              displayName: displayName,
              photoURL: photoURL || null,
            },
          ],
          groupLengthRest: null,
        },
      })
      form.resetFields()
      setIsAddRoomVisible(false)
    } else {
      return
    }
  }

  const handleCancel = () => {
    form.resetFields()
    setIsAddRoomVisible(false)
  }

  return (
    <div>
      <Modal
        centered
        title='Create your chat room'
        visible={isAddRoomVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={400}
        okText='Create'>
        <Form form={form} layout='vertical'>
          <Form.Item label='Name' name='name'>
            <Input placeholder="What's your room's name" maxLength={40} />
          </Form.Item>
          <Form.Item label='Discription' name='description' initialValue={''}>
            <Input.TextArea
              placeholder="What's your room's description"
              maxLength={300}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
