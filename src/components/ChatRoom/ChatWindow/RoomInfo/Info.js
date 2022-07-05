import { CopyOutlined, EditOutlined } from '@ant-design/icons'
import { Avatar, Button } from 'antd'
import React, { useContext } from 'react'
import { AppContext } from '../../../../context/AppProvider'
import { AuthContext } from '../../../../context/AuthProvider'
import { openNotification } from '../../../Modals/FindFriendModal'

export default function Info() {
  const { selectedRoom, userInfo, setChangeRoomNameVisible } =
    useContext(AppContext)
  const {
    user: { uid },
  } = useContext(AuthContext)

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedRoom.id)
    openNotification('right', 'Copied room ID to clipboard')
  }
  return (
    <div className='info noselect'>
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
      <div className='title-wrapper'>
        <p className='title'>
          {selectedRoom.isAGroup
            ? selectedRoom.name
            : selectedRoom?.standByPhoto?.lastThreeMembers?.filter(
                mem => mem?.displayName !== userInfo?.displayName
              )[0]?.displayName}
        </p>
        <Button
          className='btn-edit'
          onClick={() => setChangeRoomNameVisible(true)}
          icon={<EditOutlined />}
          type='text'></Button>
      </div>
      <div className='group-id'>
        <p>
          <span>Room ID:</span> {selectedRoom.id}
        </p>
        <Button
          className='btn-edit'
          onClick={handleCopy}
          icon={<CopyOutlined />}
          type='text'></Button>
      </div>
    </div>
  )
}
