import React, { useContext } from 'react'
import { AppContext } from '../../../../context/AppProvider'
import Info from './Info'
import RoomMembers from './RoomMembers'
import { Button, Collapse } from 'antd'
import { CaretRightOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import './RoomInfo.scss'
import SettingOptions from './SettingOptions'

export default function RoomInfo() {
  const { selectedRoom, members, setIsInviteMemberVisible, setOpenGroupInfo } =
    useContext(AppContext)
  const { Panel } = Collapse

  const handleLeave = () => {
    setOpenGroupInfo(false)
  }
  return (
    <div className='graper-group noselect'>
      <div className='header-group'>
        <div className='btn-exit'>
          <Button
            onClick={handleLeave}
            className='btn-left'
            type='text'
            icon={<MenuUnfoldOutlined />}></Button>
        </div>
        <p className='title'>
          {selectedRoom.isAGroup ? 'Room info' : 'Communication info'}
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
            <SettingOptions />
          </Panel>
        </Collapse>
      </div>
    </div>
  )
}
