import React, { useContext } from 'react'
import { AppContext } from '../../../../context/AppProvider'
import { AuthContext } from '../../../../context/AuthProvider'
import Info from './Info'
import RoomMembers from './RoomMembers'
import { Button, Collapse } from 'antd'
import { CaretRightOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import RoomOptions from './RoomOptions'
import './GroupInfo.scss'

export default function GroupInfo() {
  const { selectedRoom, members, setIsInviteMemberVisible, setOpenGroupInfo } =
    useContext(AppContext)

  const {
    user: { uid },
  } = useContext(AuthContext)
  const { Panel } = Collapse
  return (
    <div className='graper-group noselect'>
      <div className='header-group'>
        <div className='btn-exit'>
          <Button
            onClick={() => setOpenGroupInfo(false)}
            className='btn-left'
            type='text'
            icon={<MenuUnfoldOutlined />}></Button>
        </div>
        <p className='title'>
          {selectedRoom.isAGroup ? 'Group Info' : 'Communication info'}
        </p>
      </div>
      <div className='group-info-body'>
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
            <RoomOptions />
          </Panel>
        </Collapse>
      </div>
    </div>
  )
}
