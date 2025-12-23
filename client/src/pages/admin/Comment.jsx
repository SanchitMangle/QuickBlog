import React, { useEffect, useState } from 'react'
import CommentTableItems from '../../components/admin/CommentTableItems'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react'

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
    <div className='flex-1 w-full pb-20'>

      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary border border-primary/10">
            <MessageSquare size={24} />
          </div>
          <div>
            <h1 className='text-3xl font-bold font-outfit text-text-main tracking-tight'>Comments</h1>
            <p className="text-text-muted text-sm mt-1">Engage with your community.</p>
          </div>
        </div>

        {/* Premium Filter Tabs */}
        <div className='flex bg-surface/50 border border-white/5 p-1.5 rounded-2xl backdrop-blur-md'>
          {[
            { id: 'Not Approved', label: 'Pending', icon: AlertCircle },
            { id: 'Approved', label: 'Approved', icon: CheckCircle2 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`
                    flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300
                    ${filter === tab.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-text-muted hover:text-text-main hover:bg-white/5'}
                  `}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className='bg-surface border border-white/5 rounded-3xl overflow-hidden shadow-2xl shadow-black/20'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left'>
            <thead className='bg-surface-glass border-b border-white/5 text-xs font-bold uppercase text-text-muted tracking-wider'>
              <tr>
                <th scope='col' className='px-8 py-5'>Comment</th>
                <th scope='col' className='px-8 py-5 max-sm:hidden'>Date</th>
                <th scope='col' className='px-8 py-5 text-right'>Action</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-white/5'>
              {
                comments.filter((comment) => {
                  if (filter === 'Approved') return comment.isApproved === true;
                  return comment.isApproved === false;
                }).map((comment, index) => <CommentTableItems key={comment._id} comment={comment} index={index} fetchComments={fetchComments} />)
              }
              {comments.filter(c => (filter === 'Approved' ? c.isApproved : !c.isApproved)).length === 0 && (
                <tr>
                  <td colSpan="3" className='px-8 py-24 text-center'>
                    <div className="flex flex-col items-center justify-center opacity-40">
                      <MessageSquare size={48} className="mb-4 text-text-muted" />
                      <p className="text-lg font-medium text-text-main">No {filter.toLowerCase()} comments</p>
                      <p className="text-sm text-text-muted">You're all caught up!</p>
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

export default Comment
