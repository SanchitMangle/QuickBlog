import React, { useEffect } from 'react'
import { useState } from 'react'
import BlogTableItems from '../../components/admin/BlogTableItems'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ListBlog = () => {

  const [blogs, setBlogs] = useState([])
  const {axios} = useAppContext()

  const fetchBlogs = async () => {
    try {
      const {data} = await axios.get('/api/admin/blogs')
      if (data.success) {
        setBlogs(data.blog)
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error);
       toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  return (
    <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50'>
      <h1>All Blogs</h1>

        <div className='relative h-4/5 mt-4 max-w-4xl overflow-x-auto rounded-lg shadow scrollbar-hide bg-white'>
          <table className='w-full text-md text-gray-500'>
            <thead className='text-xs text-gray-700 text-left uppercase'>
              <tr>
                <th scope='col' className='px-2 py-4 xl:px-6'> # </th>
                <th scope='col' className='px-2 py-4'>BLOG TITLE</th>
                <th scope='col' className='px-2 py-4 max-sm:hidden'>DATE</th>
                <th scope='col' className='px-2 py-4 max-sm:hidden'>STATUS</th>
                <th scope='col' className='px-2 py-4'>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {
                blogs.map((blog, index) => {
                  return <BlogTableItems key={blog._id} blog={blog} fetchBlogs={fetchBlogs} index={index + 1} />
                })
              }
            </tbody>
          </table>

        </div>
      </div>

  )
}

export default ListBlog
