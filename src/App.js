import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ChatRoom from './components/ChatRoom'
import AuthProvider from './Context/AuthProvider'
import AppProvider from './Context/AppProvider'
import Login from './components/Login'
import Register from './components/Modals/Register'
import AddRoomModal from './components/Modals/AddRoomModal'
import InviteMemberModal from './components/Modals/InviteMemberModal'
import UserInfoModal from './components/Modals/UserInfoModal'
import AddFriendModal from './components/Modals/AddFriendModal'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            <Route path='/' element={<ChatRoom />} />
            <Route path='/login' element={<Login />} />
          </Routes>
          <AddRoomModal />
          <Register />
          <AddFriendModal />
          <UserInfoModal />
          <InviteMemberModal />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
