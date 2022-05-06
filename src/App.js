import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ChatRoom from './components/ChatRoom'
import AuthProvider from './Context/AuthProvider'
import AppProvider from './Context/AppProvider'
import Login from './components/Login'
import Register from './components/Modals/Register'
import Shop from './components/Shop'
import AddRoomModal from './components/Modals/AddRoomModal'
import InviteMemberModal from './components/Modals/InviteMemberModal'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            <Route path='/' element={<ChatRoom />} />
            <Route path='/login' element={<Login />} />
            <Route path='/shop' element={<Shop />} />
          </Routes>
          <AddRoomModal />
          <Register />
          <InviteMemberModal />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
