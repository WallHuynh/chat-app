import { PlusCircleOutlined, SendOutlined } from '@ant-design/icons'
import React, { useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Button, Tooltip, Avatar, Form, Input, Alert, Typography } from 'antd'
import Message from './Message'
import { AppContext } from '../../../../Context/AppProvider'
import { addDocument, updateDocument } from '../../../../firebase/services'
import { AuthContext } from '../../../../Context/AuthProvider'
import useFirestore from '../../../../hooks/useFirestore'
import { serverTimestamp } from 'firebase/firestore'
import Header from './Header'

const ContentStyled = styled.div`
  font-family: 'Montserrat', sans-serif;
  background-color: #e6f2ff;
  height: calc(100% - 56px);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
`

const FormStyled = styled(Form)`
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 2px 2px 0;
  border: 1px solid rgb(230, 230, 230);
  border-radius: 2px;
  font-family: 'Montserrat', sans-serif;

  .ant-form-item {
    flex: 1;
    margin-bottom: 0;
  }
`

const MessageListStyled = styled.div`
  font-family:'Montserrat', sans-serif;
  max-height: calc(100%-30px)
  min-height: calc(100%-30px)
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 0 0 20px 0;

  &::-webkit-scrollbar {
    width: 8px;
    background: rgba(0, 0, 0, 0);
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    :hover {
      background-color: rgba(0, 0, 0, 0.6);
    }
  }

  .graper{
    max-width: 100%;
    min-width: 100%;
    margin: 10px 0 5px 0;
    padding: 5px;
    .contents {
      box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
      width: fit-content;
      max-width: 70%;
      height: auto;
      border-radius: 7px;
      padding: 10px 12px 10px 12px;
      word-wrap: break-word;
      .name{
        color: gray;
        font-size: 12px;
      }
      .message{
        font-size: 14px;
        color: black;
        font-weight: 400;
        margin-bottom: 0;
      }
      .time-stamp{
        font-size: 10px;
        color: gray;
      }
    }
    .right{
      background-color: rgba(25,147,147,0.2);
      float: right;
    }
    .left {
      background-color: white;
    }
  }
`
const TypingStyled = styled.div`
  height: 20px;
  width: auto;
  margin-left: 15px;
  position: absolute;
  bottom: 40px;
  background-color: white;
  opacity: 0.8;
`
const TextStyled = styled(Text)`
  margin-right: 10px;
  background-image: linear-gradient(
    to right,
    #095fab 10%,
    #25abe8 50%,
    #57d75b 60%
  );
  background-size: auto auto;
  background-clip: border-box;
  background-size: 200% auto;
  color: #fff;
  background-clip: text;
  text-fill-color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: textclip 2s linear infinite;
  display: inline-block;

  @keyframes textclip {
    to {
      background-position: 200% center;
    }
  }
`

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
    <ContentStyled>
      <MessageListStyled ref={messageListRef}>
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
      </MessageListStyled>

      <TypingStyled>
        {selectedRoom.typing.user1.isTyping &&
        selectedRoom.typing.user1.uid !== uid ? (
          <TextStyled>
            {`${selectedRoom.typing.user1.name} is tyiping...`}
          </TextStyled>
        ) : (
          ''
        )}

        {selectedRoom.typing.user2.isTyping &&
        selectedRoom.typing.user2.uid !== uid ? (
          <TextStyled>
            {`${selectedRoom.typing.user2.name} is tyiping...`}
          </TextStyled>
        ) : (
          ''
        )}
      </TypingStyled>

      <FormStyled form={form}>
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
      </FormStyled>
    </ContentStyled>
  )
}
