import React, { useContext } from 'react'
import { Avatar } from 'antd'
import { formatRelative } from 'date-fns/esm'
import { ACTIONS, AppContext } from '../../../../context/AppProvider'

function formatDate(seconds) {
  let formattedDate = ''

  if (seconds) {
    formattedDate = formatRelative(new Date(seconds * 1000), new Date())

    formattedDate =
      formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)
  }

  return formattedDate
}

export default function Message({
  id,
  text,
  displayName,
  createdAt,
  photoURL,
}) {
  const { members, state, dispatch, userInfo } = useContext(AppContext)

  const member = members.filter(member => member.uid === id)[0]
  return (
    <>
      {userInfo.uid === id ? (
        <div className='graper-right-content'>
          <div className='contents right'>
            <p className='message'>{text}</p>
            <span className='time-stamp noselect'>
              {formatDate(createdAt?.seconds)}
            </span>
          </div>

          <Avatar
            size='large'
            src={photoURL}
            className='mess-avt noselect'
            onClick={() => {
              dispatch({ type: ACTIONS.TG_USER_INFO, payload: true })
              dispatch({ type: ACTIONS.SELECTED_USER, payload: member })
            }}>
            {photoURL ? '' : displayName?.charAt(0)?.toUpperCase()}
          </Avatar>
        </div>
      ) : (
        <div className='graper-left-content'>
          <Avatar
            size='large'
            src={photoURL}
            className='mess-avt noselect'
            onClick={() => {
              dispatch({ type: ACTIONS.TG_USER_INFO, payload: true })
              dispatch({ type: ACTIONS.SELECTED_USER, payload: member })
            }}>
            {photoURL ? '' : displayName?.charAt(0)?.toUpperCase()}
          </Avatar>

          <div className='contents left'>
            <span className='name noselect'>{displayName}</span>
            <p className='message'>{text}</p>
            <span className='time-stamp noselect'>
              {formatDate(createdAt?.seconds)}
            </span>
          </div>
        </div>
      )}
    </>
  )
}
