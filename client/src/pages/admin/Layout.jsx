import React from 'react'
import { assets } from '../../assets/assets'
import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/admin/Sidebar'
import { useAppContext } from '../../context/AppContext'
import { LogOut } from 'lucide-react'
import AIAssistant from '../../components/admin/AIAssistant'

const Layout = () => {

  const { axios, setToken, navigate, calculateReadingTime } = useAppContext()

  const logout = async () => {
    localStorage.removeItem('token')
    axios.defaults.headers.common['Authorization'] = null;
    setToken(null)
    navigate("/")
  }

  return (
    <div className='flex h-screen bg-background overflow-hidden selection:bg-primary/30 text-text-main'>
      {/* Sidebar - Desktop */}
      <div className='hidden md:block h-full'>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className='flex-1 flex flex-col h-full relative'>

        {/* Top Header */}
        <header className='h-16 border-b border-border bg-surface/50 backdrop-blur-md flex items-center justify-between px-6 z-10'>
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile Menu Trigger would go here */}
            <img src={assets.logo} alt="Logo" className='w-28' />
          </div>

          {/* Spacer for desktop if needed or Breadcrumbs */}
          <div className="hidden md:block font-medium text-text-muted">
            Admin Panel
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={logout}
              className='flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text-main transition-colors'
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className='flex-1 overflow-y-auto p-6 scroll-smooth'>
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Deep AI Assistant */}
        <AIAssistant />
      </div>
    </div>
  )
}

export default Layout
