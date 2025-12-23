import React, { useEffect, useState } from 'react'
import BlogTableItems from '../../components/admin/BlogTableItems'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { FileText } from 'lucide-react'

const ListBlog = () => {

  const [blogs, setBlogs] = useState([])
  const { axios } = useAppContext()

  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get('/api/admin/blogs')
      if (data.success) {
        setBlogs(data.blog)
      }
      else {
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
    <div className='flex-1 w-full pb-20'>

      {/* Header with Glass Effect */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary border border-primary/10">
            <FileText size={24} />
          </div>
          <div>
            <h1 className='text-3xl font-bold font-outfit text-text-main tracking-tight'>All Articles</h1>
            <p className="text-text-muted text-sm mt-1">Manage, edit, and track your publications.</p>
          </div>
        </div>

        <div className='flex items-center gap-3 bg-surface border border-white/5 px-4 py-2 rounded-xl text-sm font-medium'>
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          <span className='text-text-muted'>Total Blogs:</span>
          <span className='text-text-main font-bold'>{blogs.length}</span>
        </div>
      </div>

      {/* Table Container */}
      <div className='bg-surface border border-white/5 rounded-3xl overflow-hidden shadow-2xl shadow-black/20'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left'>
            <thead className='bg-surface-glass border-b border-white/5 text-xs font-bold uppercase text-text-muted tracking-wider'>
              <tr>
                <th scope='col' className='px-8 py-5'>#</th>
                <th scope='col' className='px-8 py-5'>Blog Title</th>
                <th scope='col' className='px-8 py-5 max-sm:hidden'>Date</th>
                <th scope='col' className='px-8 py-5 max-sm:hidden'>Status</th>
                <th scope='col' className='px-8 py-5 text-right'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-white/5'>
              {blogs.map((blog, index) => (
                <BlogTableItems key={blog._id} blog={blog} fetchBlogs={fetchBlogs} index={index + 1} />
              ))}
              {blogs.length === 0 && (
                <tr>
                  <td colSpan="5" className='px-8 py-24 text-center'>
                    <div className="flex flex-col items-center justify-center opacity-40">
                      <FileText size={48} className="mb-4 text-text-muted" />
                      <p className="text-lg font-medium text-text-main">No blogs published yet</p>
                      <p className="text-sm text-text-muted">Create your first story today</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ListBlog
