import React from 'react'
import { useAppContext } from '../../context/AppContext'
import { useConfirmation } from '../../context/ConfirmationContext'
import toast from 'react-hot-toast'
import { Check, Trash2 } from 'lucide-react'

const CommentTableItems = ({ comment, fetchComments }) => {

  const { blog, createdAt, _id } = comment
  const blogDate = new Date(createdAt)
  const { axios } = useAppContext()
  const { checkAction } = useConfirmation()

  const approveComment = async () => {
    try {
      const { data } = await axios.post('/api/admin/approve-comment', { id: _id })
      if (data.success) {
        toast.success(data.message)
        fetchComments()
      }
      else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  const deleteComent = async () => {
    try {
      const isConfirmed = await checkAction({
        title: "Delete Comment",
        message: "Are you sure you want to remove this comment?",
        confirmText: "Delete",
        isDanger: true
      });

      if (!isConfirmed) return;
      const { data } = await axios.post('/api/admin/delete-comment', { id: _id })
      if (data.success) {
        toast.success(data.message)
        fetchComments()
      }
      else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  return (
    <tr className='hover:bg-text-main/5 transition-colors group border-b border-border last:border-0'>
      <td className='px-6 py-6'>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">Blog</span>
            <span className='text-sm text-text-main font-medium line-clamp-1'>{blog?.title || 'Unknown Blog'}</span>
          </div>

          <div className="pl-4 border-l-2 border-border mt-2">
            <p className="text-sm text-text-main font-medium mb-1">{comment.name}</p>
            <p className="text-sm text-text-muted leading-relaxed line-clamp-3">{comment.content}</p>
          </div>
        </div>
      </td>
      <td className='px-6 py-6 max-sm:hidden align-top pt-8 text-text-muted text-sm'>
        {blogDate.toLocaleDateString()}
      </td>
      <td className='px-6 py-6 align-top pt-8'>
        <div className='flex items-center gap-2'>
          {!comment.isApproved ? (
            <button
              onClick={approveComment}
              className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition"
              title="Approve"
            >
              <Check size={18} />
            </button>
          ) : (
            <span className='text-xs font-bold text-green-500 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full'>
              Approved
            </span>
          )}

          <button
            onClick={deleteComent}
            className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default CommentTableItems
