import React, { useEffect } from 'react'
import { useState } from 'react'
import CommentTableItems from '../../components/admin/CommentTableItems'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const Comment = () => {

  const [comments, setComments] = useState([])
  const [filter, setFilter] = useState('Not Approved')
  const { axios } = useAppContext()

  const fetchComments = async () => {
    try {
      const { data } = await axios.get('/api/admin/comments')
      data.success ? setComments(data.comments) : toast.error(data.message)
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [])

  return (
    <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50'>
      <div className='flex items-center justify-between max-w-3xl'>
        <h1>Comments</h1>
        <div className='flex gap-4'>

          <button onClick={() => setFilter('Approved')}
            className={`shadow-custom-sm border rounded-full px-4 py-3 cursor-pointer text-xs ${filter === 'Approved' ? 'text-primary' : 'text-gray-700'}`}>Approved</button>

          <button onClick={() => setFilter('Not Approved')}
            className={`shadow-custom-sm border rounded-full px-4 py-3 cursor-pointer text-xs ${filter === 'Not Approved' ? 'text-primary' : 'text-gray-700'}`}>Not Approved</button>

        </div>
      </div>

      <div className='relative h-4/5 mt-4 max-w-4xl overflow-x-auto rounded-lg shadow scrollbar-hide bg-white'>
        <table className='w-full text-md text-gray-500'>
          <thead className='text-xs text-gray-700 text-left uppercase'>
            <tr>
              <th scope='col' className='px-6 py-3'>Blog Title & Comment</th>
              <th scope='col' className='px-6 py-3 max-sm:hidden'>DATE</th>
              <th scope='col' className='px-6 py-3'>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {
              comments.filter((comment) => {
                if (filter === 'Approved') return comment.isApproved === true;
                return comment.isApproved === false;
              }).map((comment, index) => <CommentTableItems key={comment._id} comment={comment} index={index} fetchComments={fetchComments} />)
            }
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default Comment
