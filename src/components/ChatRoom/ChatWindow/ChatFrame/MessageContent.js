import { SendOutlined, SmileFilled, SmileOutlined } from '@ant-design/icons'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Button, Input } from 'antd'
import Message from './Message'
import { AppContext } from '../../../../context/AppProvider'
import { addDocument, updateDocument } from '../../../../firebase/services'
import { AuthContext } from '../../../../context/AuthProvider'
import useFirestore from '../../../../hooks/useFirestore'
import { serverTimestamp } from 'firebase/firestore'
import Picker from 'emoji-picker-react'
import useMeasure from 'react-use-measure'

export default function MessageContent() {
  const { selectedRoom, members, userInfo } = useContext(AppContext)
  const {
    user: { uid, photoURL, displayName },
  } = useContext(AuthContext)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [userQueue, setUserQueue] = useState(true)
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false)
  const messageListRef = useRef(null)
  let inputTimeout
  const emojiContainRef = useRef(null)
  const inputRef = useRef(null)
  const [inputHeight, setInputHeight] = useState(0)
  const [ref, bounds] = useMeasure()

  const handleOpenEmojiPicker = () => {
    setEmojiPickerVisible(!emojiPickerVisible)
    if (inputRef?.current) {
      setTimeout(() => {
        inputRef.current.focus()
      })
    }
  }

  const handleClickOutsideEmojiPicker = e => {
    if (!emojiContainRef?.current?.contains(e.target)) {
      setEmojiPickerVisible(false)
    }
  }
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideEmojiPicker)
    return () =>
      document.removeEventListener('mousedown', handleClickOutsideEmojiPicker)
  })

  useEffect(() => {
    setInputHeight(bounds?.height)
  }, [bounds])

  const onEmojiClick = (event, emojiObject) => {
    setInputValue(`${inputValue} ${emojiObject?.emoji}`)
    if (inputRef?.current) {
      setTimeout(() => {
        inputRef.current.focus()
      })
    }
  }

  const handleInputChange = e => {
    setInputValue(e.target.value)
  }

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

  const handleOnSubmit = () => {
    if (
      // inputValue === ''||
      /((\r\n|\n|\r)$)|(^(\r\n|\n|\r))|^\s*$/gm.test(inputValue)
    ) {
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
      'newestMess.createdAt': serverTimestamp(),
      'newestMess.displayName': displayName,
      'newestMess.text': inputValue,
    })
    setInputValue('')
    setIsTyping(false)
    setEmojiPickerVisible(false)
    // focus to input again after submit
    if (inputRef?.current) {
      setTimeout(() => {
        inputRef.current.focus()
      })
    }
  }

  const handlePressEnter = e => {
    if (e.keyCode == 13) {
      e.preventDefault()
    }
    handleOnSubmit()
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
    <div
      // style={{
      //   backgroundImage: `url(${userInfo.coverPhotoURL})`,
      // }}
      className='messages-content'>
      <div
        className='messages-list'
        ref={messageListRef}
        style={{
          paddingBottom: `calc(3em + ${inputHeight}px - 44px)`,
        }}>
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
      <div
        className='typing'
        style={{
          bottom: `${inputHeight + 22}px`,
        }}>
        {selectedRoom.typing.user1.isTyping &&
        selectedRoom.typing.user1.uid !== uid ? (
          <p className='typing-text'>
            {`${selectedRoom.typing.user1.name} is tyiping...`}
          </p>
        ) : (
          ''
        )}

        {selectedRoom.typing.user2.isTyping &&
        selectedRoom.typing.user2.uid !== uid ? (
          <p className='typing-text'>
            {`${selectedRoom.typing.user2.name} is tyiping...`}
          </p>
        ) : (
          ''
        )}
      </div>

      {emojiPickerVisible ? (
        <div
          ref={emojiContainRef}
          className='emojis-container'
          style={{
            bottom: `${inputHeight + 12}px`,
          }}>
          <Picker disableSearchBar={true} onEmojiClick={onEmojiClick} />
        </div>
      ) : null}

      <div className='form-message'>
        <div className='input-container' ref={ref}>
          <Input.TextArea
            className='input'
            autoSize={true}
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onPressEnter={handlePressEnter}
            onKeyDown={handleKey}
            placeholder='Type your message here...'
            onFocus={e => {
              const temp_value = e.target.value
              e.target.value = ''
              e.target.value = temp_value
            }}
          />
        </div>

        <div className='btns'>
          <Button
            className='btn-open-emoji'
            onClick={handleOpenEmojiPicker}
            type='text'
            icon={
              emojiPickerVisible ? <SmileFilled /> : <SmileOutlined />
            }></Button>
          <Button
            className='btn-send'
            type='text'
            onClick={handleOnSubmit}
            disabled={!inputValue}
            icon={
              inputValue ? (
                <SendOutlined style={{ color: ' #0e497ce7' }} />
              ) : (
                <SendOutlined />
              )
            }></Button>
        </div>
      </div>
    </div>
  )
}
