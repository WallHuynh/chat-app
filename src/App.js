import './App.scss'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ChatRoom from './components/ChatRoom'
import AuthProvider from './context/AuthProvider'
import AppProvider from './context/AppProvider'
import Login from './components/Auth/Login'
import RegisterModal from './components/Auth/RegisterModal'
import AddRoomModal from './components/Modals/AddRoomModal'
import InviteMemberModal from './components/Modals/InviteMemberModal'
import UserInfoModal from './components/Modals/UserInfoModal'
import UserAccountModal from './components/Modals/UserAccountModal'
import FindFriendModal from './components/Modals/FindFriendModal'
import ForgotPasswordModal from './components/Modals/ForgotPasswordModal'
import ModalConfirmLeaveRoom from './components/Modals/ModalConfirmLeaveRoom'
import UnfriendConfirmModal from './components/Modals/UnfriendConfirmModal'
import ChangeRoomNameModal from './components/Modals/ChangeRoomNameModal'
import dotenv from 'dotenv'
dotenv.config()

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            <Route path='/' element={<ChatRoom />} />
            <Route path='/login' element={<Login />} />
          </Routes>
          <ChangeRoomNameModal />
          <UnfriendConfirmModal />
          <AddRoomModal />
          <RegisterModal />
          <FindFriendModal />
          <UserInfoModal />
          <UserAccountModal />
          <InviteMemberModal />
          <ForgotPasswordModal />
          <ModalConfirmLeaveRoom />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
