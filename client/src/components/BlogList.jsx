import React, { useState } from 'react'
import { blogCategories } from '../assets/assets'
import { motion } from "motion/react"
import BlogCard from './BlogCard'
import { useAppContext } from '../context/AppContext'

const BlogList = () => {

    const { input, blogs } = useAppContext()
    const [menu, setMenu] = useState("All")

    const filterBlogs = () => {
        if (input === "") {
            return blogs
        }
        return blogs.filter((blog) => blog.title.toLowerCase().includes(input.toLowerCase()) || blog.category.toLowerCase().includes(input.toLowerCase()))
    }

    return (
        <div>

            <div className='flex justify-center gap-4 sm:gap-8 my-10 relative'>
                {/* Blog Category */}
                {
                    blogCategories.map((item) => (
                        <div key={item} className='relative'>
                            <button onClick={() => setMenu(item)}
                                className={`cursor-pointer transition-colors ${menu === item ? 'text-white px-4 pt-0.5' : 'text-text-muted hover:text-text-main'}`}>
                                {item}
                                {menu === item && (<motion.div layoutId='underline'
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    className='absolute right-0 left-0 top-0 h-7 -z-1 bg-primary rounded-full'></motion.div>)}

                            </button>
                        </div>
                    ))
                }
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-24 mx-8 sm:mx-16 xl:mx-40'>
                {/* Blog cards */}

                {
                    filterBlogs().filter((blog) => menu === "All" ? true : blog.category === menu).
                        map((blog) => <BlogCard key={blog._id} blog={blog} />)
                }

            </div>
        </div>
    )
}

export default BlogList
