import { CheckOutlined, DeleteOutlined, LeftOutlined } from '@ant-design/icons'
import { Avatar, Button, Tooltip } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../../context/AppProvider'
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict'
import { deleteDocument, updateDocument } from '../../../firebase/services'
import { AuthContext } from '../../../context/AuthProvider'
import { arrayRemove, arrayUnion } from 'firebase/firestore'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../../firebase/config'
import { openNotification } from '../../Modals/FindFriendModal'

const formatNSecondsToSevaralSeconds = timeLineSeconds => {
  let formatTime = formatDistanceToNowStrict(new Date(timeLineSeconds * 1000))
  if (formatTime?.includes('seconds') || formatTime?.includes('second')) {
    formatTime = 'recently'
  }
  return formatTime
}

export default function FriendRequest() {
  const {
    setShowUserStatus,
    status,
    setSelectedUser,
    setUserInfoVisible,
    userInfo,
  } = React.useContext(AppContext)
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

  const handleClick = async uid => {
    const q = query(collection(db, 'users'), where('uid', '==', uid))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      const documents = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      }))[0]
      setSelectedUser(documents)
      setUserInfoVisible(true)
    } else {
      openNotification('bottom', 'User not found', '')
    }
  }

  const handleConfirmFriendRequest = eachStatus => {
    openNotification('top', `Request was accepted`)
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

    deleteDocument('status', `${eachStatus.requestUser.uid}-${userInfo.uid}`)
  }

  const handleDeleteFriendRequest = eachStatus => {
    deleteDocument('status', `${eachStatus.requestUser.uid}-${userInfo.uid}`)
    updateDocument('users', eachStatus.requestUser.uid, {
      requestedTo: arrayRemove(uid),
    })
    openNotification('top', 'Request was deleted')
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
      <div className='request-list'>
        {statusData.map(eachStatus => (
          <div
            className='request'
            onClick={() => handleClick(eachStatus.requestUser.uid)}
            key={eachStatus.requestUser.uid}>
            <div className='avt'>
              <Avatar size='large' src={eachStatus.requestUser.photoURL}>
                {eachStatus.requestUser.photoURL
                  ? ''
                  : eachStatus.requestUser.displayName
                      ?.charAt(0)
                      ?.toUpperCase()}
              </Avatar>
            </div>

            <div className='content'>
              <p className='name'>{eachStatus.requestUser.displayName}</p>
              <p className='caption'>{eachStatus.caption}</p>
            </div>

            <div className='time-stamp'>
              <p>
                {formatNSecondsToSevaralSeconds(eachStatus.createdAt.seconds)}
              </p>
              <Tooltip placement='left' title='Accept' color='#b8a3f5'>
                <Button
                  onClick={e => {
                    e.stopPropagation()
                    handleConfirmFriendRequest(eachStatus)
                  }}
                  className='status-btn'
                  icon={<CheckOutlined />}
                  type='text'></Button>
              </Tooltip>
              <Tooltip placement='left' title='Delete' color='#b8a3f5'>
                <Button
                  onClick={e => {
                    e.stopPropagation()
                    handleDeleteFriendRequest(eachStatus)
                  }}
                  className='status-btn'
                  icon={<DeleteOutlined />}
                  type='text'></Button>
              </Tooltip>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
