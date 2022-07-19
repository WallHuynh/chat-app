import React, { useContext, useState } from 'react'
import { Form, Modal, Input, Segmented, Select, Avatar } from 'antd'
import { ACTIONS, AppContext } from '../../context/AppProvider'
import { addDocument, updateDocument } from '../../firebase/services'
import { openNotification } from './FindFriendModal'
import {
  collection,
  getDocs,
  query,
  where,
  arrayUnion,
  documentId,
} from 'firebase/firestore'

import { db } from '../../firebase/config'
import { isEmpty } from 'lodash'

export default function AddRoomModal() {
  const { state, dispatch, userInfo } = useContext(AppContext)
  const [segmentValue, setSegmentValue] = useState('create')
  const [friendOptions, setFriendOptions] = useState([])
  const [selectedFriends, setSelectedFriends] = useState([])

  const [form] = Form.useForm()

  const onSegmentChange = value => {
    setSegmentValue(value)
  }

  const createRoom = async () => {
    if (form?.getFieldsValue()?.name) {
      const roomRef = await addDocument('rooms', {
        ...form.getFieldsValue(),
        members: isEmpty(selectedFriends)
          ? [userInfo.uid]
          : [userInfo.uid, ...selectedFriends],
        isAGroup: true,
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
      handleCancel()
    } else {
      return
    }
  }

  const joinRoom = async () => {
    if (form?.getFieldsValue()?.id) {
      const q = query(
        collection(db, 'rooms'),
        where(documentId(), '==', form?.getFieldsValue()?.id)
      )
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        const document = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }))[0]
        updateDocument('rooms', document.id, {
          members: arrayUnion(userInfo.uid),
        })
        dispatch({ type: ACTIONS.SELECTED_ROOM_ID, payload: document.id })
        handleCancel()
      } else {
        openNotification('top', 'Room not found', '')
      }
    } else {
      return
    }
  }

  const handleOk = () => {
    if (segmentValue === 'create') {
      createRoom()
    } else {
      joinRoom()
    }
  }

  const handleCancel = () => {
    form.resetFields()
    setSelectedFriends([])
    dispatch({ type: ACTIONS.TG_ADDROOM, payload: false })
  }

  const handleChangeSelect = value => {
    const arr = []
    value.forEach(element => {
      arr.push(element.value)
    })
    setSelectedFriends(arr)
  }

  const handleFocusSelect = async () => {
    if (userInfo.friends.length > 0) {
      const q = query(
        collection(db, 'users'),
        where('uid', 'in', userInfo.friends)
      )
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        const documents = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }))
        setFriendOptions(documents)
      }
    } else {
      openNotification('top', 'Your friend list is empty', '')
    }
  }

  return (
    <div>
      <Modal
        className='noselect'
        centered
        title={
          <Segmented
            value={segmentValue}
            onChange={onSegmentChange}
            options={[
              {
                label: 'Create room',
                value: 'create',
              },
              {
                label: 'Join room',
                value: 'join',
              },
            ]}
          />
        }
        visible={state.isAddRoomVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={400}
        okText={segmentValue === 'create' ? 'Create' : 'Join'}>
        <Form form={form} layout='vertical'>
          {segmentValue === 'create' ? (
            <>
              <Form.Item name='name'>
                <Input
                  onPressEnter={handleOk}
                  placeholder="Your room's name"
                  maxLength={40}
                />
              </Form.Item>
              <Select
                labelInValue
                onFocus={handleFocusSelect}
                mode='multiple'
                value={selectedFriends}
                notFoundContent={'You have no friend'}
                placeholder='Choose your friends'
                onChange={handleChangeSelect}
                style={{
                  width: '100%',
                }}>
                {friendOptions.map(opt => {
                  return (
                    <Select.Option
                      key={opt.uid}
                      value={opt.uid}
                      title={opt.displayName}>
                      <Avatar size='small' src={opt.photoURL}>
                        {opt.photoURL
                          ? ''
                          : opt.displayName?.charAt(0)?.toUpperCase()}
                      </Avatar>
                      {` ${opt.displayName}`}
                    </Select.Option>
                  )
                })}
              </Select>
            </>
          ) : (
            <Form.Item name='id'>
              <Input
                onPressEnter={handleOk}
                placeholder="Room's ID"
                maxLength={40}
              />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  )
}
