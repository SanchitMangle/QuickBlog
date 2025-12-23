import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets.js'
import { useAppContext } from '../context/AppContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { User, LogOut, LayoutDashboard, Menu, X, Sun, Moon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {

  const { navigate, user, logout } = useAppContext()
  const { theme, toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed left-0 right-0 z-50 flex justify-center transition-all duration-500 ${scrolled ? 'top-6 px-4' : 'top-0 px-6 py-6'}`}
      >
        <div className={`
          flex items-center justify-between w-full max-w-7xl transition-all duration-500
          ${scrolled
            ? 'bg-surface-glass backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl px-6 py-3 md:py-3'
            : 'bg-transparent border-transparent px-0 py-0'}
        `}>
          {/* Logo */}
          <div onClick={() => navigate('/')} className='cursor-pointer group flex items-center gap-2'>
            {theme === 'dark' ? (
              <img src={assets.logo_light} alt="QuickBlog" className='w-28 sm:w-32 transition-transform duration-300 group-hover:scale-105' />
            ) : (
              <img src={assets.logo} alt="QuickBlog" className='w-28 sm:w-32 transition-transform duration-300 group-hover:scale-105' />
            )}
          </div>

          {/* Desktop Actions */}
          <div className='hidden md:flex items-center gap-8'>
            {/* Navigation Links (could be added here) */}

            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className='p-2 rounded-full text-text-muted hover:text-text-main hover:bg-white/5 transition-all active:scale-95'
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {user ? (
                <div className='flex items-center gap-2 pl-4 border-l border-white/10'>
                  {/* Dashboard */}
                  {(user.role === 'admin' || user.role === 'editor') && (
                    <button onClick={() => navigate('/admin')}
                      className='flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-text-muted hover:text-text-main hover:bg-white/5 transition-colors'>
                      <LayoutDashboard size={16} />
                      <span className='hidden lg:inline'>Dashboard</span>
                    </button>
                  )}

                  {/* Profile */}
                  <div className="relative group">
                    <button onClick={() => navigate('/profile')}
                      className='flex items-center gap-2 pl-2 pr-1'>
                      <div className='w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-purple-500 p-[2px] cursor-pointer hover:scale-105 transition-transform'>
                        <div className='w-full h-full rounded-full bg-surface flex items-center justify-center border border-white/10 overflow-hidden'>
                          {user.image ? <img src={user.image} className="w-full h-full object-cover" /> : <span className='text-xs font-bold text-white'>{user.name[0]}</span>}
                        </div>
                      </div>
                    </button>
                  </div>

                  <button onClick={logout} title="Logout"
                    className='p-2 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors ml-2'>
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <div className='flex items-center gap-3'>
                  <button onClick={() => navigate('/login')} className='text-text-muted hover:text-text-main font-medium text-sm px-4 py-2 transition-colors'>
                    Log in
                  </button>
                  <button onClick={() => navigate('/register')} className='group relative px-6 py-2.5 rounded-full bg-primary text-white text-sm font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 overflow-hidden transition-all hover:scale-105 active:scale-95'>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                    <span className="relative">Get Started</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className='md:hidden flex items-center gap-4'>
            <button
              onClick={toggleTheme}
              className='w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-text-muted hover:text-text-main transition-colors'
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              className='w-10 h-10 flex items-center justify-center text-text-main hover:bg-white/5 rounded-full transition-colors'
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Spacer */}
      <div className='h-24'></div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden'
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className='absolute top-0 right-0 h-full w-[300px] bg-surface border-l border-white/10 p-6 shadow-2xl flex flex-col'
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-bold text-xl text-text-main">Menu</span>
                <button onClick={() => setMobileMenuOpen(false)} className='p-2 hover:bg-white/10 rounded-full text-text-muted transition-colors'>
                  <X size={24} />
                </button>
              </div>

              <div className='flex flex-col gap-2'>
                <button onClick={() => { navigate('/'); setMobileMenuOpen(false) }} className='text-lg font-medium text-text-muted hover:text-text-main text-left py-3 px-4 rounded-xl hover:bg-white/5 transition-colors'>Home</button>
                <div className="h-px bg-white/5 my-2"></div>
                {user ? (
                  <>
                    <div className='flex items-center gap-4 px-4 py-4 mb-4 bg-white/5 rounded-2xl'>
                      <div className='w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-500 p-[1px]'>
                        <div className='w-full h-full rounded-full bg-surface flex items-center justify-center text-white font-bold'>
                          {user.name[0]}
                        </div>
                      </div>
                      <div>
                        <p className='text-sm font-bold text-text-main'>{user.name}</p>
                        <p className='text-xs text-text-muted truncate w-32'>{user.email}</p>
                      </div>
                    </div>

                    {(user.role === 'admin' || user.role === 'editor') && (
                      <button onClick={() => { navigate('/admin'); setMobileMenuOpen(false) }} className='flex items-center gap-3 text-text-muted hover:text-text-main text-left py-3 px-4 rounded-xl hover:bg-white/5 transition-colors'>
                        <LayoutDashboard size={18} /> Dashboard
                      </button>
                    )}
                    <button onClick={() => { navigate('/profile'); setMobileMenuOpen(false) }} className='flex items-center gap-3 text-text-muted hover:text-text-main text-left py-3 px-4 rounded-xl hover:bg-white/5 transition-colors'>
                      <User size={18} /> Profile
                    </button>
                    <button onClick={() => { logout(); setMobileMenuOpen(false) }} className='flex items-center gap-3 text-red-400 hover:text-red-300 text-left py-3 px-4 rounded-xl hover:bg-red-500/10 transition-colors mt-auto'>
                      <LogOut size={18} /> Logout
                    </button>
                  </>
                ) : (
                  <div className='flex flex-col gap-3 mt-4'>
                    <button onClick={() => { navigate('/login'); setMobileMenuOpen(false) }} className='w-full py-3 rounded-xl border border-white/10 text-text-main font-medium hover:bg-white/5 transition-colors'>
                      Log In
                    </button>
                    <button onClick={() => { navigate('/register'); setMobileMenuOpen(false) }} className='w-full py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20'>
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
