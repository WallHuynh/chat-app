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
import { getDocument } from '../firebase/services'
import useUser from '../hooks/useUser'

export const AppContext = createContext()

export default function AppProvider({ children }) {
  const [isRegisterVisible, setIsRegisterVisible] = useState(false)
  const [isAddRoomVisible, setIsAddRoomVisible] = useState(false)
  const [isInviteMemberVisible, setIsInviteMemberVisible] = useState(false)
  const [selectedRoomId, setSelectedRoomId] = useState('')
  const [userInfoVisible, setUserInfoVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState({})
  const [isAddFriendVisible, setIsAddFriendVisible] = useState(false)
  const [userAccountVisible, setUserAccountVisible] = useState(false)
  const {
    user: { uid },
  } = useContext(AuthContext)

 

  // const userInfoCondition = useMemo(() => {
  //   return {
  //     fieldName: 'uid',
  //     operator: '==',
  //     compareValue: uid,
  //   }
  // }, [uid])
  // const userRef = useFirestore('users', userInfoCondition)
  // const userInfo = userRef[0]
  // console.log('userinfo', userInfo)

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
    setIsAddFriendVisible(false)
  }

  return (
    <AppContext.Provider
      value={{
        // userInfo,
        userAccountVisible,
        setUserAccountVisible,
        isAddFriendVisible,
        setIsAddFriendVisible,
        selectedUser,
        setSelectedUser,
        userInfoVisible,
        setUserInfoVisible,
        isRegisterVisible,
        setIsRegisterVisible,
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
