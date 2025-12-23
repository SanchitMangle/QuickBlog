import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Moment from 'moment'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { ThumbsUp, Bookmark, MessageCircle, Share2, User } from 'lucide-react'
import { Helmet } from 'react-helmet-async'

const Blog = () => {

    const { axios, user, navigate } = useAppContext()
    const { id } = useParams()

    const [data, setData] = useState(null)
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)

    // Interaction State
    const [liked, setLiked] = useState(false)
    const [bookmarked, setBookmarked] = useState(false)
    const [likesCount, setLikesCount] = useState(0)

    // Comment Form
    const [commentContent, setCommentContent] = useState('')

    const fetchBlogData = async () => {
        try {
            const { data } = await axios.get(`api/blog/${id}`)
            if (data.success) {
                setData(data.blog)
                setLikesCount(data.blog.stats?.likes || 0)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to load blog")
        } finally {
            setLoading(false)
        }
    }

    const fetchInteractions = async () => {
        if (!user) return;
        try {
            const { data } = await axios.get(`/api/interactions/status?blogId=${id}`)
            if (data.success) {
                setLiked(data.status.liked)
                setBookmarked(data.status.bookmarked)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const fetchComments = async () => {
        try {
            const { data } = await axios.post(`/api/blog/comments`, { blogId: id })
            if (data.success) setComments(data.comments)
        } catch (error) {
            console.log(error);
        }
    }

    const handleLike = async () => {
        if (!user) return toast.error("Please login to like")
        // Optimistic UI update
        const prevLiked = liked
        const prevCount = likesCount
        setLiked(!liked)
        setLikesCount(prevLiked ? prevCount - 1 : prevCount + 1)

        try {
            const { data } = await axios.post('/api/interactions/like', { blogId: id })
            if (!data.success) {
                // Revert on failure
                setLiked(prevLiked)
                setLikesCount(prevCount)
                toast.error(data.message)
            }
        } catch (error) {
            setLiked(prevLiked)
            setLikesCount(prevCount)
            toast.error("Failed to like")
        }
    }

    const handleBookmark = async () => {
        if (!user) return toast.error("Please login to bookmark")
        const prevBookmarked = bookmarked
        setBookmarked(!bookmarked)

        try {
            const { data } = await axios.post('/api/interactions/bookmark', { blogId: id })
            if (data.success) {
                toast.success(data.message)
            } else {
                setBookmarked(prevBookmarked)
                toast.error(data.message)
            }
        } catch (error) {
            setBookmarked(prevBookmarked)
            toast.error("Failed to bookmark")
        }
    }

    const addComment = async (e) => {
        e.preventDefault()
        if (!user) return toast.error("Please login to comment")
        if (!commentContent.trim()) return

        try {
            const { data } = await axios.post(`/api/blog/add-comment`, {
                blog: id,
                user: user.id, // Send user ID if backend expects it or relies on token
                name: user.name, // Fallback for legacy schema
                content: commentContent
            })
            if (data.success) {
                toast.success("Comment added!")
                setCommentContent('')
                fetchComments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchBlogData()
        fetchComments()
    }, [id])

    useEffect(() => {
        if (user && id) {
            fetchInteractions()
        }
    }, [user, id])

    if (loading) return <Loader />
    if (!data) return <div className='text-center mt-20 text-text-main'>Blog not found</div>

    return (
        <div className='relative min-h-screen bg-background text-text-main'>
            <Navbar />

            {/* Hero / Header */}
            <div className='bg-surface border-b border-border'>
                <div className='max-w-5xl mx-auto px-6 py-12 md:py-20 text-center relative'>

                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className='absolute left-6 top-8 md:top-12 md:left-0 lg:-ml-12 flex items-center gap-2 text-text-muted hover:text-primary transition-colors'
                        aria-label="Go back"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
                        <span className='hidden md:inline font-medium text-sm'>Back</span>
                    </button>

                    <p className='text-primary font-bold tracking-widest uppercase text-xs mb-6 bg-primary/10 inline-block px-4 py-1.5 rounded-full border border-primary/20'>{data.category}</p>
                    <h1 className='text-3xl md:text-5xl lg:text-6xl font-black font-outfit text-text-main mb-8 leading-tight max-w-4xl mx-auto'>{data.title}</h1>
                    <h2 className='text-lg md:text-2xl text-text-muted mb-10 font-normal max-w-2xl mx-auto leading-relaxed'>{data.subTitle}</h2>

                    <div className='flex items-center justify-center gap-4 text-sm text-text-muted'>
                        <div className='flex items-center gap-3 bg-surface-glass px-5 py-2 rounded-full border border-border/50'>
                            <div className='w-8 h-8 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full flex items-center justify-center border border-primary/20'>
                                <User size={16} className='text-primary' />
                            </div>
                            <div className='text-left flex items-center gap-2'>
                                <span className='font-bold text-text-main'>{data.author?.name || "QuickBlog Team"}</span>
                                <span className='w-1 h-1 bg-text-muted rounded-full'></span>
                                <span>{Moment(data.createdAt).format('MMM Do, YYYY')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className='max-w-5xl mx-auto px-6 py-12'>
                {/* Main Image */}
                <div className='relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-primary/5 mb-10 border border-border'>
                    <img src={data.image} alt={data.title} className='w-full h-full object-cover' />
                </div>

                {/* Interaction Bar */}
                <div className='flex items-center justify-between border-y border-border py-4 mb-10 bg-surface/30 px-6 rounded-xl backdrop-blur-sm'>
                    <div className='flex gap-6'>
                        <button onClick={handleLike} aria-label={liked ? "Unlike this article" : "Like this article"} className={`flex items-center gap-2 transition ${liked ? 'text-red-500' : 'text-text-muted hover:text-red-500'}`}>
                            <ThumbsUp size={22} fill={liked ? "currentColor" : "none"} />
                            <span className='font-medium'>{likesCount} Likes</span>
                        </button>
                        <button onClick={handleBookmark} aria-label={bookmarked ? "Remove from bookmarks" : "Save to bookmarks"} className={`flex items-center gap-2 transition ${bookmarked ? 'text-primary' : 'text-text-muted hover:text-primary'}`}>
                            <Bookmark size={22} fill={bookmarked ? "currentColor" : "none"} />
                            <span className='font-medium'>{bookmarked ? 'Saved' : 'Save'}</span>
                        </button>
                    </div>
                    <div className='flex gap-4'>
                        <button aria-label="Share this article" className='text-text-muted hover:text-text-main dark:hover:text-white transition'>
                            <Share2 size={22} />
                        </button>
                    </div>
                </div>

                {/* Rich Text Content */}
                <div className='prose prose-lg md:prose-xl prose-invert max-w-none prose-img:rounded-xl prose-headings:font-outfit prose-headings:font-bold prose-headings:text-text-main prose-p:text-text-muted prose-li:text-text-muted prose-strong:text-text-main prose-a:text-primary prose-a:no-underline hover:prose-a:underline'
                    dangerouslySetInnerHTML={{ __html: data.description }}></div>

                {/* Tags */}
                {data.tags && data.tags.length > 0 && (
                    <div className='flex flex-wrap gap-2 mt-12 pt-8 border-t border-border'>
                        {data.tags.map((tag, i) => (
                            <span key={i} className='bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium'>#{tag}</span>
                        ))}
                    </div>
                )}

                {/* Comments Section */}
                <div className='mt-16 pt-10 border-t border-border'>
                    <h3 className='text-2xl font-bold text-text-main mb-8 flex items-center gap-2'>
                        <MessageCircle size={28} className='text-primary' />
                        Comments ({comments.length})
                    </h3>

                    {/* Add Comment */}
                    <div className='bg-surface p-6 rounded-xl shadow-sm border border-border mb-10'>
                        {!user ? (
                            <div className='text-center py-6'>
                                <p className='text-text-muted mb-4'>Please login to join the conversation.</p>
                                <button onClick={() => navigate('/login')} className='px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition'>
                                    Login to Comment
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={addComment}>
                                <div className='flex items-start gap-4'>
                                    <div className='w-10 h-10 bg-primary/20 text-primary rounded-full flex items-center justify-center font-bold border border-primary/30'>
                                        {user.name[0]}
                                    </div>
                                    <div className='flex-1'>
                                        <textarea
                                            value={commentContent}
                                            onChange={(e) => setCommentContent(e.target.value)}
                                            placeholder='Write a thoughtful comment...'
                                            className='w-full p-4 bg-background border border-border rounded-lg focus:border-primary outline-none resize-none h-32 text-text-main placeholder-text-muted transition'
                                            required
                                        ></textarea>
                                        <div className='flex justify-end mt-3'>
                                            <button type="submit" className='bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition font-medium shadow-lg shadow-primary/20'>
                                                Post Comment
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Comments List */}
                    <div className='space-y-6'>
                        {comments.length === 0 ? (
                            <p className='text-text-muted italic text-center py-8 bg-surface/30 rounded-xl border border-border mt-4'>No comments yet. Be the first to share your thoughts!</p>
                        ) : (
                            comments.map((item, index) => (
                                <div key={index} className='bg-surface p-6 rounded-xl border border-border hover:border-primary/30 transition-colors group'>
                                    <div className='flex items-center justify-between mb-3'>
                                        <div className='flex items-center gap-3'>
                                            <div className='w-10 h-10 bg-background rounded-full flex items-center justify-center border border-border group-hover:border-primary/50 transition-colors'>
                                                <User size={18} className='text-text-muted' />
                                            </div>
                                            <div>
                                                <p className='font-semibold text-text-main'>{item.name || item.user?.name || "Guest"}</p>
                                                <p className='text-xs text-text-muted'>{Moment(item.createdAt).fromNow()}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className='text-text-muted leading-relaxed ml-13 group-hover:text-text-main transition-colors'>{item.content}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
            <Footer />
        </div>
    )
}

export default Blog
