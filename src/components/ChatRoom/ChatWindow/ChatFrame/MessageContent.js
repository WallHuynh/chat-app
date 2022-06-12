import { SendOutlined } from '@ant-design/icons'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Button, Form, Input, Typography } from 'antd'
import Message from './Message'
import { AppContext } from '../../../../Context/AppProvider'
import { addDocument, updateDocument } from '../../../../firebase/services'
import { AuthContext } from '../../../../Context/AuthProvider'
import useFirestore from '../../../../hooks/useFirestore'
import { serverTimestamp } from 'firebase/firestore'

const { Text } = Typography

export default function MessageContent() {
  const { selectedRoom, members } = useContext(AppContext)
  const {
    user: { uid, photoURL, displayName },
  } = useContext(AuthContext)
  const [inputValue, setInputValue] = useState('')
  const [form] = Form.useForm()

  const inputRef = useRef(null)
  const [isTyping, setIsTyping] = useState(false)
  const [userQueue, setUserQueue] = useState(true)
  const messageListRef = useRef(null)
  let inputTimeout

  const handleKey = () => {
    if (isTyping) {
      return
    } else {
      switch (true) {
        case selectedRoom.typing.user1.isTyping === false:
          updateDocument('rooms', selectedRoom.id, {
            'typing.user1.isTyping': true,
            'typing.user1.uid': uid,
            'typing.user1.name': displayName,
          })
          inputTimeout = setTimeout(() => {
            updateDocument('rooms', selectedRoom.id, {
              'typing.user1.isTyping': false,
              'typing.user1.uid': null,
              'typing.user1.name': null,
            })
          }, 5000)
          setIsTyping(true)
          break
        case selectedRoom.typing.user1.isTyping === true &&
          selectedRoom.typing.user2.isTyping === false:
          setUserQueue(false)
          updateDocument('rooms', selectedRoom.id, {
            'typing.user2.isTyping': true,
            'typing.user2.uid': uid,
            'typing.user2.name': displayName,
          })
          inputTimeout = setTimeout(() => {
            updateDocument('rooms', selectedRoom.id, {
              'typing.user2.isTyping': false,
              'typing.user2.uid': null,
              'typing.user2.name': null,
            })
          }, 5000)
          setIsTyping(true)
          break
        default:
          updateDocument('rooms', selectedRoom.id, {
            'typing.user1.isTyping': true,
            'typing.user1.uid': uid,
            'typing.user1.name': displayName,
          })
          inputTimeout = setTimeout(() => {
            updateDocument('rooms', selectedRoom.id, {
              'typing.user1.isTyping': false,
              'typing.user1.uid': null,
              'typing.user1.name': null,
            })
          }, 5000)
          setIsTyping(true)
      }
    }
  }

  useEffect(() => {
    if (selectedRoom.typing.user1.isTyping) {
      setTimeout(() => {
        updateDocument('rooms', selectedRoom.id, {
          'typing.user1.isTyping': false,
          'typing.user1.uid': null,
          'typing.user1.name': null,
        })
      }, 6000)
    }
    if (selectedRoom.typing.user2.isTyping) {
      setTimeout(() => {
        updateDocument('rooms', selectedRoom.id, {
          'typing.user2.isTyping': false,
          'typing.user2.uid': null,
          'typing.user2.name': null,
        })
      }, 6000)
    }
  }, [
    selectedRoom.typing.user1.isTyping,
    selectedRoom.typing.user2.isTyping,
    selectedRoom.id,
  ])

  const handleInputChange = e => {
    setInputValue(e.target.value)
  }

  const handleOnSubmit = () => {
    if (inputValue === '') {
      return
    }
    if (isTyping) {
      clearTimeout(inputTimeout)
      if (userQueue) {
        updateDocument('rooms', selectedRoom.id, {
          'typing.user1.isTyping': false,
          'typing.user1.uid': null,
          'typing.user1.name': null,
        })
      } else {
        updateDocument('rooms', selectedRoom.id, {
          'typing.user2.isTyping': false,
          'typing.user2.uid': null,
          'typing.user2.name': null,
        })
      }
    }
    addDocument('messages', {
      text: inputValue,
      uid,
      photoURL,
      roomId: selectedRoom.id,
      displayName,
    })
    updateDocument('rooms', selectedRoom.id, {
      'newestMess.createAt': serverTimestamp(),
      'newestMess.displayName': displayName,
      'newestMess.text': inputValue,
    })

    form.resetFields(['message'])
    setInputValue('')
    setIsTyping(false)

    // focus to input again after submit
    if (inputRef?.current) {
      setTimeout(() => {
        inputRef.current.focus()
      })
    }
  }

  const condition = React.useMemo(
    () => ({
      fieldName: 'roomId',
      operator: '==',
      compareValue: selectedRoom.id,
    }),
    [selectedRoom.id]
  )

  const messages = useFirestore('messages', condition)

  useEffect(() => {
    setTimeout(() => {
      if (members.length > 3) {
        updateDocument('rooms', selectedRoom.id, {
          'standByPhoto.lastThreeMembers': [
            {
              displayName: members[members.length - 1].displayName,
              photoURL: members[members.length - 1]?.photoURL || null,
            },
            {
              displayName: members[members.length - 2].displayName,
              photoURL: members[members.length - 2]?.photoURL || null,
            },
            {
              displayName: members[members.length - 3].displayName,
              photoURL: members[members.length - 3]?.photoURL || null,
            },
          ],
          'standByPhoto.groupLengthRest': members.length - 3,
        })
      } else if (members.length === 3) {
        updateDocument('rooms', selectedRoom.id, {
          'standByPhoto.lastThreeMembers': [
            {
              displayName: members[2].displayName,
              photoURL: members[2]?.photoURL || null,
            },
            {
              displayName: members[1].displayName,
              photoURL: members[1]?.photoURL || null,
            },
            {
              displayName: members[0].displayName,
              photoURL: members[0]?.photoURL || null,
            },
          ],
          'standByPhoto.groupLengthRest': null,
        })
      } else if (members.length === 2) {
        updateDocument('rooms', selectedRoom.id, {
          'standByPhoto.lastThreeMembers': [
            {
              uid: members[1].uid,
              displayName: members[1].displayName,
              photoURL: members[1]?.photoURL || null,
            },
            {
              uid: members[0].uid,
              displayName: members[0].displayName,
              photoURL: members[0]?.photoURL || null,
            },
          ],
          'standByPhoto.groupLengthRest': null,
        })
      } else if (members.length === 1) {
        updateDocument('rooms', selectedRoom.id, {
          'standByPhoto.lastThreeMembers': [
            {
              displayName: members[0].displayName,
              photoURL: members[0]?.photoURL || null,
            },
          ],
          'standByPhoto.groupLengthRest': null,
        })
      }
    }, 500)
  }, [members])

  useEffect(() => {
    // scroll to bottom after message changed
    if (messageListRef?.current) {
      messageListRef.current.scrollTop =
        messageListRef.current.scrollHeight + 50
    }
  }, [messages])

  return (
    <div className='messages-content'>
      <div className='messages-list' ref={messageListRef}>
        {messages.map(mes => (
          <Message
            key={mes.id}
            id={mes.uid}
            text={mes.text}
            photoURL={mes.photoURL}
            displayName={mes.displayName}
            createdAt={mes.createdAt}
          />
        ))}
      </div>

      <div className='typing'>
        {selectedRoom.typing.user1.isTyping &&
        selectedRoom.typing.user1.uid !== uid ? (
          <Text className='typing-text'>
            {`${selectedRoom.typing.user1.name} is tyiping...`}
          </Text>
        ) : (
          ''
        )}

        {selectedRoom.typing.user2.isTyping &&
        selectedRoom.typing.user2.uid !== uid ? (
          <Text className='typing-text'>
            {`${selectedRoom.typing.user2.name} is tyiping...`}
          </Text>
        ) : (
          ''
        )}
      </div>

      <Form className='form-send-messages' form={form}>
        <Form.Item name='message'>
          <Input
            ref={inputRef}
            onChange={handleInputChange}
            onPressEnter={handleOnSubmit}
            onKeyDown={handleKey}
            placeholder='Type your message here...'
            bordered={false}
            autoComplete='off'
          />
        </Form.Item>
        <Button
          type='primary'
          onClick={handleOnSubmit}
          disabled={!inputValue}
          icon={<SendOutlined />}>
          Send
        </Button>
      </Form>
    </div>
  )
}
