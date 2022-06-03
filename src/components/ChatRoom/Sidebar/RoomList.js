import React, { useContext, useEffect } from 'react'
import { Button, Col, Row, Avatar, Tooltip } from 'antd'
import styled from 'styled-components'
import { AppContext } from '../../../Context/AppProvider'
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict'
import { AuthContext } from '../../../Context/AuthProvider'

const RoomListStyled = styled.div`
  max-height: calc(100% - 70px);
  min-height: calc(100% - 70px);
  overflow-y: scroll;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  &::-webkit-scrollbar {
    width: 8px;
    background: rgba(0, 0, 0, 0);
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 4px;
  }
`

const RoomStyled = styled.div`
  max-height: 75px;
  min-height: 75px;
  width: 100%;
  height: 60px;
  padding: 7px 0 10px 0;
  cursor: pointer;
  :hover {
    background-color: rgba(224, 235, 235, 0.5);
  }
  .avatar-group {
    margin-left: 15px;
    width: 58px;
    height: 58px;
    position: relative;
    .first-avt {
      z-index: 1;
    }
    .second-avt {
      z-index: 2;
      position: absolute;
      left: 30px;
    }
    .third-avt {
      z-index: 3;
      position: absolute;
      top: 30px;
      left: 0;
    }
    .third-avt-alone {
      z-index: 3;
      position: absolute;
      top: 27px;
      left: 15px;
    }
    .rest-avt {
      z-index: 4;
      position: absolute;
      top: 30px;
      left: 30px;
    }
    .ant-avatar-lg {
      width: 55px;
      height: 55px;
      text-align: center;
      .ant-avatar-string {
        top: 10%;
        font-size: 30px;
      }
    }
  }
  .titles {
    margin: 0 0 0 6px;
    .name {
      font-size: 13pt;
      margin: 5px 0 0 0;
    }
    .text {
      font-size: 11px;
      marrgin: 0;
    }
    .name,
    .text {
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
    width: 100%;
    height: 80%;
    padding-top: 10px;
    p {
      color: #515151;
      font-family: 'Open Sans', sans-serif;
      font-size: 10px;
    }
  }
`

export default function RoomList() {
  const { rooms, setSelectedRoomId, selectedRoom } = useContext(AppContext)
  const {
    user: { uid },
  } = useContext(AuthContext)
  return (
    <RoomListStyled className='noselect'>
      {rooms.map(room => (
        <RoomStyled
          style={
            room.id === selectedRoom.id ? { backgroundColor: '#ccffcc' } : null
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
                    {formatDistanceToNowStrict(
                      new Date(room.newestMess.createAt.seconds * 1000)
                    )}
                  </p>
                )}
              </div>
            </Col>
          </Row>
        </RoomStyled>
      ))}
    </RoomListStyled>
  )
}
