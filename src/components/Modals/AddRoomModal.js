import React, { useContext } from 'react'
import { Form, Modal, Input } from 'antd'
import { AppContext } from '../../context/AppProvider'
import { addDocument, updateDocument } from '../../firebase/services'
import { AuthContext } from '../../context/AuthProvider'

export default function AddRoomModal() {
  const { isAddRoomVisible, setIsAddRoomVisible, setSelectedRoomId } =
    useContext(AppContext)
  const {
    user: { uid, displayName, photoURL },
  } = useContext(AuthContext)
  const [form] = Form.useForm()

  const handleOk = async () => {
    if (form?.getFieldsValue()?.name) {
      const roomRef = await addDocument('rooms', {
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
      setSelectedRoomId(roomRef.id)
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
          <Form.Item name='name'>
            <Input
              onPressEnter={handleOk}
              placeholder="What's your room's name"
              maxLength={40}
            />
          </Form.Item>
          <Form.Item name='description' initialValue={''}>
            <Input.TextArea
              onPressEnter={handleOk}
              placeholder="What's your room's description"
              maxLength={300}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
