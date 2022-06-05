import React, { useContext, memo, useState } from 'react'
import { Modal, Image, Avatar, Form, Input } from 'antd'
import { AppContext } from '../../Context/AppProvider'
import { AuthContext } from '../../Context/AuthProvider'
import styled from 'styled-components'
import {
  UserDeleteOutlined,
  MessageOutlined,
  UserAddOutlined,
  SendOutlined,
  ArrowLeftOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { tuple } from 'antd/lib/_util/type'

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
  .ant-modal-body {
    max-height: 330px;
    overflow-y: scroll;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      width: 2px;
      background: rgba(0, 0, 0, 0);
    }
    &::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.6);
      border-radius: 0.2px;
    }
  }
  .ant-modal-footer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 10px;
    height: 50px;
    .friend-btn {
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
    background-color: lightgray;
    height: 150px;
    position: relative;
    .avatar,
    .ant-image {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translate(-40px, 40px);
    }
    .ant-image,
    .ant-image-mask {
      border-radius: 50%;
      overflow: hidden;
      perspective: 1px;
    }
    .avatar > .ant-avatar-string {
      font-size: 40px;
      top: 25%;
    }
  }
  .info {
    height: 180px;
    padding-top: 45px;
    .name {
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
    .input-send-request {
      margin: 0 10px 0 10px;
    }
  }
`

export default memo(function UserInfoModal() {
  const [form] = Form.useForm()
  const {
    userInfoVisible,
    setUserInfoVisible,
    selectedUser,
    setSelectedUser,
    setUserAccountVisible,
  } = useContext(AppContext)
  const {
    user: { uid, displayName, photoURL },
  } = useContext(AuthContext)
  const [showSendRequest, setShowSendRequest] = useState(false)

  const handleCancel = () => {
    setUserInfoVisible(false)
    setSelectedUser({})
    form.resetFields()
    setShowSendRequest(false)
  }
  const handleSendRequest = () => {
    console.log('sent')
  }

  const handleShowSendRequest = () => {
    setShowSendRequest(true)
  }

  const handleBackToPrevious = () => {
    setShowSendRequest(false)
  }

  const handleOpenUserAccount = () => {
    handleCancel()
    setUserAccountVisible(true)
  }

  const isFriend = selectedUser?.friends?.some(id => id === uid)

  return (
    <div>
      <ModalStyled
        centered
        bodyStyle={{ padding: '0' }}
        width={350}
        footer={
          <>
            {selectedUser.uid === uid ? (
              <button className='friend-btn' onClick={handleOpenUserAccount}>
                <SettingOutlined /> Modify my account info
              </button>
            ) : showSendRequest ? (
              <>
                <button className='friend-btn' onClick={handleBackToPrevious}>
                  <ArrowLeftOutlined /> Back
                </button>
                <button className='friend-btn' onClick={handleSendRequest}>
                  <SendOutlined /> Send request
                </button>
              </>
            ) : (
              <>
                <button className='friend-btn'>
                  <MessageOutlined /> Send message
                </button>
                {isFriend ? (
                  <button className='friend-btn'>
                    <UserDeleteOutlined /> Unfriend
                  </button>
                ) : (
                  <button
                    className='friend-btn'
                    onClick={handleShowSendRequest}>
                    <UserAddOutlined /> Add friend
                  </button>
                )}
              </>
            )}
          </>
        }
        title='User info'
        visible={userInfoVisible}
        onCancel={handleCancel}>
        <div className='cover-photo'>
          {selectedUser.photoURL ? (
            <Image src={selectedUser.photoURL} width={80} />
          ) : (
            <Avatar size='large' className='avatar'>
              {selectedUser.displayName?.charAt(0)?.toUpperCase()}
            </Avatar>
          )}
        </div>
        <div className='info'>
          <p className='name'>{selectedUser.displayName}</p>
          {showSendRequest ? (
            <Form form={form} layout='vertical'>
              <Form.Item label='Name' name='name'>
                <Input.TextArea
                  size='small'
                  autoSize={true}
                  className='input-send-request'
                  maxLength={300}
                  showCount={true}
                  defaultValue={`Hi, I am ${displayName}`}
                />
              </Form.Item>
            </Form>
          ) : (
            <p className='email'>
              <span className='tag'>Email: </span>
              {selectedUser.email}
            </p>
          )}
        </div>
      </ModalStyled>
    </div>
  )
})
