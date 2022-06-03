import { Avatar } from 'antd'
import React, { useContext } from 'react'
import styled from 'styled-components'
import { AppContext } from '../../../../Context/AppProvider'
import { AuthContext } from '../../../../Context/AuthProvider'

const InfoStyled = styled.div`
  .avatar-group {
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
  .name {
    font-weight: 600;
    font-size: 15px;
    padding: 0;
    margin: 0;
  }
`

export default function Info() {
  const { selectedRoom } = useContext(AppContext)
  const {
    user: { uid },
  } = useContext(AuthContext)
  return (
    <InfoStyled className='info noselect'>
      <div className='avatar-group'>
        {selectedRoom.standByPhoto.lastThreeMembers.length === 2 ? (
          <>
            {selectedRoom.standByPhoto.lastThreeMembers
              .filter(member => member.uid !== uid)
              .map(member => (
                <Avatar key={member.uid} size='large' src={member.photoURL}>
                  {member?.photoURL
                    ? ''
                    : member?.displayName?.charAt(0)?.toUpperCase()}
                </Avatar>
              ))}
          </>
        ) : selectedRoom.standByPhoto.lastThreeMembers.length === 3 ? (
          <>
            <Avatar
              className='first-avt'
              size='medium'
              src={selectedRoom.standByPhoto.lastThreeMembers[0].photoURL}>
              {selectedRoom.standByPhoto.lastThreeMembers[0]?.photoURL
                ? ''
                : selectedRoom.standByPhoto.lastThreeMembers[0]?.displayName
                    ?.charAt(0)
                    ?.toUpperCase()}
            </Avatar>
            <Avatar
              className='second-avt'
              size='medium'
              src={selectedRoom.standByPhoto.lastThreeMembers[1].photoURL}>
              {selectedRoom.standByPhoto.lastThreeMembers[1]?.photoURL
                ? ''
                : selectedRoom.standByPhoto.lastThreeMembers[1]?.displayName
                    ?.charAt(0)
                    ?.toUpperCase()}
            </Avatar>
            <Avatar
              className={
                selectedRoom?.standByPhoto?.groupLengthRest
                  ? 'third-avt'
                  : 'third-avt-alone'
              }
              size='medium'
              src={selectedRoom.standByPhoto.lastThreeMembers[2].photoURL}>
              {selectedRoom.standByPhoto.lastThreeMembers[2]?.photoURL
                ? ''
                : selectedRoom.standByPhoto.lastThreeMembers[2]?.displayName
                    ?.charAt(0)
                    ?.toUpperCase()}
            </Avatar>
          </>
        ) : (
          <Avatar
            size='large'
            src={selectedRoom.standByPhoto.lastThreeMembers[0].photoURL}>
            {selectedRoom.standByPhoto.lastThreeMembers[0]?.photoURL
              ? ''
              : selectedRoom.standByPhoto.lastThreeMembers[0]?.displayName
                  ?.charAt(0)
                  ?.toUpperCase()}
          </Avatar>
        )}

        {selectedRoom?.standByPhoto?.groupLengthRest && (
          <Avatar
            className='rest-avt'
            size='medium'>{`+${selectedRoom.standByPhoto.groupLengthRest}`}</Avatar>
        )}
      </div>
      <p className='name'>{selectedRoom.name}</p>
    </InfoStyled>
  )
}
