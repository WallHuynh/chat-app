import React, { useContext } from 'react'
import { AppContext } from '../../../../Context/AppProvider'
import { AuthContext } from '../../../../Context/AuthProvider'
import Info from './Info'
import RoomMembers from './RoomMembers'
import { Collapse } from 'antd'
import { CaretRightOutlined } from '@ant-design/icons'
import RoomSettings from './RoomSettings'
import './GroupInfo.scss'

export default function GroupInfo() {
  const { selectedRoom, members, setIsInviteMemberVisible } =
    useContext(AppContext)

  const {
    user: { uid },
  } = useContext(AuthContext)
  const { Panel } = Collapse
  return (
    <div className='graper-group noselect'>
      <div className='header-group'>
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
            <RoomSettings />
          </Panel>
        </Collapse>
      </div>
    </div>
  )
}
