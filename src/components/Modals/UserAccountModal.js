import React, { useContext } from 'react'
import { Modal, Image, Avatar } from 'antd'
import { AppContext } from '../../Context/AppProvider'
import { AuthContext } from '../../Context/AuthProvider'
import styled from 'styled-components'
import { UserDeleteOutlined } from '@ant-design/icons'
import { updateProfile } from 'firebase/auth'
import { auth } from '../../firebase/config'

const ModalStyled = styled(Modal)`
  .ant-avatar-lg {
    cursor: pointer;
    width: 80px;
    height: 80px;
    text-align: center;
    .ant-avatar-string {
      top: 23%;
      font-size: 30px;
    }
  }
  .ant-modal-footer {
    height: 50px;
    text-align: center;
    .unfriend-btn {
      border: 0.1px solid gray;
      background-color: white;
      font-weight: 600;
      :hover {
        font-weight: 600;
        border: solid 1px green;
        color: green;
      }
      :active {
        box-shadow: rgba(6, 24, 44, 0.4) 0px 0px 0px 2px,
          rgba(6, 24, 44, 0.65) 0px 4px 6px -1px,
          rgba(255, 255, 255, 0.08) 0px 1px 0px inset;
        transform: translateY(-0.5px);
        transition: 200ms;
      }
    }
  }
  .cover-photo {
    background-color: lightpink;
    height: 150px;
    position: relative;
    .avatar {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translate(-40px, 40px);
    }
  }
  .info {
    background-color: lightyellow;
    height: 180px;
    padding-top: 45px;
    .name {
      background-color: lightgreen;
      font-size: 25px;
      text-align: center;
      padding: 0 40px 0 40px;
      text-overflow: ellipsis;
      overflow-x: hidden;
      white-space: nowrap;
    }
    .email {
      padding: 0 20px 0 20px;
      font-size: 16px;
      .tag {
        opacity: 0.7;
      }
    }
  }
`

export default function UserAccountModal() {
  const { userAccountVisible, setUserAccountVisible } = useContext(AppContext)
  const {
    user: { email, displayName, photoURL },
  } = useContext(AuthContext)

  const handleCancel = () => {
    setUserAccountVisible(false)
  }
  const handleOk = () => {}

  return (
    <div>
      <ModalStyled
        onOk={handleOk}
        bodyStyle={{ padding: '0' }}
        width={350}
        title='User account setting'
        visible={userAccountVisible}
        onCancel={handleCancel}>
        <div className='cover-photo'>
          {photoURL ? (
            <Image src={photoURL} size='large' className='avatar' />
          ) : (
            <Avatar size='large' className='avatar'>
              displayName?.charAt(0)?.toUpperCase()
            </Avatar>
          )}
        </div>
        <div className='info'>
          <Form form={form} layout='vertical'>
            <Form.Item className='name' label='Name' name='name'>
              <Input maxLength={40} value={displayName} />
            </Form.Item>
            <Form.Item className='email' label='Email' name='email'>
              <Input value={email} disabled />
            </Form.Item>
          </Form>
        </div>
      </ModalStyled>
    </div>
  )
}
