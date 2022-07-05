import React, { useContext, useState } from 'react'
import { Form, Modal, Input, Button, Segmented, Select, Avatar } from 'antd'
import { AppContext } from '../../context/AppProvider'
import { addDocument, updateDocument } from '../../firebase/services'
import { AuthContext } from '../../context/AuthProvider'
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
import { async } from '@firebase/util'

export default function AddRoomModal() {
  const { isAddRoomVisible, setIsAddRoomVisible, setSelectedRoomId, userInfo } =
    useContext(AppContext)
  const [segmentValue, setSegmentValue] = useState('create')
  const [friendOptions, setFriendOptions] = useState([])
  const {
    user: { uid, displayName, photoURL },
  } = useContext(AuthContext)
  const [form] = Form.useForm()

  const onSegmentChange = value => {
    setSegmentValue(value)
  }

  const createRoom = async () => {
    if (form?.getFieldsValue()?.name) {
      const roomRef = await addDocument('rooms', {
        ...form.getFieldsValue(),
        members: [uid],
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
              displayName: displayName,
              photoURL: photoURL || null,
            },
          ],
          groupLengthRest: null,
        },
      })
      setSelectedRoomId(roomRef.id)
      handleCancel()
    } else {
      return
    }
  }

  const joinRoom = async () => {
    console.log(form.getFieldValue().id)
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
        setSelectedRoomId(document.id)
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
    setIsAddRoomVisible(false)
  }

  const handleChangeSelect = value => {
    console.log(`Selected: ${value}`)
  }

  const handleFocusSelect = async () => {
    if (userInfo.friends.length > 0) {
      const q = query(
        collection(db, 'users'),
        where('uid', 'in', userInfo.friends)
      )
      const querySnapshot = await getDocs(q)
      console.log(querySnapshot)

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
      visible={isAddRoomVisible}
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
              onFocus={handleFocusSelect}
              mode='multiple'
              placeholder='Choose your friends'
              defaultValue={[]}
              onChange={handleChangeSelect}
              style={{
                width: '100%',
              }}>
              {friendOptions.map(opt => {
                ;<Select.Option key={opt.uid} value={opt.uid} title={opt.name}>
                  <Avatar size='small' src={opt.photoURL}>
                    {opt.photoURL ? '' : opt.name?.charAt(0)?.toUpperCase()}
                  </Avatar>
                  {` ${opt.name}`}
                </Select.Option>
              })}
            </Select>
          </>
        ) : (
          <Form.Item name='id'>
            <Input
              onPressEnter={handleOk}
              placeholder="Your room's ID"
              maxLength={40}
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  )
}
