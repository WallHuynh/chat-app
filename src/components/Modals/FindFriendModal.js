import React, { useContext } from 'react'
import { Form, Modal, Input, notification } from 'antd'
import { AppContext } from '../../context/AppProvider'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../firebase/config'

export const openNotification = (placement, msg, describe) => {
  notification.warn({
    message: msg,
    description: describe,
    placement: placement,
  })
}
export default function FindFriendModal() {
  const {
    isFindFriendVisible,
    setIsFindFriendVisible,
    setSelectedUser,
    setUserInfoVisible,
  } = useContext(AppContext)

  const [form] = Form.useForm()

  const handleOk = async () => {
    const email = form?.getFieldsValue()?.email
    if (email) {
      let flatIsErr = false
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
        openNotification('bottom', 'Invalid email', '')
        flatIsErr = true
      }

      if (flatIsErr) {
        return
      }
      const q = query(
        collection(db, 'users'),
        where('email', '==', form?.getFieldsValue()?.email)
      )
      const querySnapshot = await getDocs(q)
      console.log(querySnapshot)

      if (!querySnapshot.empty) {
        const documents = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }))[0]
        setSelectedUser(documents)
        setUserInfoVisible(true)
      } else {
        openNotification('bottom', 'User not found', '')
      }
    } else {
      return
    }
  }

  const handleCancel = () => {
    form.resetFields()
    setIsFindFriendVisible(false)
  }

  return (
    <Modal
      className='noselect'
      centered
      title='Find a friend'
      visible={isFindFriendVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={350}
      okText='Find'>
      <Form form={form} layout='vertical'>
        <Form.Item name='email'>
          <Input placeholder="Your friend's email" maxLength={40} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
