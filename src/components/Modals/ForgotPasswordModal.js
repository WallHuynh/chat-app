import React, { useContext } from 'react'
import { Form, Modal, Input, notification } from 'antd'
import { ACTIONS, AppContext } from '../../context/AppProvider'
import { db } from '../../firebase/config'
import { collection, getDocs, query, where } from 'firebase/firestore'

export default function ForgotPasswordModal() {
  const { state, dispatch } = useContext(AppContext)

  const [form] = Form.useForm()

  const openNotification = (placement, msg, describe) => {
    notification.warn({
      message: msg,
      description: describe,
      placement: placement,
    })
  }

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
      if (!querySnapshot.empty) {
        const documents = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }))[0]
        console.log('password sent')
      } else {
        openNotification(
          'bottom',
          'Not found',
          `Your email ${email} have not been registered yet`
        )
      }
    } else {
      return
    }
  }

  const handleCancel = () => {
    form.resetFields()
    dispatch({ type: ACTIONS.EMAIL, payload: '' })
    dispatch({ type: ACTIONS.TG_FORGOT_PASS, payload: false })
  }

  return (
    <div>
      <Modal
        className='noselect'
        centered
        title='Recover password'
        visible={state.isForgotPassVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={350}
        okText='Find'>
        <Form form={form} layout='vertical'>
          <Form.Item name='email' initialValue={state.emailRegister}>
            <Input placeholder='Your email' maxLength={40} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
