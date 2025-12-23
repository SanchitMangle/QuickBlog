import React, { useEffect, useState } from 'react'
import BlogTableItems from '../../components/admin/BlogTableItems'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { FileText, MessageSquare, PenTool, TrendingUp, BarChart3, ArrowUpRight, Plus, Users, Settings } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Moment from 'moment'
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

const Dashboard = () => {
  const { theme } = useTheme()

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  const [dashboardData, setDashboardData] = useState({
    blogs: 0,
    comments: 0,
    drafts: 0,
    recentBlogs: [],
    analytics: []
  })

  // Mock data if analytics is empty for visualization
  const mockData = [
    { date: '2024-01-01', views: 400 },
    { date: '2024-01-02', views: 300 },
    { date: '2024-01-03', views: 200 },
    { date: '2024-01-04', views: 278 },
    { date: '2024-01-05', views: 189 },
    { date: '2024-01-06', views: 239 },
    { date: '2024-01-07', views: 349 },
  ];

  const { axios, navigate, user } = useAppContext()

  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get('/api/admin/dashboard')
      if (data.success) {
        setDashboardData(data.dashboardData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const stats = [
    { label: 'Total Blogs', value: dashboardData.blogs, icon: FileText, color: 'text-blue-500' },
    { label: 'Comments', value: dashboardData.comments, icon: MessageSquare, color: 'text-green-500' },
    { label: 'Drafts', value: dashboardData.drafts, icon: PenTool, color: 'text-orange-500' },
  ]

  const chartData = dashboardData.analytics?.length > 0
    ? dashboardData.analytics.map(item => ({ ...item, date: Moment(item.date).format('MMM DD') }))
    : mockData.map(item => ({ ...item, date: Moment(item.date).format('MMM DD') }));

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className='flex-1 w-full pb-20'
    >

      {/* Welcome & Quick Actions Section */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-sm font-medium text-text-muted bg-surface border border-white/5 px-3 py-1 rounded-full">
              {Moment().format('dddd, MMMM Do YYYY')}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text-main tracking-tight mt-2">
            Welcome back, <span className="text-primary">{user?.name?.split(' ')[0] || 'Admin'}</span>
          </h1>
          <p className="text-text-muted mt-2 text-lg">Here's what's happening with your content today.</p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin/addBlog')} className="flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-transform active:scale-95">
            <Plus size={20} /> New Post
          </button>
        </div>
      </motion.div>

      {/* Stats Grid - Spotlight Effect */}
      <motion.div variants={itemVariants} className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        {stats.map((stat, index) => (
          <div key={index} className='spotlight-card group relative overflow-hidden bg-surface border border-white/5 p-6 rounded-3xl hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500'>
            <div className="relative z-10 flex items-center gap-4">
              <div className={`p-4 rounded-2xl bg-surface-glass border border-white/5 group-hover:border-primary/20 transition-colors ${stat.color}`}>
                <stat.icon size={28} />
              </div>
              <div>
                <p className="text-4xl font-bold font-outfit text-text-main tracking-tight">{stat.value}</p>
                <p className="text-sm text-text-muted font-medium uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            </div>
            {/* Background Decor */}
            <div className={`absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-10 transition-opacity duration-500 ${stat.color}`}>
              <stat.icon size={140} />
            </div>
          </div>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Analytics Chart */}
        <div className="lg:col-span-2 bg-surface/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div className='flex items-center gap-3'>
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <BarChart3 size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-text-main">Performance</h3>
                <p className="text-xs text-text-muted">Views over time</p>
              </div>
            </div>
            <select className='bg-surface border border-white/10 text-xs rounded-lg px-3 py-1.5 outline-none text-text-muted focus:border-primary hover:bg-white/5 transition-colors cursor-pointer'>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#27272a' : '#e4e4e7'} vertical={false} strokeOpacity={0.5} />
                <XAxis dataKey="date" stroke={theme === 'dark' ? "#71717a" : "#a1a1aa"} fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke={theme === 'dark' ? "#71717a" : "#a1a1aa"} fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? 'rgba(10,10,10,0.8)' : 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }}
                  itemStyle={{ color: theme === 'dark' ? '#fff' : '#000' }}
                  labelStyle={{ color: theme === 'dark' ? '#a1a1aa' : '#71717a', marginBottom: '8px', display: 'block' }}
                  cursor={{ stroke: 'var(--color-primary)', strokeWidth: 1, strokeDasharray: '5 5' }}
                />
                <Area type="monotone" dataKey="views" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" activeDot={{ r: 6, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Post (Mock for now) */}
        <div className="bg-gradient-to-br from-surface to-surface/50 border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-primary/20 transition-colors flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp size={150} className="text-primary" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6 text-green-500 font-bold tracking-wide text-xs uppercase">
              <TrendingUp size={14} />
              <span>Trending Now</span>
            </div>

            <div className="mt-4">
              <p className="text-sm text-text-muted mb-3 font-medium">Most Views (7d)</p>
              <h4 className="text-3xl font-bold text-text-main mb-6 leading-tight line-clamp-3">The Future of AI in Blogging</h4>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex flex-col p-3 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/5">
                  <span className="text-xs text-text-muted mb-1">Views</span>
                  <span className="font-bold text-white text-xl">1,234</span>
                </div>
                <div className="flex flex-col p-3 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/5">
                  <span className="text-xs text-text-muted mb-1">Likes</span>
                  <span className="font-bold text-green-400 text-xl">89</span>
                </div>
              </div>
            </div>
          </div>

          <button onClick={() => navigate('/admin/analytics')} className="relative z-10 w-full py-3 bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 rounded-xl text-sm font-semibold text-text-muted transition flex items-center justify-center gap-2 group-hover:border-primary/30 group-hover:bg-primary/5 group-hover:text-primary">
            Analytics Details <ArrowUpRight size={16} />
          </button>
        </div>
      </motion.div>

      {/* Recent Blogs Section */}
      <motion.div variants={itemVariants} className='bg-surface border border-border rounded-3xl overflow-hidden shadow-lg'>
        <div className='p-6 border-b border-border flex items-center justify-between'>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
              <FileText size={20} />
            </div>
            <h2 className='text-lg font-bold text-text-main'>Latest Stories</h2>
          </div>
          <button onClick={() => navigate('/admin/listBlog')} className="text-sm text-text-muted hover:text-text-main hover:underline transition-colors">
            View All
          </button>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full text-left'>
            <thead className='bg-surface-glass backdrop-blur-md text-xs uppercase text-text-muted font-bold tracking-wider'>
              <tr>
                <th className='px-6 py-5'>#</th>
                <th className='px-6 py-5'>Title</th>
                <th className='px-6 py-5'>Date</th>
                <th className='px-6 py-5'>Status</th>
                <th className='px-6 py-5'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {dashboardData.recentBlogs.map((blog, index) => (
                <BlogTableItems key={blog._id} blog={blog} fetchBlogs={fetchDashboardData} index={index + 1} />
              ))}
              {dashboardData.recentBlogs.length === 0 && (
                <tr>
                  <td colSpan="5" className='px-6 py-12 text-center text-text-muted flex flex-col items-center justify-center'>
                    <FileText size={48} className="opacity-20 mb-4" />
                    <p>No recent blogs found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

    </motion.div>
  )
}

export default Dashboard
