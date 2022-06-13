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
    return {
      fieldName: 'uid',
      operator: 'in',
      compareValue: selectedRoom.members,
    }
  }, [selectedRoom.members])
  const members = useFirestore('users', usersCondition)
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
  }

  return (
    <AppContext.Provider
      value={{
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
