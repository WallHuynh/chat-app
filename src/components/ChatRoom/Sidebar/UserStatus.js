import { CheckOutlined, DeleteOutlined, LeftOutlined } from '@ant-design/icons'
import { Avatar, Button, Col, Row, Tooltip } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../../context/AppProvider'
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict'
import { deleteDocument, updateDocument } from '../../../firebase/services'
import { AuthContext } from '../../../context/AuthProvider'
import { arrayRemove, arrayUnion } from 'firebase/firestore'

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

  const [statusData, setStatusData] = useState([])

  useEffect(() => {
    const sortStatusDataByTimestamp = () => {
      const sorted = [...status].sort((a, b) => b['createdAt'] - a['createdAt'])
      setStatusData(sorted)
    }
    sortStatusDataByTimestamp()
  }, [status])

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
    <div className='status-graper noselect'>
      <div className='header'>
        <Button
          onClick={handleCancelStatus}
          className='btn-left'
          type='text'
          icon={<LeftOutlined />}></Button>
        <p className='title'>Status</p>
      </div>
      <div className='status-list'>
        {statusData.map(eachStatus => (
          <div className='status' key={eachStatus.requestUser.uid}>
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
          </div>
        ))}
      </div>
    </div>
  )
}
