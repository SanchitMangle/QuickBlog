import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAppContext } from './context/AppContext'
import { ConfirmationProvider } from './context/ConfirmationContext'
import Loader from './components/Loader'
import 'quill//dist/quill.snow.css'

// Lazy Load Components
const Home = lazy(() => import('./pages/Home'))
const Blog = lazy(() => import('./pages/Blog'))
const Login = lazy(() => import('./pages/auth/Login'))
const Register = lazy(() => import('./pages/auth/Register'))
const Profile = lazy(() => import('./pages/Profile'))

// Admin Components
const Layout = lazy(() => import('./pages/admin/Layout'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const Addblog = lazy(() => import('./pages/admin/Addblog'))
const ListBlog = lazy(() => import('./pages/admin/ListBlog'))
const Comment = lazy(() => import('./pages/admin/Comment'))
const Users = lazy(() => import('./pages/admin/Users'))
const Analytics = lazy(() => import('./pages/admin/Analytics'))
const AdminLogin = lazy(() => import('./components/admin/Login'))

const App = () => {

  const { token } = useAppContext()

  return (
    <div className='bg-background min-h-screen'>
      <Toaster />
      <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader /></div>}>
        <ConfirmationProvider>
          <div className="w-full mx-auto">
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/blog/:id' element={<Blog />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/admin' element={token ? <Layout /> : <AdminLogin />}>
                <Route index element={<Dashboard />} />
                <Route path='addBlog' element={<Addblog />} />
                <Route path='listBlog' element={<ListBlog />} />
                <Route path='comments' element={<Comment />} />
                <Route path='users' element={<Users />} />
                <Route path='analytics' element={<Analytics />} />
              </Route>
            </Routes>
          </div>
        </ConfirmationProvider>
      </Suspense>
    </div>
  )
}

export default App
