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
  CloseOutlined,
} from '@ant-design/icons'
import {
  addDocument,
  deleteDocument,
  updateDocument,
} from '../../firebase/services'
import { openNotification } from './FindFriendModal'
import { arrayRemove, arrayUnion } from 'firebase/firestore'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../firebase/config'
import './Modals.scss'

export default memo(function UserInfoModal() {
  const [form] = Form.useForm()
  const {
    setOpenGroupInfo,
    viewWidth,
    userInfoVisible,
    setUserInfoVisible,
    selectedUser,
    setSelectedUser,
    setUserAccountVisible,
    userInfo,
    setModalUnfiendVisible,
    setSelectedRoomId,
  } = useContext(AppContext)
  const {
    user: { uid, displayName, photoURL },
  } = useContext(AuthContext)

  const [showSendRequest, setShowSendRequest] = useState(false)
  const initialIsRequested = userInfo?.requestedTo?.includes(selectedUser.uid)
  const [isRequested, setIsRequested] = useState(initialIsRequested)
  const initialIsFriend = userInfo?.friends?.includes(selectedUser.uid)
  const [isFriend, setIsFriend] = useState(initialIsFriend)
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

  const handleConfirmFriendRequest = () => {
    updateDocument('users', userInfo.uid, {
      friends: arrayUnion(selectedUser.uid),
    })

    //Cloud Functions without credit card below :(
    // const userRequestRef = db.collection('users').doc(newFriend)
    // userRequestRef
    //   .update({
    //     requestedTo: admin.firestore.FieldValue.arrayRemove(uid),
    //     friends: admin.firestore.FieldValue.arrayUnion(uid),
    //   })
    //   .then(() => console.log(`User ${newFriend} was updated`))
    //   .catch(error => console.log(`Update error:`, error))
    updateDocument('users', selectedUser.uid, {
      requestedTo: arrayRemove(userInfo.uid),
      friends: arrayUnion(userInfo.uid),
    })

    // const statusRef = db.collection('status').doc(newFriend)
    // statusRef
    //   .delete()
    //   .then(() => console.log(`Status ${newFriend} was deleted`))
    //   .catch(error => console.error('Error removing document: ', error))
    deleteDocument('status', `${selectedUser.uid}-${userInfo.uid}`)
    openNotification(
      'top',
      `You and ${selectedUser.displayName} are friends now`
    )
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
    openNotification('top', `Request was sent to ${selectedUser.displayName}`)
  }

  const handleRevokeRequest = () => {
    updateDocument('users', uid, {
      requestedTo: arrayRemove(selectedUser.uid),
    })
    deleteDocument('status', `${userInfo.uid}-${selectedUser.uid}`)
    openNotification(
      'top',
      `Request to ${selectedUser.displayName} was revoked`
    )
  }

  const handleSendMess = async () => {
    const q = query(
      collection(db, 'rooms'),
      where('isAGroup', '==', false),
      where('members', 'in', [[selectedUser.uid, userInfo.uid]])
    )
    const querySnapshot = await getDocs(q)
    if (!querySnapshot.empty) {
      const documents = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      }))[0]
      setSelectedRoomId(documents.id)
      handleCancel()
    } else {
      const roomRef = await addDocument('rooms', {
        members: [selectedUser.uid, userInfo.uid],
        isAGroup: false,
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
    }
    if (viewWidth < 600 && viewWidth !== 0) {
      setOpenGroupInfo(false)
    }
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

  return (
    <Modal
      className='user-info noselect'
      centered
      bodyStyle={{ padding: '0' }}
      width={350}
      footer={
        <>
          {selectedUser.uid === uid ? (
            <Button
              icon={<SettingOutlined />}
              className='btn-primary'
              onClick={handleOpenUserAccount}>
              Modify my account info
            </Button>
          ) : showSendRequest ? (
            <>
              <Button
                icon={<ArrowLeftOutlined />}
                className='btn-primary'
                onClick={handleBackToPrevious}>
                Back
              </Button>
              <Button
                icon={<SendOutlined />}
                className='btn-primary'
                onClick={handleSendRequest}>
                Send request
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleSendMess}
                icon={<MessageOutlined />}
                className='btn-primary'>
                Send message
              </Button>
              {isFriend ? (
                <Button
                  onClick={() => setModalUnfiendVisible(true)}
                  icon={<UserDeleteOutlined />}
                  className='btn-primary'>
                  Unfriend
                </Button>
              ) : isRequested ? (
                <Button
                  onClick={handleRevokeRequest}
                  icon={<CloseOutlined />}
                  className='btn-primary'>
                  Revoke request
                </Button>
              ) : selectedUser?.requestedTo?.includes(userInfo.uid) ? (
                <Button
                  icon={<UserAddOutlined />}
                  className='btn-primary'
                  onClick={handleConfirmFriendRequest}>
                  Accept
                </Button>
              ) : (
                <Button
                  icon={<UserAddOutlined />}
                  className='btn-primary'
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
      <div className='avt-wrapper'>
        <Image className='cover-photo' src={selectedUser.coverPhotoURL}></Image>
        <div className='circle-avt'>
          {selectedUser.photoURL ? (
            <Image
              src={selectedUser.photoURL}
              width={100}
              rootClassName='image-avt'
              className='noselect'
            />
          ) : (
            <Avatar size='large' className='avatar noselect'>
              {selectedUser.displayName?.charAt(0)?.toUpperCase()}
            </Avatar>
          )}
        </div>
      </div>
      <div className='info'>
        <p className='name'>{selectedUser.displayName}</p>
        {showSendRequest ? (
          <Form form={form} layout='vertical'>
            <Form.Item name='caption' initialValue={`Hi, I am ${displayName}`}>
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
    </Modal>
  )
})
