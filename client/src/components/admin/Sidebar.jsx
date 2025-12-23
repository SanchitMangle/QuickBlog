import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, PenSquare, FileText, MessageSquare, LogOut, Settings, Home, Users } from 'lucide-react'
import { useAppContext } from '../../context/AppContext'

const Sidebar = () => {
    const { user } = useAppContext()

    const navItems = [
        { to: '/', icon: Home, label: 'Home' },
        { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
        { to: '/admin/addBlog', icon: PenSquare, label: 'New Post' },
        { to: '/admin/listBlog', icon: FileText, label: 'All Posts' },
        { to: '/admin/comments', icon: MessageSquare, label: 'Comments' },
    ]

    if (user?.role === 'admin') {
        navItems.push({ to: '/admin/users', icon: Users, label: 'Users' })
    }

    return (
        <aside className='w-20 md:w-64 flex flex-col border-r border-border bg-surface/50 backdrop-blur-2xl h-full transition-all duration-300 sticky top-0'>
            <div className="flex flex-col gap-2 p-4">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden
                            ${isActive
                                ? 'bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/10'
                                : 'text-text-muted hover:bg-white/5 hover:text-text-main hover:translate-x-1'}
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                                )}
                                <item.icon size={20} className={`transition-colors ${isActive ? 'text-primary' : 'text-text-muted group-hover:text-text-main'}`} />
                                <span className='hidden md:block font-medium tracking-wide'>{item.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>

            <div className="mt-auto p-4 border-t border-border">
                <NavLink
                    to={'/admin/settings'}
                    className={({ isActive }) => `
                            flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                            ${isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-text-muted hover:bg-white/5 hover:text-text-main'}
                        `}
                >
                    <Settings size={20} />
                    <span className='hidden md:block font-medium'>Settings</span>
                </NavLink>
            </div>
        </aside>
    )
}

export default Sidebar
