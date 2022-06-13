import React, { useContext } from 'react'
import { Col, Row, Avatar } from 'antd'
import { AppContext } from '../../../Context/AppProvider'
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict'
import { AuthContext } from '../../../Context/AuthProvider'

const formatNSecondsToSevaralSeconds = timeLineSeconds => {
  let formatTime = formatDistanceToNowStrict(new Date(timeLineSeconds * 1000))
  if (formatTime?.includes('seconds') || formatTime?.includes('second')) {
    formatTime = 'recently'
  }
  return formatTime
}

export default function RoomList() {
  const { rooms, setSelectedRoomId, selectedRoom } = useContext(AppContext)
  const {
    user: { uid },
  } = useContext(AuthContext)
  return (
    <div className='room-list noselect'>
      {rooms.map(room => (
        <div
          className='room'
          style={
            room.id === selectedRoom.id
              ? { backgroundColor: '#4682B4', color: 'white' }
              : null
          }
          key={room.id}
          roomMembers={room.members}
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
                {room.newestMess.createAt && (
                  <p>
                    {formatNSecondsToSevaralSeconds(
                      room.newestMess.createAt.seconds
                    )}
                  </p>
                )}
              </div>
            </Col>
          </Row>
        </div>
      ))}
    </div>
  )
}
