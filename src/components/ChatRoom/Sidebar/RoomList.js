import React, { useContext, useEffect, useState } from 'react'
import { Col, Row, Avatar, Button, Dropdown, Menu, Modal } from 'antd'
import { AppContext } from '../../../context/AppProvider'
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict'
import { AuthContext } from '../../../context/AuthProvider'
import {
  ExclamationCircleTwoTone,
  MoreOutlined,
  PushpinOutlined,
} from '@ant-design/icons'
import styled from 'styled-components'
import { updateDocument } from '../../../firebase/services'
import { arrayRemove, arrayUnion } from 'firebase/firestore'

const ModalStyled = styled(Modal)`
  .ant-modal-body {
    display: none;
  }
`

const formatNSecondsToSevaralSeconds = timeLineSeconds => {
  let formatTime = formatDistanceToNowStrict(new Date(timeLineSeconds * 1000))
  if (formatTime?.includes('seconds') || formatTime?.includes('second')) {
    formatTime = 'recently'
  }
  return formatTime
}

export default function RoomList() {
  const { rooms, setSelectedRoomId, selectedRoom, userInfo } =
    useContext(AppContext)
  const {
    user: { uid },
  } = useContext(AuthContext)
  const [modalConfirmVisivle, setModalConfirmVisivle] = useState(false)
  const [roomsData, setRoomData] = useState([])
  console.log(userInfo)

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

  const handleLeaveGroup = roomId => {
    modalConfirmCancel()
    setSelectedRoomId('')
    updateDocument('rooms', roomId, {
      members: arrayRemove(uid),
    })
    updateDocument('users', userInfo.uid, {
      pinnedRoomsId: arrayRemove(roomId),
    })
  }
  const modalConfirmCancel = () => {
    setModalConfirmVisivle(false)
  }
  const openModalConfirm = () => {
    setModalConfirmVisivle(true)
  }

  return (
    <div className='room-list noselect'>
      {roomsData.map(room => (
        <Dropdown
          key={room.id}
          overlay={
            <Menu
              items={[
                {
                  label: (
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
                      onClick={openModalConfirm}
                      className='btn-dropdown-list'
                      type='text'>
                      Leave this group
                    </Button>
                  ),
                  key: '1',
                },
              ]}
            />
          }
          trigger={['contextMenu']}>
          <div
            className='room'
            style={
              room.id === selectedRoom.id
                ? { backgroundColor: '#4682B4', color: 'white' }
                : null
            }
            onClick={() => setSelectedRoomId(room.id)}>
            <Row>
              <Col span={6}>
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
              </Col>

              <Col span={14}>
                <div className='titles'>
                  <p className='name'>{room.name}</p>
                  {room.newestMess.text && (
                    <p className='text'>
                      {room.newestMess.displayName}: {room.newestMess.text}
                    </p>
                  )}
                </div>
              </Col>
              <Col span={4}>
                <div className='time-stamp'>
                  {room.newestMess.createdAt && (
                    <p>
                      {formatNSecondsToSevaralSeconds(
                        room.newestMess.createdAt.seconds
                      )}
                    </p>
                  )}

                  {userInfo?.pinnedRoomsId?.includes(room.id) ? (
                    <>
                      <Button
                        onClick={e => e.stopPropagation()}
                        className='btn-pinned'
                        type='text'
                        icon={<PushpinOutlined />}
                      />

                      <Dropdown
                        className='dropdown-list'
                        overlay={
                          <Menu
                            onContextMenu={e => e.stopPropagation()}
                            items={[
                              {
                                label: (
                                  <Button
                                    onClick={e => {
                                      e.stopPropagation()
                                      handleUnpin(room.id)
                                    }}
                                    className='btn-dropdown-list'
                                    type='text'>
                                    UnPin this conversation
                                  </Button>
                                ),
                                key: '0',
                              },

                              {
                                label: (
                                  <Button
                                    onClick={e => {
                                      e.stopPropagation()
                                      openModalConfirm()
                                    }}
                                    className='btn-dropdown-list'
                                    type='text'>
                                    Leave this group
                                  </Button>
                                ),
                                key: '1',
                              },
                            ]}
                          />
                        }
                        trigger={['hover']}>
                        <Button
                          onClick={e => e.stopPropagation()}
                          className='btn-more-option'
                          type='text'
                          icon={<MoreOutlined />}
                        />
                      </Dropdown>
                    </>
                  ) : (
                    <Dropdown
                      className='dropdown-list'
                      overlay={
                        <Menu
                          onContextMenu={e => e.stopPropagation()}
                          items={[
                            {
                              label: (
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
                                    openModalConfirm()
                                  }}
                                  className='btn-dropdown-list'
                                  type='text'>
                                  Leave this group
                                </Button>
                              ),
                              key: '1',
                            },
                          ]}
                        />
                      }
                      trigger={['hover']}>
                      <Button
                        onClick={e => e.stopPropagation()}
                        className='btn-more-option'
                        type='text'
                        icon={<MoreOutlined />}
                      />
                    </Dropdown>
                  )}
                </div>
              </Col>
            </Row>
            <div onContextMenu={e => e.stopPropagation()}>
              <ModalStyled
                centered
                visible={modalConfirmVisivle}
                placement='bottom'
                title={
                  <>
                    <ExclamationCircleTwoTone twoToneColor='#ff5500' />
                    {`Are you sure to leave ${selectedRoom.name}?`}
                  </>
                }
                width={400}
                okText='Yes'
                cancelText='No'
                onOk={e => {
                  e.stopPropagation()
                  handleLeaveGroup(room.id)
                }}
                onCancel={modalConfirmCancel}
                closable={false}></ModalStyled>
            </div>
          </div>
        </Dropdown>
      ))}
    </div>
  )
}
