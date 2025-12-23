import React from 'react'
import { ArrowLeft, ArrowUpRight, BarChart3, Calendar, Download, Eye, Globe, LineChart, Map, Share2, TrendingUp, Users } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { useNavigate } from 'react-router-dom'

import { useAppContext } from '../../context/AppContext'
import Moment from 'moment'
import { useState, useEffect } from 'react'

const Analytics = () => {
    const { theme } = useTheme()
    const navigate = useNavigate()
    const { axios } = useAppContext()

    const [loading, setLoading] = useState(true)
    const [data, setData] = useState({
        trendData: [],
        stats: { totalViews: 0, totalLikes: 0, totalComments: 0, mobile: 0, desktop: 0, tablet: 0 }
    })

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const { data } = await axios.get('/api/admin/analytics-details')
                if (data.success) {
                    setData(data.analyticsData)
                }
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        fetchAnalytics()
    }, [])

    const trafficData = data.trendData.length > 0 ? data.trendData.map(item => ({
        name: Moment(item.date).format('MMM DD'),
        visits: item.views,
        organic: item.mobileViews + item.desktopViews + item.tabletViews // Just as a visual fill, since views is total
    })) : []

    const deviceData = [
        { name: 'Mobile', value: data.stats.mobile, color: '#6366f1' },
        { name: 'Desktop', value: data.stats.desktop, color: '#a855f7' },
        { name: 'Tablet', value: data.stats.tablet, color: '#ec4899' },
    ];

    return (
        <div className='flex-1 w-full pb-20'>

            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <button onClick={() => navigate(-1)} className="p-3 bg-surface border border-white/5 rounded-2xl text-text-muted hover:text-text-main hover:bg-white/5 transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className='text-3xl font-bold font-outfit text-text-main tracking-tight'>Analytics</h1>
                        <p className="text-text-muted text-sm mt-1">Deep dive into your content performance.</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-surface border border-white/10 rounded-xl text-sm font-medium text-text-muted hover:text-text-main hover:bg-white/5 transition-colors">
                        <Calendar size={16} /> Last 30 Days
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-colors">
                        <Download size={16} /> Export Report
                    </button>
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                    { label: 'Total Views', value: data.stats.totalViews.toLocaleString(), change: 'Total', icon: Eye, color: 'text-blue-500' },
                    { label: 'Total Interactions', value: (data.stats.totalLikes + data.stats.totalComments).toLocaleString(), change: 'Engage', icon: Users, color: 'text-purple-500' },
                    { label: 'Total Likes', value: data.stats.totalLikes.toLocaleString(), change: 'Likes', icon: BarChart3, color: 'text-orange-500' },
                    { label: 'Comments', value: data.stats.totalComments.toLocaleString(), change: 'Comm.', icon: Share2, color: 'text-green-500' }
                ].map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i}
                        className="bg-surface border border-white/5 p-6 rounded-3xl relative overflow-hidden group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 bg-white/5 rounded-2xl ${stat.color}`}>
                                <stat.icon size={22} />
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-lg bg-white/5 text-text-muted`}>
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-text-main mb-1">{stat.value}</h3>
                        <p className="text-sm text-text-muted font-medium">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Main Traffic Chart */}
                <div className="lg:col-span-2 bg-surface border border-white/5 rounded-3xl p-6 md:p-8 shadow-xl">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-text-main">Traffic Overview</h3>
                            <p className="text-sm text-text-muted">Total visits vs organic traffic</p>
                        </div>
                        <div className="flex gap-2">
                            {/* Legend could go here */}
                        </div>
                    </div>

                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trafficData}>
                                <defs>
                                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorOrganic" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#27272a' : '#e4e4e7'} vertical={false} strokeOpacity={0.5} />
                                <XAxis dataKey="name" stroke={theme === 'dark' ? "#71717a" : "#a1a1aa"} fontSize={12} tickLine={false} axisLine={false} dy={10} />
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
                                />
                                <Area type="monotone" dataKey="visits" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
                                <Area type="monotone" dataKey="organic" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorOrganic)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Device Distribution */}
                <div className="bg-surface border border-white/5 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col">
                    <h3 className="text-xl font-bold text-text-main mb-6">Device Breakdown</h3>
                    <div className="flex-1 min-h-[250px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={deviceData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {deviceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: theme === 'dark' ? 'rgba(10,10,10,0.8)' : 'rgba(255,255,255,0.8)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: '12px',
                                    }}
                                    itemStyle={{ color: theme === 'dark' ? '#fff' : '#000' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold text-text-main">
                                {data.stats.totalViews > 0
                                    ? Math.round((data.stats.mobile / data.stats.totalViews) * 100)
                                    : 0}%
                            </span>
                            <span className="text-xs text-text-muted uppercase tracking-wider">Mobile</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-6">
                        {deviceData.map((device, i) => (
                            <div key={i} className="text-center p-2 rounded-xl bg-white/5 relative overflow-hidden">
                                <div className={`w-2 h-2 rounded-full absolute top-2 right-2 mb-1`} style={{ backgroundColor: device.color }}></div>
                                <p className="text-xs text-text-muted mb-1">{device.name}</p>
                                <p className="font-bold text-text-main">{device.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* World Map / Geo Placeholder */}
            <div className="bg-surface border border-white/5 rounded-3xl p-8 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><Globe size={20} /></div>
                        <h3 className="text-xl font-bold text-text-main">Geographic Reach</h3>
                    </div>
                    <button className="text-sm text-primary font-medium hover:underline">View Full Report</button>
                </div>

                <div className="bg-black/20 rounded-2xl h-[300px] flex items-center justify-center border border-white/5">
                    <div className="text-center text-text-muted opacity-50">
                        <Map size={48} className="mx-auto mb-4" />
                        <p>Interactive Map Visualization</p>
                        <p className="text-xs">(Integration pending)</p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Analytics
