import React from 'react'
import { Routes, Route } from 'react-router'
import HomePage from './pages/home/HomePage'
import SignUpPage from './pages/auth/signup/SignUpPage'
import LoginPage from './pages/auth/login/LoginPage'
import Sidebar from './components/common/Sidebar'
import RightPanel from './components/common/RightPanel'
import NotificationPage from './pages/notification/NotificationPage'
import ProfilePage from './pages/profile/ProfilePage'
import { Toaster } from 'react-hot-toast'

const App = () => {
  return (
		<div className='flex max-w-6xl mx-auto'>
			<Sidebar/>
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/signup' element={<SignUpPage />} />
				<Route path='/login' element={<LoginPage />} />
				<Route path='/notifications' element={<NotificationPage />} />
				<Route path='/profile/:username' element={<ProfilePage/>} />
			</Routes>
			<RightPanel/>
			<Toaster/>
		</div>
	
  )
}

export default App
