import React, { useContext } from 'react'
import { Modal, Image, Avatar } from 'antd'
import { AppContext } from '../../Context/AppProvider'
import { AuthContext } from '../../Context/AuthProvider'
import styled from 'styled-components'
import { UserDeleteOutlined } from '@ant-design/icons'

const ModalStyled = styled(Modal)`
  .ant-avatar-lg {
    cursor: pointer;
    width: 80px;
    height: 80px;
    text-align: center;
    .ant-avatar-string {
      top: 23%;
      font-size: 30px;
    }
  }
  .ant-modal-footer {
    height: 50px;
    text-align: center;
    .unfriend-btn {
      border: 0.1px solid gray;
      background-color: white;
      font-weight: 600;
      :hover {
        font-weight: 600;
        border: solid 1px green;
        color: green;
      }
      :active {
        box-shadow: rgba(6, 24, 44, 0.4) 0px 0px 0px 2px,
          rgba(6, 24, 44, 0.65) 0px 4px 6px -1px,
          rgba(255, 255, 255, 0.08) 0px 1px 0px inset;
        transform: translateY(-0.5px);
        transition: 200ms;
      }
    }
  }
  .cover-photo {
    background-color: lightpink;
    height: 150px;
    position: relative;
    .avatar,
    .ant-image {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translate(-40px, 40px);
    }
    .ant-image,
    .ant-image-mask {
      border-radius: 50%;
      overflow: hidden;
      perspective: 1px;
    }
    .avatar > .ant-avatar-string {
      font-size:  40px;
      top: 25%;
    }
  }
  .info {
    background-color: lightyellow;
    height: 180px;
    padding-top: 45px;
    .name {
      background-color: lightgreen;
      font-size: 25px;
      text-align: center;
      padding: 0 40px 0 40px;
      text-overflow: ellipsis;
      overflow-x: hidden;
      white-space: nowrap;
    }
    .email {
      padding: 0 20px 0 20px;
      font-size: 16px;
      .tag {
        opacity: 0.7;
      }
    }
  }
`

export default function UserInfoModal() {
  const { userInfoVisible, setUserInfoVisible, selectedUser, setSelectedUser } =
    useContext(AppContext)
  const {
    user: { uid, displayName, photoURL },
  } = useContext(AuthContext)

  const handleCancel = () => {
    setUserInfoVisible(false)
    setSelectedUser({})
  }
  return (
    <div>
      <ModalStyled
        bodyStyle={{ padding: '0' }}
        width={350}
        footer={
          <button className='unfriend-btn'>
            <UserDeleteOutlined /> Unfriend
          </button>
        }
        title='User info'
        visible={userInfoVisible}
        onCancel={handleCancel}>
        <div className='cover-photo'>
          {selectedUser.photoURL ? (
            <Image src={selectedUser.photoURL} width={80} />
          ) : (
            <Avatar size='large' className='avatar'>
              {selectedUser.displayName?.charAt(0)?.toUpperCase()}
            </Avatar>
          )}
        </div>
        <div className='info'>
          <p className='name'>{selectedUser.displayName}</p>
          <p className='email'>
            <span className='tag'>Email: </span>
            {selectedUser.email}
          </p>
        </div>
      </ModalStyled>
    </div>
  )
}
