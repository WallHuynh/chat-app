import React, { useContext, useEffect, useState } from 'react'
import { Modal } from 'antd'
import { ExclamationCircleTwoTone } from '@ant-design/icons'
import { updateDocument } from '../../firebase/services'
import { arrayRemove } from 'firebase/firestore'
import { ACTIONS, AppContext } from '../../context/AppProvider'
import { openNotification } from './FindFriendModal'

export default function UnfriendConfirmModal() {
  const { state, dispatch, userInfo, selectedUser } = useContext(AppContext)

  const handleUnfriend = () => {
    updateDocument('users', userInfo.uid, {
      friends: arrayRemove(selectedUser.uid),
    })
    updateDocument('users', selectedUser.uid, {
      friends: arrayRemove(userInfo.uid),
    })
    modalConfirmCancel()
    openNotification('top', 'Unfriend successully')
  }

  const modalConfirmCancel = () => {
    dispatch({ type: ACTIONS.TG_UNFRIEND, payload: false })
  }
  return (
    <Modal
      className='noselect'
      centered
      visible={state.modalUnfiendVisible}
      placement='bottom'
      title={
        <>
          <ExclamationCircleTwoTone twoToneColor='#ff5500' />
          {` Warning`}
        </>
      }
      width={400}
      okText='Yes'
      cancelText='No'
      onOk={handleUnfriend}
      onCancel={modalConfirmCancel}
      closable={false}>
      {`Are you sure to unfriend ${state.selectedUser.displayName}?`}
    </Modal>
  )
}
