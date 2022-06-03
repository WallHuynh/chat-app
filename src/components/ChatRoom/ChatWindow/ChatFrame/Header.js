import { PlusCircleOutlined } from '@ant-design/icons'
import React, { useContext } from 'react'
import { Button, Tooltip, Avatar } from 'antd'
import styled from 'styled-components'
import { AppContext } from '../../../../Context/AppProvider'

const HeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  height: 56px;
  padding: 0 16px;
  align-items: center;
  border-bottom: 1px solid rgb(230, 230, 230);
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px,
    rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
  .avt-group {
    flex-grow: 1;
    cursor: pointer;
  }
  .info {
    flex-grow: 3;
    flex-basis: 70%;
    text-overflow: ellipsis;
    overflow-x: hidden;
    white-space: nowrap;
    padding: 10px 10px 15px 0;

    .title {
      margin: 0;
      font-weight: bold;
      font-size: 20px;
    }

    .description {
      font-size: 12px;
    }
  }
`
const AvatarStyled = styled(Avatar)`
  cursor: pointer;
  .ant-avatar-string {
    font-size: 20px;
`
const ButtonGroupStyled = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
`

export default function Header() {
  const {
    selectedRoom,
    members,
    setIsInviteMemberVisible,
    setUserInfoVisible,
    setSelectedUser,
  } = useContext(AppContext)
  return (
    <HeaderStyled className='noselect'>
      <div className='info'>
        <p className='title'>{selectedRoom.name}</p>
        {selectedRoom.isAGroup && (
          <span className='description'>{`${selectedRoom.members.length} members`}</span>
        )}
      </div>

      <ButtonGroupStyled>
        <Tooltip placement='bottom' title='Invite more friends' color='#ff0066'>
          <Button
            icon={<PlusCircleOutlined />}
            type='text'
            onClick={() => setIsInviteMemberVisible(true)}></Button>
        </Tooltip>
      </ButtonGroupStyled>

      <Avatar.Group size='large' maxCount={2} className='avt-group'>
        {members.map(member => (
          <Tooltip title={member.displayName} key={member.id}>
            <AvatarStyled
              src={member.photoURL}
              onClick={() => {
                setUserInfoVisible(true)
                setSelectedUser(member)
              }}>
              {member.photoURL
                ? ''
                : member.displayName?.charAt(0)?.toUpperCase()}
            </AvatarStyled>
          </Tooltip>
        ))}
      </Avatar.Group>
    </HeaderStyled>
  )
}
