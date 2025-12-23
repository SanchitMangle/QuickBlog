import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Clock, Sparkles } from 'lucide-react'
import moment from 'moment'

const BlogCard = ({ blog, index = 0 }) => {

  const { title, description, category, image, _id, createdAt } = blog
  const navigate = useNavigate()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className='spotlight-card group relative flex flex-col h-full rounded-3xl bg-surface border border-white/5 overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500'
    >
      {/* Background Hover Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Image Container with Parallax-like effect */}
      <div
        onClick={() => navigate(`/blog/${_id}`)}
        className='relative w-full aspect-[4/3] overflow-hidden cursor-pointer'
      >
        <img
          src={image}
          alt={title}
          loading="lazy"
          className='w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105'
        />

        {/* Dark Overlay gradient */}
        <div className='absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80' />

        {/* Floating Category Tag */}
        <div className='absolute top-4 left-4'>
          <span className='px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-white text-xs font-semibold tracking-wide uppercase flex items-center gap-1.5 shadow-lg transform translate-y-0 group-hover:-translate-y-1 transition-transform'>
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className='relative flex flex-col flex-grow p-6 pt-0 -mt-12 z-10'>
        {/* Meta Info */}
        <div className="flex items-center gap-3 text-xs font-medium text-text-muted mb-4 opacity-80">
          <div className="flex items-center gap-1.5">
            <Clock size={12} className="text-primary" />
            <span>{moment(createdAt).format('MMMM DD, YYYY')}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-white/20" />
          <span>5 min read</span>
        </div>

        {/* Title */}
        <h3
          onClick={() => navigate(`/blog/${_id}`)}
          className='text-xl md:text-2xl font-bold text-text-main mb-3 leading-snug cursor-pointer group-hover:text-primary transition-colors line-clamp-2'
        >
          {title}
        </h3>

        {/* Excerpt */}
        <div
          className='text-sm text-text-muted leading-relaxed line-clamp-3 mb-6 flex-grow'
          dangerouslySetInnerHTML={{ __html: description.replace(/<[^>]*>?/gm, '') }}
        />

        {/* ActionFooter */}
        <div className='pt-6 mt-auto border-t border-white/5 flex items-center justify-between'>
          <span className='text-sm font-semibold text-text-main group-hover:text-primary transition-colors'>Read Story</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/blog/${_id}`);
            }}
            className='w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-text-muted group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-300'
          >
            <ArrowUpRight size={18} className="transform group-hover:rotate-45 transition-transform duration-300" />
          </button>
        </div>
      </div>

    </motion.div>
  )
}

export default BlogCard
