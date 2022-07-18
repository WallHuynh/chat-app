import React, { useContext, useState } from 'react'
import { Form, Modal, Select, Spin, Avatar } from 'antd'
import { ACTIONS, AppContext } from '../../context/AppProvider'
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
import styled from 'styled-components'

const ModalStyled = styled(Modal)`
  .ant-modal-footer {
    .btn-primary {
      border: 0.1px solid gray;
      background-color: white;
      font-weight: 600;
      color: black;
      :hover {
        font-weight: 600;
        border: solid 1px green;
        color: green;
      }
    }
    .disabled-btn {
      cursor: not-allowed;
      color: rgba(0, 0, 0, 0.25);
      border: 0.1px solid;
      background: #f5f5f5;
      text-shadow: none;
      box-shadow: none;
    }
    .confirm-btn {
      border: 0.1px solid green;
      background-color: green;
      font-weight: 600;
      color: white;
      &:active {
        box-shadow: rgba(6, 24, 44, 0.4) 0px 0px 0px 2px,
          rgba(6, 24, 44, 0.65) 0px 4px 6px -1px,
          rgba(255, 255, 255, 0.08) 0px 1px 0px inset;
        transform: translateY(-0.5px);
        transition: 200ms;
      }
    }
  }
`

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
  const { state, dispatch, selectedRoom } = useContext(AppContext)
  const [value, setValue] = useState([])
  const [form] = Form.useForm()

  const handleOk = () => {
    if (value.length) {
      form.resetFields()
      setValue([])
      // update members in current room
      updateDocument('rooms', selectedRoomId, {
        members: [...selectedRoom.members, ...value.map(val => val.value)],
      })
      dispatch({ type: ACTIONS.TG_INVITE, payload: false })
    } else {
      return
    }
  }

  const handleCancel = () => {
    // reset form value
    form.resetFields()
    setValue([])
    dispatch({ type: ACTIONS.TG_INVITE, payload: false })
  }

  return (
    <ModalStyled
      className='noselect'
      centered
      okText='Invite'
      title='Invite members'
      visible={state.isInviteMemberVisible}
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
    </ModalStyled>
  )
}
