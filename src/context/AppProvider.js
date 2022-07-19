import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
} from 'react'
import useFirestore from '../hooks/useFirestore'
import { AuthContext } from './AuthProvider'

const initialState = {
  isRegisterVisible: false,
  isAddRoomVisible: false,
  isInviteMemberVisible: false,
  selectedRoomId: '',
  userInfoVisible: false,
  selectedUser: {},
  isFindFriendVisible: false,
  userAccountVisible: false,
  showUserStatus: false,
  emailRegister: {},
  isForgotPassVisible: false,
  modalConfirmLeaveVisible: false,
  modalUnfiendVisible: false,
  selectedRoomLeave: {},
  openGroupInfo: true,
  viewWidth: null,
  changeRoomNameVisible: false,
}

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.CLEAR_STATE:
      return initialState
    default:
      return { ...state, [action.type]: action.payload }
  }
}

export const ACTIONS = {
  TG_REGISTER: 'isRegisterVisible',
  TG_ADDROOM: 'isAddRoomVisible',
  TG_INVITE: 'isInviteMemberVisible',
  SELECTED_ROOM_ID: 'selectedRoomId',
  TG_USER_INFO: 'userInfoVisible',
  SELECTED_USER: 'selectedUser',
  TG_FIND_FRIEND: 'isFindFriendVisible',
  TG_ACCOUNT: 'userAccountVisible',
  TG_STATUS: 'showUserStatus',
  EMAIL: 'emailRegister',
  TG_FORGOT_PASS: 'isForgotPassVisible',
  TG_COMFIRM_LEAVE: 'modalConfirmLeaveVisible',
  TG_UNFRIEND: 'modalUnfiendVisible',
  SELECTED_ROOM_LEAVE: 'selectedRoomLeave',
  TG_GROUP_INFOR: 'openGroupInfo',
  VIEWWIDTH: 'viewWidth',
  TG_CHANGE_ROOM_NAME: 'changeRoomNameVisible',
  CLEAR_STATE: 'clearState',
}

export const AppContext = createContext()

export default function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  // const [isAddRoomVisible, setIsAddRoomVisible] = useState(false)
  // const [isInviteMemberVisible, setIsInviteMemberVisible] = useState(false)
  // const [selectedRoomId, setSelectedRoomId] = useState('')
  // const [userInfoVisible, setUserInfoVisible] = useState(false)
  // const [selectedUser, setSelectedUser] = useState({})
  // const [isFindFriendVisible, setIsFindFriendVisible] = useState(false)
  // const [userAccountVisible, setUserAccountVisible] = useState(false)
  // const [showUserStatus, setShowUserStatus] = useState(false)
  // const [emailRegister, setEmailRegister] = useState({})
  // const [isForgotPassVisible, setIsForgotPassVisible] = useState(false)
  // const [modalConfirmLeaveVisible, setModalConfirmLeaveVisible] =
  //   useState(false)
  // const [modalUnfiendVisible, setModalUnfiendVisible] = useState(false)
  // const [selectedRoomLeave, setSelectedRoomLeave] = useState({})
  // const [openGroupInfo, setOpenGroupInfo] = useState(true)
  // const [viewWidth, setViewWidth] = useState(null)
  // const [changeRoomNameVisible, setChangeRoomNameVisible] = useState(false)

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

  const roomsCondition = useMemo(() => {
    return {
      fieldName: 'members',
      operator: 'array-contains',
      compareValue: uid,
    }
  }, [uid])
  const rooms = useFirestore('rooms', roomsCondition)

  const selectedRoom = useMemo(
    () => rooms.find(room => room.id === state.selectedRoomId) || {},
    [rooms, state.selectedRoomId]
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

  const clearState = () => {
    dispatch({ type: ACTIONS.CLEAR_STATE })
  }

  return (
    <AppContext.Provider
      value={{
        selectedRoom,
        userInfo,
        status,
        rooms,
        members,
        clearState,
        state,
        dispatch,
      }}>
      {children}
    </AppContext.Provider>
  )
}
