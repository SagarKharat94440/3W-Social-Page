import { useState } from 'react'
import { toast } from 'react-toastify'
import { addComment } from '../../api/posts'
import { useAuth } from '../../context/AuthContext'
import './CommentSection.css'

function CommentSection({ postId, comments, setComments }) {
  const { user } = useAuth()
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  // Submit comment
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return

    if (!user) {
      toast.info('Please login to comment')
      return
    }

    setLoading(true)
    try {
      const data = await addComment(postId, text)
      setComments(data.comments)
      setText('')
      toast.success('Comment added!')
    } catch (error) {
      toast.error('Failed to add comment')
    }
    setLoading(false)
  }

  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString()
  }

  return (
    <div className="comment-section">
      {/* Add comment form */}
      {user && (
        <form className="comment-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Write a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? '...' : 'Post'}
          </button>
        </form>
      )}

      {/* Comments list */}
      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="comment">
              <div className="comment-avatar">
                {comment.username[0].toUpperCase()}
              </div>
              <div className="comment-content">
                <span className="comment-user">{comment.username}</span>
                <p className="comment-text">{comment.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default CommentSection
