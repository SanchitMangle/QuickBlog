
import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import NewsLetter from '../components/NewsLetter'
import Footer from '../components/Footer'
import { useAppContext } from '../context/AppContext'
import { blogCategories } from '../assets/assets'
import { Search, Sparkles, Command } from 'lucide-react'
import BlogCard from '../components/BlogCard'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'

const Home = () => {
  const { blogs } = useAppContext();
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const searchInputRef = React.useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!blogs) return;
    let temp = blogs;
    if (category !== "All") {
      temp = temp.filter(blog => blog.category === category);
    }
    if (search) {
      temp = temp.filter(blog => blog.title.toLowerCase().includes(search.toLowerCase()));
    }
    setFilteredBlogs(temp);
  }, [blogs, category, search]);

  return (
    <div className='bg-background min-h-screen text-text-main selection:bg-primary/30 overflow-x-hidden'>
      <Helmet>
        <title>QuickBlog | Modern Publishing for the AI Era</title>
        <meta name="description" content="Share your stories with the world on a platform built for speed and aesthetics." />
      </Helmet>

      <Navbar />

      {/* Cinematic Hero Wrapper */}
      <Header />

      {/* Filter & Search Section - Floating Control Bar */}
      <div className='max-w-7xl mx-auto px-6 -mt-12 relative z-20'>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className='flex flex-col lg:flex-row justify-between items-center gap-4 p-2 rounded-3xl bg-surface/60 backdrop-blur-2xl border border-white/10 shadow-2xl ring-1 ring-white/5'
        >
          {/* Categories Pill List */}
          <div className='flex gap-2 overflow-x-auto w-full lg:w-auto p-2 scrollbar-hide mask-linear-fade'>
            {blogCategories.map((cat, index) => (
              <button key={index} onClick={() => setCategory(cat)}
                className={`relative px-5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 whitespace-nowrap z-10 
                  ${category === cat
                    ? 'text-white'
                    : 'text-text-muted hover:text-text-main hover:bg-white/5'}`}>
                {category === cat && (
                  <motion.div
                    layoutId="category-pill"
                    className="absolute inset-0 bg-primary/90 rounded-2xl -z-10 shadow-lg shadow-primary/25"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {cat}
              </button>
            ))}
          </div>

          {/* Command-style Search - Premium Upgrade */}
          <div className='relative w-full lg:w-96 group mx-2 mb-2 lg:mb-0 lg:focus-within:w-[500px] transition-all duration-500 ease-out'>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-purple-500/30 to-blue-500/30 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <div className='relative flex items-center bg-black/20 border border-white/10 rounded-2xl px-5 py-3.5 transition-all group-focus-within:bg-black/40 group-focus-within:border-white/20 group-focus-within:shadow-lg'>
              <Search className='text-text-muted group-focus-within:text-primary transition-colors mr-3' size={20} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search stories, topics, or authors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='flex-1 bg-transparent border-none outline-none focus:outline-none focus-visible:outline-none text-text-main placeholder-text-muted/40 text-sm font-medium h-full w-full'
              />
              {search ? (
                <button
                  onClick={() => setSearch('')}
                  className='p-1 rounded-full bg-white/10 hover:bg-white/20 text-text-muted hover:text-text-main transition-colors mr-2'
                >
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                  </motion.div>
                </button>
              ) : (
                <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] text-text-muted font-bold font-mono group-focus-within:bg-primary/20 group-focus-within:text-primary group-focus-within:border-primary/20 transition-all">
                  <Command size={10} /> K
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Blog Grid with Staggered Reveal */}
      <div className='max-w-7xl mx-auto px-6 py-24'>
        <div className="flex items-center gap-3 mb-12">
          <Sparkles className="text-primary" size={20} />
          <h2 className="text-2xl font-bold text-text-main">Latest Stories</h2>
        </div>

        <motion.div
          layout
          className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12'
        >
          <AnimatePresence mode='popLayout'>
            {filteredBlogs.length > 0 ? (
              filteredBlogs.map((blog, index) => (
                <BlogCard key={blog._id} blog={blog} index={index} />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className='col-span-full py-32 flex flex-col items-center justify-center text-center'
              >
                <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center mb-6 border border-border">
                  <Search className="text-text-muted opacity-50" size={32} />
                </div>
                <h3 className='text-xl font-bold text-text-main mb-2'>No articles found</h3>
                <p className='text-text-muted mb-8 max-w-sm'>We couldn't find any articles matching your current filters.</p>
                <button
                  onClick={() => { setCategory('All'); setSearch('') }}
                  className='px-6 py-2 rounded-full bg-white/5 hover:bg-white/10 text-text-main border border-white/10 transition-all font-medium'
                >
                  Clear Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <NewsLetter />
      <Footer />
    </div>
  )
}

export default Home
