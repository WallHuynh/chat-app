import { Avatar } from 'antd'
import React, { useContext } from 'react'
import { AppContext } from '../../../../context/AppProvider'

export default function RoomMembers() {
  const { members, selectedRoom, setUserInfoVisible, setSelectedUser } =
    useContext(AppContext)

  return (
    <div className='members'>
      {members.map(member => (
        <div
          key={member.uid}
          className='member'
          src={member.photoURL}
          onClick={() => {
            setUserInfoVisible(true)
            setSelectedUser(member)
          }}>
          <Avatar className='avt' size='large' src={member.photoURL}>
            {member.photoURL
              ? ''
              : member?.displayName?.charAt(0)?.toUpperCase()}
          </Avatar>
          <p className='name'>{member.displayName}</p>
        </div>
      ))}
    </div>
  )
}
