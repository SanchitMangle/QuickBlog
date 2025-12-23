import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import Navbar from '../components/Navbar'
import BlogCard from '../components/BlogCard'
import { User, Bookmark, Heart, Grid } from 'lucide-react'
import Loader from '../components/Loader'
import { motion, AnimatePresence } from 'framer-motion'
import Footer from '../components/Footer'

const Profile = () => {
    const { user, navigate, axios } = useAppContext();
    const [interactions, setInteractions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchUserInteractions();
    }, [user]);

    const fetchUserInteractions = async () => {
        try {
            const { data } = await axios.get('/api/interactions/status');
            if (data.success) {
                setInteractions(data.interactions);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const bookmarks = interactions.filter(i => i.type === 'bookmark').map(i => i.blog);

    if (loading) return <div className='bg-background min-h-screen'><Loader /></div>

    return (
        <div className='bg-background min-h-screen text-text-main flex flex-col'>
            <Navbar />

            <div className='max-w-7xl mx-auto px-6 py-12 flex-grow w-full'>
                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className='bg-surface/50 backdrop-blur-xl p-8 rounded-3xl border border-border mb-12 relative overflow-hidden'
                >
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2" />

                    <div className='flex flex-col md:flex-row items-center gap-8 relative z-10'>
                        <div className='w-32 h-32 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-white text-5xl font-bold shadow-2xl ring-4 ring-text-main/5'>
                            {user?.name[0]}
                        </div>
                        <div className='text-center md:text-left'>
                            <h1 className='text-4xl font-bold text-text-main mb-2'>{user?.name}</h1>
                            <p className='text-text-muted mb-6'>{user?.email}</p>
                            <div className='flex flex-wrap justify-center md:justify-start gap-4'>
                                <span className='px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-bold border border-primary/20 capitalize flex items-center gap-2'>
                                    <User size={14} />
                                    {user?.role}
                                </span>
                                <span className='px-4 py-1.5 bg-background border border-border text-text-muted rounded-full text-sm font-medium flex items-center gap-2'>
                                    <Bookmark size={14} />
                                    {bookmarks.length} Saved Articles
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Content Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <div className='flex items-center gap-3 mb-8 pb-4 border-b border-border'>
                        <Grid className='text-primary' size={24} />
                        <h2 className='text-2xl font-bold text-text-main'>Reading List</h2>
                    </div>

                    <AnimatePresence>
                        {bookmarks.length > 0 ? (
                            <motion.div layout className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
                                {bookmarks.map((blog) => (
                                    blog ? <BlogCard key={blog._id} blog={blog} /> : null
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className='text-center py-32 bg-surface/30 rounded-3xl border border-border border-dashed flex flex-col items-center'
                            >
                                <div className='w-16 h-16 bg-text-main/5 rounded-full flex items-center justify-center mb-6'>
                                    <Bookmark size={32} className='text-text-muted opacity-50' />
                                </div>
                                <h3 className='text-xl font-bold text-text-main mb-2'>Your list is empty</h3>
                                <p className='text-text-muted mb-8 max-w-sm mx-auto'>Save articles you want to read later. They will appear here for easy access.</p>
                                <button onClick={() => navigate('/')} className='px-6 py-2.5 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20'>
                                    Explore Articles
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            <Footer />
        </div>
    )
}

export default Profile
