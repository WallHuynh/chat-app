import React, { useContext, useEffect, useState } from 'react'
import { Form, Modal, Input, notification } from 'antd'
import { AppContext } from '../../context/AppProvider'
import styledComponents from 'styled-components'
import { db } from '../../firebase/config'
import { collection, getDocs, query, where } from 'firebase/firestore'

const ModalStyled = styledComponents(Modal)``

export default function ForgotPasswordModal() {
  const {
    isForgotPassVisible,
    setIsForgotPassVisible,
    emailRegister,
    setEmailRegister,
  } = useContext(AppContext)

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
      console.log(querySnapshot)
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
    setEmailRegister('')
    form.resetFields()
    setIsForgotPassVisible(false)
  }

  return (
    <div>
      <ModalStyled
        centered
        title='Recover password'
        visible={isForgotPassVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={350}
        okText='Find'>
        <Form form={form} layout='vertical'>
          <Form.Item name='email' initialValue={emailRegister}>
            <Input placeholder='Your email' maxLength={40} />
          </Form.Item>
        </Form>
      </ModalStyled>
    </div>
  )
}
