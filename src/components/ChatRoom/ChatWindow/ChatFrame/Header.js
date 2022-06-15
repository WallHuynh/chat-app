import { PlusCircleOutlined } from '@ant-design/icons'
import React, { useContext } from 'react'
import { Button, Tooltip, Avatar } from 'antd'
import { AppContext } from '../../../../context/AppProvider'

export default function Header() {
  const {
    selectedRoom,
    members,
    setIsInviteMemberVisible,
    setUserInfoVisible,
    setSelectedUser,
  } = useContext(AppContext)
  return (
    <div className='noselect header-graper'>
      <div className='info'>
        <p className='title'>{selectedRoom.name}</p>
        {selectedRoom.isAGroup && (
          <span className='description'>{`${selectedRoom.members.length} members`}</span>
        )}
      </div>

      <div className='add-member-btn'>
        <Tooltip placement='bottom' title='Invite more friends' color='#ff0066'>
          <Button
            icon={<PlusCircleOutlined />}
            type='text'
            onClick={() => setIsInviteMemberVisible(true)}></Button>
        </Tooltip>
      </div>

      <Avatar.Group size='large' maxCount={2} className='avt-group'>
        {members.map(member => (
          <Tooltip title={member.displayName} key={member.id}>
            <Avatar
              className='avt'
              src={member.photoURL}
              onClick={() => {
                setUserInfoVisible(true)
                setSelectedUser(member)
              }}>
              {member.photoURL
                ? ''
                : member.displayName?.charAt(0)?.toUpperCase()}
            </Avatar>
          </Tooltip>
        ))}
      </Avatar.Group>
    </div>
  )
}
