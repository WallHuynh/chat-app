import {
  LeftOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons'
import React, { useContext } from 'react'
import { Button, Tooltip, Avatar } from 'antd'
import { AppContext } from '../../../../context/AppProvider'

export default function Header() {
  const {
    selectedRoom,
    setIsInviteMemberVisible,
    setSelectedRoomId,
    userInfo,
    openGroupInfo,
    setOpenGroupInfo,
  } = useContext(AppContext)

  const handleExit = () => {
    setSelectedRoomId('')
  }
  return (
    <div className='noselect header-graper'>
      <div className='btn-exit'>
        <Button
          onClick={handleExit}
          className='btn-left'
          type='text'
          icon={<LeftOutlined />}></Button>
      </div>

      <div className='avatar-group'>
        {selectedRoom.standByPhoto.lastThreeMembers.length === 2 ? (
          <>
            {selectedRoom.standByPhoto.lastThreeMembers
              .filter(member => member.uid !== userInfo.uid)
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

      <div className='group-title'>
        <p className='title'>{selectedRoom.name}</p>
        {selectedRoom.isAGroup && (
          <p className='description'>{`${selectedRoom.members.length} members`}</p>
        )}
      </div>

      <div className='btns'>
        <Tooltip placement='bottom' title='Invite more friends'>
          <Button
            className='add-member-btn'
            icon={<PlusCircleOutlined />}
            type='text'
            onClick={() => setIsInviteMemberVisible(true)}></Button>
        </Tooltip>
        {openGroupInfo ? (
          <Tooltip
            mouseEnterDelay={2}
            placement='bottom'
            title='Conversation info'
            arrowPointAtCenter={true}>
            <Button
              className='btn-open-group-info'
              icon={<MenuUnfoldOutlined />}
              type='text'
              onClick={() =>
                setOpenGroupInfo(prevState => !prevState)
              }></Button>
          </Tooltip>
        ) : (
          <Button
            className='btn-open-group-info'
            icon={<MenuFoldOutlined />}
            type='text'
            onClick={() => setOpenGroupInfo(prevState => !prevState)}></Button>
        )}
      </div>
    </div>
  )
}
