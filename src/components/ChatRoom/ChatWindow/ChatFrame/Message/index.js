import React, { useContext } from 'react'
import { Avatar, Col, Row } from 'antd'
import { formatRelative } from 'date-fns/esm'
import { AuthContext } from '../../../../../context/AuthProvider'
import { AppContext } from '../../../../../context/AppProvider'

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
  const {
    user: { uid },
  } = useContext(AuthContext)
  const { members, setUserInfoVisible, setSelectedUser } =
    useContext(AppContext)

  const member = members.filter(member => member.uid === id)[0]
  return (
    <>
      {uid === id ? (
        <div className='graper'>
          <Row>
            <Col span={22}>
              <div className='contents right'>
                <p className='message'>{text}</p>
                <span className='time-stamp noselect'>
                  {formatDate(createdAt?.seconds)}
                </span>
              </div>
            </Col>
            <Col span={2}>
              <Avatar
                size='large'
                src={photoURL}
                className='mess-avt noselect'
                onClick={() => {
                  setUserInfoVisible(true)
                  setSelectedUser(member)
                }}>
                {photoURL ? '' : displayName?.charAt(0)?.toUpperCase()}
              </Avatar>
            </Col>
          </Row>
        </div>
      ) : (
        <div className='graper'>
          <Row>
            <Col span={2}>
              <Avatar
                size='large'
                src={photoURL}
                className='mess-avt noselect'
                onClick={() => {
                  setUserInfoVisible(true)
                  setSelectedUser(member)
                }}>
                {photoURL ? '' : displayName?.charAt(0)?.toUpperCase()}
              </Avatar>
            </Col>
            <Col span={22}>
              <div className='contents left'>
                <span className='name noselect'>{displayName}</span>
                <p className='message'>{text}</p>
                <span className='time-stamp noselect'>
                  {formatDate(createdAt?.seconds)}
                </span>
              </div>
            </Col>
          </Row>
        </div>
      )}
    </>
  )
}
