import React, { useContext, useState } from 'react'
import { Form, Input, Button, Checkbox, Typography, Alert } from 'antd'
import {
  UserOutlined,
  LockOutlined,
  FacebookFilled,
  GoogleSquareFilled,
  LoginOutlined,
  IdcardOutlined,
  QuestionOutlined,
} from '@ant-design/icons'
import styled from 'styled-components'
import { auth } from '../../firebase/config'
import { userRegister } from '../../firebase/services'
import {
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
} from 'firebase/auth'
import { AppContext } from '../../context/AppProvider'
import './Login.scss'

const { Title } = Typography

const googleProvider = new GoogleAuthProvider()
const fbProvider = new FacebookAuthProvider()

const TitleStyled = styled(Title)`
  margin-top: 0.5em;
`
const AlertStyled = styled(Alert)`
  margin-bottom: 10px;
`
export default function Login() {
  const [form] = Form.useForm()
  const { setIsRegisterVisible, setEmailRegister, setIsForgotPassVisible } =
    useContext(AppContext)
  const errInitState = {
    errorCode: null,
    errorMessage: null,
    email: '',
  }
  const [err, setErr] = useState(errInitState)
  const handleLoginWithProvider = async provider => {
    const { user } = await signInWithPopup(auth, provider)
    userRegister(user)
  }

  const handleRegister = () => {
    setEmailRegister(form.getFieldValue().email)
    setIsRegisterVisible(true)
  }

  const handleForgotPassword = () => {
    setIsForgotPassVisible(true)
    setEmailRegister(form.getFieldValue().email)
  }

  const onFinish = values => {
    setErr(errInitState)
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      setErr(prevErr => ({ ...prevErr, email: 'Invalid email' }))
      return
    }
    if (values.remember) {
      signInWithEmailAndPassword(auth, values.email, values.password)
        .then(userCredential => {
          // Signed in
          // const user = userCredential.user
          // ...
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
    } else {
      setPersistence(auth, browserSessionPersistence).then(() => {
        return signInWithEmailAndPassword(auth, values.email, values.password)
      })
    }
  }

  return (
    <>
      <TitleStyled style={{ textAlign: 'center' }} level={1}>
        Chat App
      </TitleStyled>
      <div className='login-graper'>
        <Form
          form={form}
          style={{ textAlign: 'center' }}
          name='normal_login'
          className='login-form'
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}>
          {err.errorCode !== null && (
            <AlertStyled
              message={err.errorCode}
              type='error'
              showIcon
              closable
            />
          )}
          {err.email !== '' && (
            <AlertStyled message={err.email} type='error' showIcon closable />
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
              prefix={<UserOutlined className='site-form-item-icon' />}
              placeholder='Email'
            />
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

          <Form.Item name='remember' valuePropName='checked' noStyle>
            <Checkbox className='check-box noselect'>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <button
              className='button-82-pushable'
              role='button'
              style={{ display: 'block', margin: '5px auto' }}
              type='primary'
              htmlType='submit'>
              <span className='button-82-shadow'></span>
              <span className='button-82-edge'></span>
              <span className='button-82-front text'>
                {<LoginOutlined />} Login
              </span>
            </button>

            <Button
              className='button-83'
              type='text'
              icon={<QuestionOutlined />}
              onClick={handleForgotPassword}>
              Forgot password
            </Button>

            <Button
              type='text'
              className='button-83'
              icon={<IdcardOutlined />}
              onClick={handleRegister}>
              Register now
            </Button>
          </Form.Item>
          <Button
            className='button-17'
            icon={<GoogleSquareFilled />}
            style={{ marginBottom: '0.5em' }}
            onClick={() => handleLoginWithProvider(googleProvider)}>
            Login with Google account
          </Button>

          <Button
            className='button-17'
            icon={<FacebookFilled />}
            onClick={() => handleLoginWithProvider(fbProvider)}>
            Login with Facebook account
          </Button>
        </Form>
      </div>
    </>
  )
}
