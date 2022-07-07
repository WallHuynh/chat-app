import React, { useContext, useEffect, useState } from 'react'
import { Avatar, Button, Dropdown, Menu } from 'antd'
import { AppContext } from '../../../context/AppProvider'
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict'
import { AuthContext } from '../../../context/AuthProvider'
import {
  MoreOutlined,
  PushpinFilled,
  UserAddOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons'
import { updateDocument } from '../../../firebase/services'
import { arrayRemove, arrayUnion } from 'firebase/firestore'
import { isEmpty } from 'lodash'

const formatNSecondsToSevaralSeconds = timeLineSeconds => {
  let formatTime = formatDistanceToNowStrict(new Date(timeLineSeconds * 1000))
  if (formatTime?.includes('seconds') || formatTime?.includes('second')) {
    formatTime = 'recently'
  }
  return formatTime
}

export default function RoomList() {
  const {
    rooms,
    setSelectedRoomId,
    selectedRoom,
    userInfo,
    setModalConfirmLeaveVisible,
    setSelectedRoomLeave,
  } = useContext(AppContext)
  const {
    user: { uid },
  } = useContext(AuthContext)
  const [roomsData, setRoomData] = useState([])

  useEffect(() => {
    const sortPinRoomsByTimeStamp = () => {
      const pinnedRoomsId = userInfo.pinnedRoomsId
      const sortedNormalRooms = [...rooms]
        .filter(room => !pinnedRoomsId?.includes(room.id))
        .sort((a, b) => b['newestMess'].createdAt - a['newestMess'].createdAt)

      const pinnedRooms = [...rooms].filter(room =>
        pinnedRoomsId?.includes(room.id)
      )
      setRoomData(pinnedRooms.concat(sortedNormalRooms))
    }
    sortPinRoomsByTimeStamp()
  }, [rooms, userInfo])

  const handlePin = roomId => {
    updateDocument('users', userInfo.uid, {
      pinnedRoomsId: arrayUnion(roomId),
    })
  }
  const handleUnpin = roomId => {
    updateDocument('users', userInfo.uid, {
      pinnedRoomsId: arrayRemove(roomId),
    })
  }

  const openModalConfirm = room => {
    setModalConfirmLeaveVisible(true)
    setSelectedRoomLeave(room)
  }
  if (!userInfo.uid) return null

  return (
    <div className='room-list noselect'>
      {isEmpty(roomsData) ? (
        <div className='guide-wrapper'>
          <p className='title'>
            Hello <span>{`${userInfo.displayName}`}</span> !
          </p>
          <p className='title'>You haven't join any room yet</p>
          <p className='description'>
            Choose
            <Button type='text' icon={<UserAddOutlined />}></Button>
            button to find your friends
          </p>
          <p className='description'>
            Choose
            <Button type='text' icon={<UsergroupAddOutlined />}></Button>
            button to join or create your own room
          </p>
        </div>
      ) : (
        roomsData.map(room => (
          <Dropdown
            key={room.id}
            overlay={
              <Menu
                items={
                  room.isAGroup
                    ? [
                        {
                          label: userInfo?.pinnedRoomsId?.includes(room.id) ? (
                            <Button
                              onClick={e => {
                                e.stopPropagation()
                                handleUnpin(room.id)
                              }}
                              className='btn-dropdown-list'
                              type='text'>
                              UnPin this conversation
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handlePin(room.id)}
                              className='btn-dropdown-list'
                              type='text'>
                              Pin this conversation
                            </Button>
                          ),
                          key: '0',
                        },

                        {
                          label: (
                            <Button
                              onClick={() => openModalConfirm(room)}
                              className='btn-dropdown-list'
                              type='text'>
                              Leave this group
                            </Button>
                          ),
                          key: '1',
                        },
                      ]
                    : [
                        {
                          label: userInfo?.pinnedRoomsId?.includes(room.id) ? (
                            <Button
                              onClick={() => handleUnpin(room.id)}
                              className='btn-dropdown-list'
                              type='text'>
                              UnPin this conversation
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handlePin(room.id)}
                              className='btn-dropdown-list'
                              type='text'>
                              Pin this conversation
                            </Button>
                          ),
                          key: '0',
                        },
                      ]
                }
              />
            }
            trigger={['contextMenu']}>
            <div
              className={room.id === selectedRoom.id ? 'room selected' : 'room'}
              style={
                room.id === selectedRoom.id
                  ? { backgroundColor: 'rgb(4, 67, 97)', color: 'white' }
                  : null
              }
              onClick={() => setSelectedRoomId(room.id)}>
              <div className='avt-graper'>
                <div className='avatar-group'>
                  {room.standByPhoto.lastThreeMembers.length === 2 ? (
                    <>
                      {room.standByPhoto.lastThreeMembers
                        .filter(member => member.uid !== uid)
                        .map(member => (
                          <Avatar
                            key={member.uid}
                            size='large'
                            src={member.photoURL}>
                            {member?.photoURL
                              ? ''
                              : member?.displayName?.charAt(0)?.toUpperCase()}
                          </Avatar>
                        ))}
                    </>
                  ) : room.standByPhoto.lastThreeMembers.length === 3 ? (
                    <>
                      <Avatar
                        className='first-avt'
                        size='medium'
                        src={room.standByPhoto.lastThreeMembers[0].photoURL}>
                        {room.standByPhoto.lastThreeMembers[0]?.photoURL
                          ? ''
                          : room.standByPhoto.lastThreeMembers[0]?.displayName
                              ?.charAt(0)
                              ?.toUpperCase()}
                      </Avatar>
                      <Avatar
                        className='second-avt'
                        size='medium'
                        src={room.standByPhoto.lastThreeMembers[1].photoURL}>
                        {room.standByPhoto.lastThreeMembers[1]?.photoURL
                          ? ''
                          : room.standByPhoto.lastThreeMembers[1]?.displayName
                              ?.charAt(0)
                              ?.toUpperCase()}
                      </Avatar>
                      <Avatar
                        className={
                          room?.standByPhoto?.groupLengthRest
                            ? 'third-avt'
                            : 'third-avt-alone'
                        }
                        size='medium'
                        src={room.standByPhoto.lastThreeMembers[2].photoURL}>
                        {room.standByPhoto.lastThreeMembers[2]?.photoURL
                          ? ''
                          : room.standByPhoto.lastThreeMembers[2]?.displayName
                              ?.charAt(0)
                              ?.toUpperCase()}
                      </Avatar>
                    </>
                  ) : (
                    <Avatar
                      size='large'
                      src={room.standByPhoto.lastThreeMembers[0].photoURL}>
                      {room.standByPhoto.lastThreeMembers[0]?.photoURL
                        ? ''
                        : room.standByPhoto.lastThreeMembers[0]?.displayName
                            ?.charAt(0)
                            ?.toUpperCase()}
                    </Avatar>
                  )}

                  {room?.standByPhoto?.groupLengthRest && (
                    <Avatar
                      className='rest-avt'
                      size='medium'>{`+${room.standByPhoto.groupLengthRest}`}</Avatar>
                  )}
                </div>
              </div>

              <div className='titles'>
                <p className='name'>
                  {room.isAGroup
                    ? room.name
                    : room?.standByPhoto?.lastThreeMembers?.filter(
                        mem => mem?.displayName !== userInfo?.displayName
                      )[0]?.displayName}
                </p>

                {room.newestMess.text && (
                  <p className='text'>
                    {room.newestMess.displayName}: {room.newestMess.text}
                  </p>
                )}
              </div>

              <div className='time-stamp'>
                {room.newestMess.createdAt && (
                  <p>
                    {formatNSecondsToSevaralSeconds(
                      room.newestMess.createdAt.seconds
                    )}
                  </p>
                )}

                <div className='btns'>
                  {userInfo?.pinnedRoomsId?.includes(room.id) && (
                    <Button
                      className='btn-pinned'
                      onClick={e => e.stopPropagation()}
                      type='text'
                      icon={<PushpinFilled />}
                    />
                  )}
                  <Dropdown
                    className='dropdown-list'
                    overlay={
                      <Menu
                        onContextMenu={e => e.stopPropagation()}
                        items={
                          room.isAGroup
                            ? [
                                {
                                  label: userInfo?.pinnedRoomsId?.includes(
                                    room.id
                                  ) ? (
                                    <Button
                                      onClick={e => {
                                        e.stopPropagation()
                                        handleUnpin(room.id)
                                      }}
                                      className='btn-dropdown-list'
                                      type='text'>
                                      UnPin this conversation
                                    </Button>
                                  ) : (
                                    <Button
                                      onClick={e => {
                                        e.stopPropagation()
                                        handlePin(room.id)
                                      }}
                                      className='btn-dropdown-list'
                                      type='text'>
                                      Pin this conversation
                                    </Button>
                                  ),
                                  key: '0',
                                },

                                {
                                  label: (
                                    <Button
                                      onClick={e => {
                                        e.stopPropagation()
                                        openModalConfirm(room)
                                      }}
                                      className='btn-dropdown-list'
                                      type='text'>
                                      Leave this group
                                    </Button>
                                  ),
                                  key: '1',
                                },
                              ]
                            : [
                                {
                                  label: userInfo?.pinnedRoomsId?.includes(
                                    room.id
                                  ) ? (
                                    <Button
                                      onClick={e => {
                                        e.stopPropagation()
                                        handleUnpin(room.id)
                                      }}
                                      className='btn-dropdown-list'
                                      type='text'>
                                      UnPin this conversation
                                    </Button>
                                  ) : (
                                    <Button
                                      onClick={e => {
                                        e.stopPropagation()
                                        handlePin(room.id)
                                      }}
                                      className='btn-dropdown-list'
                                      type='text'>
                                      Pin this conversation
                                    </Button>
                                  ),
                                  key: '0',
                                },
                              ]
                        }
                      />
                    }
                    trigger={['hover', 'click']}>
                    <Button
                      onClick={e => e.stopPropagation()}
                      type='text'
                      className={
                        userInfo?.pinnedRoomsId?.includes(room.id)
                          ? 'btn-more-option-hide'
                          : 'btn-more-option'
                      }
                      icon={<MoreOutlined />}
                    />
                  </Dropdown>
                </div>
              </div>
            </div>
          </Dropdown>
        ))
      )}
    </div>
  )
}
