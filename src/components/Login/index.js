import React, { useContext, useState } from 'react'
import {
  Form,
  Input,
  Button,
  Checkbox,
  Col,
  Row,
  Typography,
  Alert,
} from 'antd'
import {
  UserOutlined,
  LockOutlined,
  FormOutlined,
  FacebookFilled,
  GoogleSquareFilled,
  LoginOutlined,
} from '@ant-design/icons'
import styled from 'styled-components'
import { auth } from '../../firebase/config'
import { userRegister } from '../../firebase/services'
import {
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { Link } from 'react-router-dom'
import { AppContext } from '../../Context/AppProvider'

const { Title } = Typography

const googleProvider = new GoogleAuthProvider()
const fbProvider = new FacebookAuthProvider()

const ColStyled = styled(Col)`
  padding: 30px 40px 30px 40px;
  margin-top: 35px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
`
const TitleStyled = styled(Title)`
  margin-top: 35px;
`
const AlertStyled = styled(Alert)`
  margin-bottom: 10px;
`
export default function Login() {
  const { setIsRegisterVisible } = useContext(AppContext)
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
    setIsRegisterVisible(true)
  }

  const onFinish = values => {
    setErr(errInitState)
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      setErr(prevErr => ({ ...prevErr, email: 'Invalid email' }))
      return
    }
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then(userCredential => {
        // Signed in
        const user = userCredential.user
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
  }

  return (
    <div>
      <Row justify='center'>
        <TitleStyled style={{ textAlign: 'center' }} level={1}>
          Chat App
        </TitleStyled>
      </Row>
      <Row justify='center'>
        <ColStyled span={9}>
          <Form
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
            {err.errorMessage !== null && (
              <AlertStyled
                message={err.errorMessage}
                type='error'
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
            <Form.Item style={{ marginBottom: '0' }}>
              <Form.Item name='remember' valuePropName='checked' noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <Link className='login-form-forgot' to={'#'}>
                Forgot password
              </Link>
            </Form.Item>

            <Form.Item>
              <Button
                style={{ display: 'block', margin: '5px auto' }}
                type='primary'
                htmlType='submit'
                className='login-form-button'
                icon={<LoginOutlined />}>
                Log in
              </Button>
              Don't have account?
              <Button
                type='text'
                icon={<FormOutlined />}
                className=''
                onClick={handleRegister}>
                register now!
              </Button>
            </Form.Item>

            <Button
              icon={<GoogleSquareFilled />}
              style={{ width: '70%', marginBottom: 5 }}
              onClick={() => handleLoginWithProvider(googleProvider)}>
              Login with Google account
            </Button>
            <Button
              icon={<FacebookFilled />}
              style={{ width: '70%' }}
              onClick={() => handleLoginWithProvider(fbProvider)}>
              Login with Facebook account
            </Button>
          </Form>
        </ColStyled>
      </Row>
    </div>
  )
}
