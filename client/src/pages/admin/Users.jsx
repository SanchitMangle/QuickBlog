import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { toast } from 'react-hot-toast'
import { User as UsersIcon, Shield, Calendar, Edit2, Check, X } from 'lucide-react'
import moment from 'moment'
import { motion } from 'framer-motion'

const Users = () => {
    const { axios, user } = useAppContext()
    const [users, setUsers] = useState([])
    const [editingId, setEditingId] = useState(null)
    const [selectedRole, setSelectedRole] = useState('')

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get('/api/users')
            if (data.success) {
                setUsers(data.users)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    const handleRoleUpdate = async (id) => {
        try {
            const { data } = await axios.put(`/api/users/${id}/role`, { role: selectedRole })
            if (data.success) {
                toast.success('User role updated')
                setUsers(users.map(u => u._id === id ? { ...u, role: selectedRole } : u))
                setEditingId(null)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update role')
        }
    }

    const startEditing = (user) => {
        setEditingId(user._id)
        setSelectedRole(user.role)
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='flex-1 w-full pb-20'
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="p-3 bg-primary/10 rounded-2xl text-primary border border-primary/10">
                        <UsersIcon size={24} />
                    </div>
                    <div>
                        <h1 className='text-3xl font-bold font-outfit text-text-main tracking-tight'>User Management</h1>
                        <p className="text-text-muted text-sm mt-1">Manage user roles and permissions.</p>
                    </div>
                </div>

                <div className='flex items-center gap-3 bg-surface border border-white/5 px-4 py-2 rounded-xl text-sm font-medium'>
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className='text-text-muted'>Total Users:</span>
                    <span className='text-text-main font-bold'>{users.length}</span>
                </div>
            </div>

            {/* Table Container */}
            <div className='bg-surface border border-white/5 rounded-3xl overflow-hidden shadow-2xl shadow-black/20'>
                <div className='overflow-x-auto'>
                    <table className='w-full text-left'>
                        <thead className='bg-surface-glass border-b border-white/5 text-xs font-bold uppercase text-text-muted tracking-wider'>
                            <tr>
                                <th className='px-8 py-5'>User</th>
                                <th className='px-8 py-5'>Email</th>
                                <th className='px-8 py-5'>Role</th>
                                <th className='px-8 py-5'>Joined</th>
                                <th className='px-8 py-5 text-right'>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-white/5'>
                            {users.map((u, i) => (
                                <motion.tr
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={u._id}
                                    className='hover:bg-white/5 transition-colors group'
                                >
                                    <td className='px-8 py-5'>
                                        <div className='flex items-center gap-4'>
                                            <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-purple-600/20 border border-white/10 flex items-center justify-center text-primary font-bold text-sm shadow-inner'>
                                                {u.name[0]?.toUpperCase()}
                                            </div>
                                            <span className='font-bold text-text-main'>{u.name}</span>
                                        </div>
                                    </td>
                                    <td className='px-8 py-5 text-text-muted font-medium'>{u.email}</td>
                                    <td className='px-8 py-5'>
                                        <div className="relative">
                                            {editingId === u._id ? (
                                                <select
                                                    value={selectedRole}
                                                    onChange={(e) => setSelectedRole(e.target.value)}
                                                    className='bg-background border border-primary text-text-main text-sm rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary/20 shadow-lg'
                                                    autoFocus
                                                >
                                                    <option value="user">User</option>
                                                    <option value="author">Author</option>
                                                    <option value="editor">Editor</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            ) : (
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border ${u.role === 'admin' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                    u.role === 'editor' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                        u.role === 'author' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                            'bg-white/5 text-text-muted border-white/10'
                                                    }`}>
                                                    <Shield size={10} />
                                                    {u.role}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className='px-8 py-5 text-text-muted text-sm font-medium'>
                                        <div className='flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity'>
                                            <Calendar size={14} />
                                            {moment(u.createdAt).format('MMM DD, YYYY')}
                                        </div>
                                    </td>
                                    <td className='px-8 py-5 text-right'>
                                        {editingId === u._id ? (
                                            <div className='flex items-center justify-end gap-2'>
                                                <button onClick={() => handleRoleUpdate(u._id)} className='p-2 bg-green-500/20 text-green-500 rounded-lg hover:bg-green-500/30 transition shadow-lg shadow-green-500/10'>
                                                    <Check size={16} />
                                                </button>
                                                <button onClick={() => setEditingId(null)} className='p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition shadow-lg shadow-red-500/10'>
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button onClick={() => startEditing(u)} className='p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0'>
                                                <Edit2 size={16} />
                                            </button>
                                        )}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    )
}

export default Users
