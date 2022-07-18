import { Avatar } from 'antd'
import React, { useContext } from 'react'
import { ACTIONS, AppContext } from '../../../../context/AppProvider'

export default function RoomMembers() {
  const { members, dispatch } = useContext(AppContext)

  return (
    <div className='members'>
      {members.map(member => (
        <div
          key={member.uid}
          className='member'
          src={member.photoURL}
          onClick={() => {
            dispatch({ type: ACTIONS.TG_USER_INFO, payload: true })
            dispatch({ type: ACTIONS.SELECTED_USER, payload: member })
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
