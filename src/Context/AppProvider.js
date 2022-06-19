import { doc } from 'firebase/firestore'
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import useFirestore from '../hooks/useFirestore'
import { AuthContext } from './AuthProvider'

export const AppContext = createContext()

export default function AppProvider({ children }) {
  const [isRegisterVisible, setIsRegisterVisible] = useState(false)
  const [isAddRoomVisible, setIsAddRoomVisible] = useState(false)
  const [isInviteMemberVisible, setIsInviteMemberVisible] = useState(false)
  const [selectedRoomId, setSelectedRoomId] = useState('')
  const [userInfoVisible, setUserInfoVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState({})
  const [isFindFriendVisible, setIsFindFriendVisible] = useState(false)
  const [userAccountVisible, setUserAccountVisible] = useState(false)
  const [showUserStatus, setShowUserStatus] = useState(false)
  const [emailRegister, setEmailRegister] = useState({})
  const [isForgotPassVisible, setIsForgotPassVisible] = useState(false)
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false)
  const [selectedRoomLeave, setSelectedRoomLeave] = useState({})
  const [openGroupInfo, setOpenGroupInfo] = useState(false)
  const {
    user: { uid },
  } = useContext(AuthContext)

  const requestCondition = useMemo(() => {
    return {
      fieldName: 'receiveUid',
      operator: '==',
      compareValue: uid,
    }
  }, [uid])
  const status = useFirestore('status', requestCondition)
  console.log('status', status)

  const roomsCondition = useMemo(() => {
    return {
      fieldName: 'members',
      operator: 'array-contains',
      compareValue: uid,
    }
  }, [uid])
  const rooms = useFirestore('rooms', roomsCondition)
  console.log('rooms', rooms)

  const selectedRoom = useMemo(
    () => rooms.find(room => room.id === selectedRoomId) || {},
    [rooms, selectedRoomId]
  )
  const usersCondition = useMemo(() => {
    if (selectedRoom?.members) {
      return {
        fieldName: 'uid',
        operator: 'in',
        compareValue: selectedRoom.members,
      }
    } else {
      return {
        fieldName: 'uid',
        operator: '==',
        compareValue: uid,
      }
    }
  }, [selectedRoom.members, uid])
  const members = useFirestore('users', usersCondition)
  const userInfo = useMemo(
    () => members.find(member => member.uid === uid) || {},
    [members, uid]
  )
  console.log('members', members)

  const clearState = () => {
    setSelectedRoomId('')
    setIsAddRoomVisible(false)
    setIsInviteMemberVisible(false)
    setUserInfoVisible(false)
    setIsRegisterVisible(false)
    setSelectedUser({})
    setUserAccountVisible(false)
    setIsFindFriendVisible(false)
    setShowUserStatus(false)
    setEmailRegister('')
    setIsForgotPassVisible(false)
    setModalConfirmVisible(false)
    setSelectedRoomLeave({})
    setOpenGroupInfo(false)
  }

  return (
    <AppContext.Provider
      value={{
        openGroupInfo,
        setOpenGroupInfo,
        modalConfirmVisible,
        setModalConfirmVisible,
        selectedRoomLeave,
        setSelectedRoomLeave,
        userInfo,
        isForgotPassVisible,
        setIsForgotPassVisible,
        emailRegister,
        setEmailRegister,
        showUserStatus,
        setShowUserStatus,
        userAccountVisible,
        setUserAccountVisible,
        isFindFriendVisible,
        setIsFindFriendVisible,
        selectedUser,
        setSelectedUser,
        userInfoVisible,
        setUserInfoVisible,
        isRegisterVisible,
        setIsRegisterVisible,
        status,
        rooms,
        members,
        selectedRoom,
        isAddRoomVisible,
        setIsAddRoomVisible,
        isInviteMemberVisible,
        setIsInviteMemberVisible,
        selectedRoomId,
        setSelectedRoomId,
        clearState,
      }}>
      {children}
    </AppContext.Provider>
  )
}
