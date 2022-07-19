import React, { useContext, memo, useState, useEffect } from 'react'
import { Modal, Image, Avatar, Form, Input, Button } from 'antd'
import { ACTIONS, AppContext } from '../../context/AppProvider'
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
  const { userInfo, state, dispatch } = useContext(AppContext)
  const [showSendRequest, setShowSendRequest] = useState(false)
  const initialIsRequested = userInfo?.requestedTo?.includes(
    state.selectedUser?.uid
  )
  const [isRequested, setIsRequested] = useState(initialIsRequested)
  const initialIsFriend = userInfo?.friends?.includes(state.selectedUser?.uid)
  const [isFriend, setIsFriend] = useState(initialIsFriend)

  useEffect(() => {
    setIsRequested(initialIsRequested)
  }, [initialIsRequested, state.selectedUser])

  useEffect(() => {
    setIsFriend(initialIsFriend)
  }, [initialIsFriend, state.selectedUser])

  const handleCancel = () => {
    dispatch({ type: ACTIONS.TG_USER_INFO, payload: false })
    dispatch({ type: ACTIONS.SELECTED_USER, payload: {} })
    form.resetFields()
    setShowSendRequest(false)
    setIsRequested(false)
  }

  const handleConfirmFriendRequest = () => {
    updateDocument('users', userInfo.uid, {
      friends: arrayUnion(state.selectedUser.uid),
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
    updateDocument('users', state.selectedUser.uid, {
      requestedTo: arrayRemove(userInfo.uid),
      friends: arrayUnion(userInfo.uid),
    })

    // const statusRef = db.collection('status').doc(newFriend)
    // statusRef
    //   .delete()
    //   .then(() => console.log(`Status ${newFriend} was deleted`))
    //   .catch(error => console.error('Error removing document: ', error))
    deleteDocument('status', `${state.selectedUser.uid}-${userInfo.uid}`)
    openNotification(
      'top',
      `You and ${state.selectedUser.displayName} are friends now`
    )
  }

  const handleSendRequest = () => {
    const caption = form.getFieldValue().caption.trim()
    addDocument('status', {
      type: 'friend-request',
      receiveUid: state.selectedUser.uid,
      requestUser: {
        photoURL: userInfo.photoURL,
        displayName: userInfo.displayName,
        uid: userInfo.uid,
      },
      caption: caption,
      seen: false,
    })
    updateDocument('users', userInfo.uid, {
      requestedTo: arrayUnion(state.selectedUser.uid),
    })
    setIsRequested(true)
    setShowSendRequest(false)
    openNotification(
      'top',
      `Request was sent to ${state.selectedUser.displayName}`
    )
  }

  const handleRevokeRequest = () => {
    updateDocument('users', userInfo.uid, {
      requestedTo: arrayRemove(state.selectedUser.uid),
    })
    deleteDocument('status', `${userInfo.uid}-${state.selectedUser.uid}`)
    openNotification(
      'top',
      `Request to ${state.selectedUser.displayName} was revoked`
    )
  }

  const handleSendMess = async () => {
    const q = query(
      collection(db, 'rooms'),
      where('isAGroup', '==', false),
      where('members', 'in', [[state.selectedUser.uid, userInfo.uid]])
    )
    const querySnapshot = await getDocs(q)
    if (!querySnapshot.empty) {
      const documents = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      }))[0]
      dispatch({ type: ACTIONS.SELECTED_ROOM_ID, payload: documents.id })
      handleCancel()
    } else {
      const roomRef = await addDocument('rooms', {
        members: [state.selectedUser.uid, userInfo.uid],
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
              displayName: userInfo.displayName,
              photoURL: userInfo.photoURL || null,
            },
          ],
          groupLengthRest: null,
        },
      })
      dispatch({ type: ACTIONS.SELECTED_ROOM_ID, payload: roomRef.id })
    }
    if (state.viewWidth < 600 && state.viewWidth !== 0) {
      dispatch({ type: ACTIONS.TG_GROUP_INFOR, payload: false })
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
    dispatch({ type: ACTIONS.TG_ACCOUNT, payload: true })
  }

  return (
    <div>
      <Modal
        className='user-info noselect'
        centered
        bodyStyle={{ padding: '0' }}
        width={350}
        footer={
          <>
            {state.selectedUser.uid === userInfo.uid ? (
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
                    onClick={() =>
                      dispatch({ type: ACTIONS.TG_UNFRIEND, payload: true })
                    }
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
                ) : state.selectedUser?.requestedTo?.includes(userInfo.uid) ? (
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
        visible={state.userInfoVisible}
        onCancel={handleCancel}>
        <div className='avt-wrapper'>
          <Image
            className='cover-photo'
            src={state.selectedUser.coverPhotoURL}></Image>
          <div className='circle-avt'>
            {state.selectedUser.photoURL ? (
              <Image
                src={state.selectedUser.photoURL}
                width={100}
                rootClassName='image-avt'
                className='noselect'
              />
            ) : (
              <Avatar size='large' className='avatar noselect'>
                {state.selectedUser.displayName?.charAt(0)?.toUpperCase()}
              </Avatar>
            )}
          </div>
        </div>
        <div className='info'>
          <p className='name'>{state.selectedUser.displayName}</p>
          {showSendRequest ? (
            <Form form={form} layout='vertical'>
              <Form.Item
                name='caption'
                initialValue={`Hi, I am ${userInfo.displayName}`}>
                <Input.TextArea
                  size='small'
                  autoSize={true}
                  className='input-send-request'
                  maxLength={300}
                  showCount={true}
                  value={`Hi, I am ${userInfo.displayName}`}
                />
              </Form.Item>
            </Form>
          ) : (
            <p className='email'>
              <span className='tag'>Email: </span>
              {state.selectedUser.email}
            </p>
          )}
        </div>
      </Modal>
    </div>
  )
})
