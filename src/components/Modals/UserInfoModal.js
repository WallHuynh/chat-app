import React, { useContext, memo, useState, useEffect } from 'react'
import { Modal, Image, Avatar, Form, Input, Button } from 'antd'
import { AppContext } from '../../context/AppProvider'
import { AuthContext } from '../../context/AuthProvider'
import styled from 'styled-components'
import {
  UserDeleteOutlined,
  MessageOutlined,
  UserAddOutlined,
  SendOutlined,
  ArrowLeftOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { addDocument, updateDocument } from '../../firebase/services'
import { arrayUnion } from 'firebase/firestore'

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
      color: black;
      :hover {
        font-weight: 600;
        border: solid 1px green;
        color: green;
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
      margin: 0 15px 0 15px;
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
    members,
  } = useContext(AppContext)
  const {
    user: { uid, displayName, photoURL, userInfo },
  } = useContext(AuthContext)

  const [userInfoRef, setUserInfoRef] = useState(userInfo)
  const [showSendRequest, setShowSendRequest] = useState(false)
  const initialIsRequested = userInfoRef?.requestedTo?.includes(
    selectedUser.uid
  )
  const [isRequested, setIsRequested] = useState(initialIsRequested)
  const initialIsFriend = userInfoRef?.friends?.includes(selectedUser.uid)
  const [isFriend, setIsFriend] = useState(initialIsFriend)

  console.log('isrequest', isRequested)
  console.log('isfriend', isFriend)
  console.log('userInfo', userInfoRef)

  useEffect(() => {
    const userRef = members.filter(member => member.uid === uid)[0]
    setUserInfoRef(userRef)
  }, [selectedUser])

  useEffect(() => {
    setIsRequested(initialIsRequested)
  }, [initialIsRequested, selectedUser])

  useEffect(() => {
    setIsFriend(initialIsFriend)
  }, [initialIsFriend, selectedUser])

  const handleCancel = () => {
    setUserInfoVisible(false)
    setSelectedUser({})
    form.resetFields()
    setShowSendRequest(false)
    setIsRequested(false)
  }

  const handleSendRequest = () => {
    const caption = form.getFieldValue().caption.trim()
    console.log(caption)
    addDocument('status', {
      type: 'friend-request',
      receiveUid: selectedUser.uid,
      requestUser: { photoURL: photoURL, displayName: displayName, uid: uid },
      caption: caption,
      seen: false,
    })
    updateDocument('users', uid, {
      requestedTo: arrayUnion(selectedUser.uid),
    })
    setIsRequested(true)
    setShowSendRequest(false)
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

  // const isFriend = selectedUser?.friends?.some(id => id === uid)

  return (
    <div>
      <ModalStyled
        className='noselect'
        centered
        bodyStyle={{ padding: '0' }}
        width={350}
        footer={
          <>
            {selectedUser.uid === uid ? (
              <Button
                icon={<SettingOutlined />}
                className='friend-btn'
                onClick={handleOpenUserAccount}>
                Modify my account info
              </Button>
            ) : showSendRequest ? (
              <>
                <Button
                  icon={<ArrowLeftOutlined />}
                  className='friend-btn'
                  onClick={handleBackToPrevious}>
                  Back
                </Button>
                <Button
                  icon={<SendOutlined />}
                  className='friend-btn'
                  onClick={handleSendRequest}>
                  Send request
                </Button>
              </>
            ) : (
              <>
                <Button icon={<MessageOutlined />} className='friend-btn'>
                  Send message
                </Button>
                {isFriend ? (
                  <Button icon={<UserDeleteOutlined />} className='friend-btn'>
                    Unfriend
                  </Button>
                ) : isRequested ? (
                  <Button icon={<SendOutlined />} disabled>
                    Request was sent
                  </Button>
                ) : (
                  <Button
                    icon={<UserAddOutlined />}
                    className='friend-btn'
                    onClick={handleShowSendRequest}>
                    Add friend
                  </Button>
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
              <Form.Item
                name='caption'
                initialValue={`Hi, I am ${displayName}`}>
                <Input.TextArea
                  size='small'
                  autoSize={true}
                  className='input-send-request'
                  maxLength={300}
                  showCount={true}
                  value={`Hi, I am ${displayName}`}
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
