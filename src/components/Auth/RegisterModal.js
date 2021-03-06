import React, { useContext, useEffect, useState } from 'react'
import { Form, Modal, Input, Button, Alert } from 'antd'
import { AppContext, ACTIONS } from '../../context/AppProvider'
import styled from 'styled-components'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../../firebase/config'
import { userRegister } from '../../firebase/services'

const AlertStyled = styled(Alert)`
  margin-bottom: 10px;
`

export default function RegisterModal() {
  const { state, dispatch } = useContext(AppContext)
  const errInitState = {
    email: '',
    passwords: '',
    isSuccess: false,
    errorCode: null,
    errorMessage: null,
  }
  const [err, setErr] = useState(errInitState)
  const [email, setEmail] = useState('')

  useEffect(() => {
    setEmail(state.emailRegister)
  }, [state.emailRegister])

  const [form] = Form.useForm()

  const handleCancel = () => {
    if (err.isSuccess) {
      form.resetFields()
      setErr(errInitState)
      dispatch({ type: ACTIONS.EMAIL, payload: '' })
      dispatch({ type: ACTIONS.TG_REGISTER, payload: false })
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } else {
      form.resetFields()
      setErr(errInitState)
      dispatch({ type: ACTIONS.EMAIL, payload: '' })
      dispatch({ type: ACTIONS.TG_REGISTER, payload: false })
    }
  }

  const onFinish = values => {
    if (err.isSuccess) {
      return
    }
    setErr(errInitState)

    const { email, firstname, lastname, password, confirm } = values

    let flatIsErr = false
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      setErr(prevErr => ({ ...prevErr, email: 'Invalid email' }))
      flatIsErr = true
    }
    if (password !== confirm) {
      setErr(prevErr => ({ ...prevErr, passwords: "Passwords don't match" }))
      flatIsErr = true
    }
    if (flatIsErr) {
      return
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        // Signed in
        const user = userCredential.user
        if (user) {
          updateProfile(auth.currentUser, {
            displayName: `${firstname} ${lastname}`,
          })
          userRegister(user)
          setErr(prevErr => ({ ...prevErr, isSuccess: true }))
        }
      })
      .catch(error => {
        const errorCode = error.code
        const errorMessage = error.message
        setErr(prevErr => ({
          ...prevErr,
          errorCode: errorCode,
          errorMessage: errorMessage,
        }))
      })
  }

  return (
    <div>
      <Modal
        centered
        footer={null}
        title='Chat App Register'
        visible={state.isRegisterVisible}
        onCancel={handleCancel}>
        <Form
          initialValues={{ email: state.emailRegister }}
          form={form}
          layout='vertical'
          style={{ textAlign: 'center' }}
          name='normal_login'
          className='login-form'
          onFinish={onFinish}>
          {err.email !== '' && (
            <AlertStyled message={err.email} type='error' showIcon closable />
          )}
          {err.passwords !== '' && (
            <AlertStyled
              message={err.passwords}
              type='error'
              showIcon
              closable
            />
          )}
          {err.errorCode !== null && (
            <AlertStyled
              message={err.errorCode}
              type='error'
              showIcon
              closable
            />
          )}

          {err.isSuccess && (
            <AlertStyled
              message='Sign up successfully! Now you can close this tab'
              type='success'
              showIcon
              closable
            />
          )}

          <Form.Item
            name='email'
            rules={[
              {
                required: true,
                message: 'Please input your Email!',
              },
            ]}>
            <Input
              prefix={<MailOutlined className='site-form-item-icon' />}
              type='email'
              placeholder='Email'
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Form.Item
              name='firstname'
              style={{ display: 'inline-block', width: 'calc(50% - 24px)' }}
              rules={[
                {
                  required: true,
                  message: 'Please input your Firstname!',
                },
              ]}>
              <Input
                prefix={<UserOutlined className='site-form-item-icon' />}
                placeholder='Firstname'
              />
            </Form.Item>

            <Form.Item
              name='lastname'
              style={{
                display: 'inline-block',
                width: 'calc(50% + 16px)',
                marginLeft: '8px',
              }}
              rules={[
                {
                  required: true,
                  message: 'Please input your Lastname!',
                },
              ]}>
              <Input
                prefix={<UserOutlined className='site-form-item-icon' />}
                placeholder='Lastname'
              />
            </Form.Item>
          </Form.Item>

          <Form.Item
            name='password'
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}>
            <Input.Password
              prefix={<LockOutlined className='site-form-item-icon' />}
              type='password'
              placeholder='Password'
            />
          </Form.Item>

          <Form.Item
            name='confirm'
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}>
            <Input.Password
              prefix={<LockOutlined className='site-form-item-icon' />}
              type='password'
              placeholder='Confirm Password'
            />
          </Form.Item>

          {err.isSuccess ? (
            <Button onClick={handleCancel}>Close this tab</Button>
          ) : (
            <Button
              style={{ display: 'block', margin: '5px auto' }}
              type='primary'
              htmlType='submit'>
              Sign Up
            </Button>
          )}
        </Form>
      </Modal>
    </div>
  )
}
