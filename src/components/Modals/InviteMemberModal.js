import React, { useContext, useState } from 'react'
import { Form, Modal, Select, Spin, Avatar } from 'antd'
import { AppContext } from '../../Context/AppProvider'
import { debounce } from 'lodash'
import { db } from '../../firebase/config'
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from 'firebase/firestore'
import { updateDocument } from '../../firebase/services'

function DebounceSelect({
  fetchOptions,
  debounceTimeout = 500,
  curMembers,
  ...props
}) {
  // Search: abcddassdfasdf

  const [fetching, setFetching] = useState(false)
  const [options, setOptions] = useState([])

  const debounceFetcher = React.useMemo(() => {
    const loadOptions = value => {
      setOptions([])
      setFetching(true)

      fetchOptions(value, curMembers).then(newOptions => {
        setOptions(newOptions)
        setFetching(false)
      })
    }
    return debounce(loadOptions, debounceTimeout)
  }, [debounceTimeout, fetchOptions, curMembers])

  React.useEffect(() => {
    return () => {
      // clear when unmount
      setOptions([])
    }
  }, [])

  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size='small' /> : null}
      {...props}>
      {options.map(opt => (
        <Select.Option key={opt.uid} value={opt.uid} title={opt.name}>
          <Avatar size='small' src={opt.photoURL}>
            {opt.photoURL ? '' : opt.name?.charAt(0)?.toUpperCase()}
          </Avatar>
          {` ${opt.name}`}
        </Select.Option>
      ))}
    </Select>
  )
}

async function fetchUserList(search, curMembers) {
  const q = query(
    collection(db, 'users'),
    where('keywords', 'array-contains', search?.toLowerCase()),
    orderBy('displayName'),
    limit(20)
  )

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs
    .map(doc => ({
      name: doc.data().displayName,
      uid: doc.data().uid,
      photoURL: doc.data().photoURL,
    }))
    .filter(opt => {
      return !curMembers.includes(opt.uid)
    })
}

export default function InviteMemberModal() {
  const {
    isInviteMemberVisible,
    setIsInviteMemberVisible,
    selectedRoomId,
    selectedRoom,
  } = useContext(AppContext)
  const [value, setValue] = useState([])
  const [form] = Form.useForm()

  const handleOk = () => {
    form.resetFields()
    setValue([])
    // update members in current room
    updateDocument('rooms', selectedRoomId, {
      members: [...selectedRoom.members, ...value.map(val => val.value)],
    })
    setIsInviteMemberVisible(false)
  }

  const handleCancel = () => {
    // reset form value
    form.resetFields()
    setValue([])
    setIsInviteMemberVisible(false)
  }

  return (
    <div>
      <Modal
        okText='Invite'
        title='Invite members'
        visible={isInviteMemberVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose={true}>
        <Form form={form} layout='vertical'>
          <DebounceSelect
            mode='multiple'
            name='search-user'
            value={value}
            placeholder="Member's name"
            fetchOptions={fetchUserList}
            onChange={newValue => setValue(newValue)}
            style={{ width: '100%' }}
            curMembers={selectedRoom.members}
          />
        </Form>
      </Modal>
    </div>
  )
}
