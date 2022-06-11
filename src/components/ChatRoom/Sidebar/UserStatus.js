import { CheckOutlined, DeleteOutlined, LeftOutlined } from '@ant-design/icons'
import { Avatar, Button, Col, Row, Tooltip } from 'antd'
import React, { useContext } from 'react'
import styled from 'styled-components'
import { AppContext } from '../../../Context/AppProvider'
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict'
import { deleteDocument, updateDocument } from '../../../firebase/services'
import { AuthContext } from '../../../Context/AuthProvider'
import { arrayRemove, arrayUnion, doc } from 'firebase/firestore'

const UserStatusStyled = styled.div`
  height: calc(100% - 70px);
  background-color: white;
`
const HeaderStyled = styled.div`
  display: flex;
  height: 56px;
  padding: 0 16px;
  align-items: center;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px,
    rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
  .title {
    margin: 0 0 0 -15px;
    font-weight: 600;
    font-size: 16px;
    flex-basis: 90%;
    text-align: center;
  }
  .btn-left {
    align-selft: flex-start;
    :hover {
      background-color: rgba(126, 166, 206, 0.2);
    }
  }
`
const StatusList = styled.div`
  max-height: calc(100% - 56px);
  min-height: calc(100% - 56px);
  overflow-y: scroll;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  padding: 10px 0 10px 0;
  &::-webkit-scrollbar {
    width: 6px;
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 4px;
  }
`

const StatusStyled = styled.div`
  max-height: 90px;
  min-height: 90px;
  width: 100%;
  padding: 0 0 5px 0;
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px,
    rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
  :hover {
    background-color: rgba(224, 235, 235, 0.5);
  }
  .avt {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .ant-avatar-lg {
      width: 64px;
      height: 64px;
      text-align: center;
      .ant-avatar-string {
        top: 15%;
        font-size: 30px;
      }
    }
  }
  .content {
    margin: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-wrap: no-wrap;
    .name {
      font-size: 18px;
      font-weight: 600;
    }
    .caption {
      font-weight: 300;
    }
    .name,
    .caption {
      margin: 0;
      padding: 0;
      width: fit-content;
      max-width: 100%;
      font-family: 'Montserrat', sans-serif;
      color: #515151;
      text-overflow: ellipsis;
      overflow-x: hidden;
      white-space: nowrap;
    }
  }
  .time-stamp {
    height: 100%;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
    flex-wrap: no-wrap;
    p {
      color: #515151;
      font-family: 'Open Sans', sans-serif;
      font-size: 10px;
    }
    .status-btn {
      width: 35px;
      height: 35px;
    }
    p,
    .status-btn {
      align-self: center;
      padding: 0;
      margin: 0;
      :hover {
        background-color: rgba(224, 235, 235, 1);
      }
    }
  }
`

const formatNSecondsToSevaralSeconds = timeLineSeconds => {
  let formatTime = formatDistanceToNowStrict(new Date(timeLineSeconds * 1000))
  if (formatTime?.includes('seconds') || formatTime?.includes('second')) {
    formatTime = 'recently'
  }
  return formatTime
}

export default function UserStatus() {
  const { setShowUserStatus, status } = React.useContext(AppContext)
  const {
    user: { uid },
  } = useContext(AuthContext)

  const handleCancelStatus = () => {
    setShowUserStatus(false)
  }

  const handleConfirmFriendRequest = eachStatus => {
    updateDocument('users', uid, {
      friends: arrayUnion(eachStatus.requestUser.uid),
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
    updateDocument('users', eachStatus.requestUser.uid, {
      requestedTo: arrayRemove(uid),
      friends: arrayUnion(uid),
    })

    // const statusRef = db.collection('status').doc(newFriend)
    // statusRef
    //   .delete()
    //   .then(() => console.log(`Status ${newFriend} was deleted`))
    //   .catch(error => console.error('Error removing document: ', error))
    deleteDocument('status', eachStatus.requestUser.uid)
  }

  const handleDeleteFriendRequest = eachStatus => {
    deleteDocument('status', eachStatus.requestUser.uid)
    //Cloud Functions without credit card below :(
    updateDocument('users', eachStatus.requestUser.uid, {
      requestedTo: arrayRemove(uid),
    })
  }
  return (
    <UserStatusStyled className='noselect'>
      <HeaderStyled>
        <Button
          onClick={handleCancelStatus}
          className='btn-left'
          type='text'
          icon={<LeftOutlined />}></Button>
        <p className='title'>Status</p>
      </HeaderStyled>
      <StatusList>
        {status.map(eachStatus => (
          <StatusStyled key={eachStatus.requestUser.uid}>
            <Row>
              <Col span={6}>
                <div className='avt'>
                  <Avatar size='large' src={eachStatus.requestUser.photoURL}>
                    {eachStatus.requestUser.photoURL
                      ? ''
                      : eachStatus.requestUser.displayName
                          ?.charAt(0)
                          ?.toUpperCase()}
                  </Avatar>
                </div>
              </Col>
              <Col span={14}>
                <div className='content'>
                  <p className='name'>{eachStatus.requestUser.displayName}</p>
                  <p className='caption'>{eachStatus.caption}</p>
                </div>
              </Col>
              <Col span={4}>
                <div className='time-stamp'>
                  <p>
                    {formatNSecondsToSevaralSeconds(
                      eachStatus.createdAt.seconds
                    )}
                  </p>
                  <Tooltip placement='left' title='Confirm' color='#b8a3f5'>
                    <Button
                      onClick={() => handleConfirmFriendRequest(eachStatus)}
                      className='status-btn'
                      icon={<CheckOutlined />}
                      type='text'></Button>
                  </Tooltip>
                  <Tooltip placement='left' title='Delete' color='#b8a3f5'>
                    <Button
                      onClick={() => handleDeleteFriendRequest(eachStatus)}
                      className='status-btn'
                      icon={<DeleteOutlined />}
                      type='text'></Button>
                  </Tooltip>
                </div>
              </Col>
            </Row>
          </StatusStyled>
        ))}
      </StatusList>
    </UserStatusStyled>
  )
}
