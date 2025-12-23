import React from 'react'
import { useAppContext } from '../../context/AppContext'
import { useConfirmation } from '../../context/ConfirmationContext'
import toast from 'react-hot-toast'
import { X, CheckCircle, XCircle } from 'lucide-react'

const BlogTableItems = ({ blog, fetchBlogs, index }) => {

  const { title, createdAt } = blog
  const blogDate = new Date(createdAt)
  const { axios } = useAppContext()
  const { checkAction } = useConfirmation()

  const deleteBlog = async () => {
    const isConfirmed = await checkAction({
      title: "Delete Blog",
      message: "Are you sure you want to delete this blog? This action cannot be undone.",
      confirmText: "Delete Log",
      isDanger: true
    });

    if (!isConfirmed) return;
    try {
      const { data } = await axios.post('/api/blog/delete', { id: blog._id })
      if (data.success) {
        toast.success(data.message)
        await fetchBlogs()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  const togglePublish = async () => {
    try {
      const { data } = await axios.post('/api/blog/toggle-publish', { id: blog._id })
      if (data.success) {
        toast.success(data.message)
        await fetchBlogs()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  return (
    <tr className='hover:bg-text-main/5 transition-colors group'>
      <th className='px-6 py-4 font-medium text-text-muted'>{index}</th>
      <td className='px-6 py-4 text-text-main font-medium'>{title}</td>
      <td className='px-6 py-4 max-sm:hidden text-text-muted'>{blogDate.toDateString()}</td>
      <td className='px-6 py-4 max-sm:hidden'>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${blog.isPublished
          ? 'bg-green-500/10 text-green-400 border-green-500/20'
          : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
          }`}>
          {blog.isPublished ? <CheckCircle size={12} /> : <XCircle size={12} />}
          {blog.isPublished ? 'Published' : 'Draft'}
        </span>
      </td>
      <td className='px-6 py-4 flex items-center gap-3'>
        <button
          onClick={togglePublish}
          className='text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-text-main/10 text-text-muted hover:text-text-main transition-all'
        >
          {blog.isPublished ? 'Unpublish' : 'Publish'}
        </button>
        <button
          onClick={deleteBlog}
          className='p-1.5 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-500 transition-colors'
          title="Delete"
        >
          <X size={18} />
        </button>
      </td>
    </tr>
  )
}

export default BlogTableItems
