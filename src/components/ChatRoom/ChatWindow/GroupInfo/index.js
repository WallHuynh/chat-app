import React, { useContext } from 'react'
import styled from 'styled-components'
import { AppContext } from '../../../../Context/AppProvider'
import { AuthContext } from '../../../../Context/AuthProvider'
import Info from './Info'
import RoomMembers from './RoomMembers'
import { Collapse } from 'antd'
import { CaretRightOutlined } from '@ant-design/icons'
import RoomSettings from './RoomSettings'
const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`

const GraperStyled = styled.div`
  height: 100vh;
`

const HeaderStyled = styled.div`
  display: flex;
  justify-content: center;
  height: 56px;
  padding: 0 16px;
  align-items: center;
  border-bottom: 1px solid rgb(230, 230, 230);
  background-color: #4682b4;
  color: white;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px,
    rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
  .title {
    margin: 0;
    font-weight: bold;
    font-size: 20px;
  }
`

const BodyStyled = styled.div`
  height: calc(100% - 56px);
  overflow-y: scroll;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 8px;
    background: rgba(0, 0, 0, 0);
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 4px;
  }
  .ant-collapse > .ant-collapse-item > .ant-collapse-header {
    :hover {
      font-weight: 600;
    }
  }
  .info {
    padding: 10px 0;
    height: 110px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
  }
  .members {
    display: flex;
    flex-direction: column;
    gap: 3px;
    .member {
      width: 100%;
      min-height: 60px;
      max-height: 60px;
      display: flex;
      padding: 0 10px 0;
      :hover {
        background-color: rgba(224, 235, 235, 0.5);
      }
      .name,
      .avt {
        align-self: center;
      }
      .name {
        max-width: 70%;
        margin: 0 5px 0 5px;
        text-overflow: ellipsis;
        overflow-x: hidden;
        white-space: nowrap;
      }
    }
  }
  .leave-btn {
    :hover {
      background: rgba(230, 230, 230, 0.6);
    }
    .ant-btn-text {
      background: transparent;
      :hover {
        background: transparent;
      }
    }
  }
`

export default function GroupInfo() {
  const { selectedRoom, members, setIsInviteMemberVisible } =
    useContext(AppContext)

  const {
    user: { uid },
  } = useContext(AuthContext)
  const { Panel } = Collapse
  return (
    <GraperStyled className='noselect'>
      <HeaderStyled>
        <p className='title'>
          {selectedRoom.isAGroup ? 'Group Info' : 'Communication info'}
        </p>
      </HeaderStyled>
      <BodyStyled>
        <Info />
        <Collapse
          bordered={false}
          defaultActiveKey={['1', '2']}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 90 : 0} />
          )}
          className='site-collapse-custom-collapse'>
          <Panel
            header='Members'
            key='1'
            className='site-collapse-custom-panel'>
            <RoomMembers />
          </Panel>
          <Panel
            header='Settings'
            key='2'
            className='site-collapse-custom-panel'>
            <RoomSettings />
          </Panel>
        </Collapse>
      </BodyStyled>
    </GraperStyled>
  )
}
