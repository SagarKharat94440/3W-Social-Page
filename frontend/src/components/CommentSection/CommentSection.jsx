import { useState } from 'react'
import { toast } from 'react-toastify'
import { addComment, deleteComment } from '../../api/posts'
import { useAuth } from '../../context/AuthContext'
import { IconButton, Menu, MenuItem } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import './CommentSection.css'

function CommentItem({ comment, onDelete, currentUser }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleDeleteClick = () => {
    handleMenuClose()
    onDelete(comment._id)
  }

  return (
    <div className="comment">
      <div className="comment-avatar">
        {comment.username[0].toUpperCase()}
      </div>
      <div className="comment-content">
        <div className="comment-header">
           <span className="comment-user">{comment.username}</span>
           
           {currentUser && currentUser._id === comment.user && (
            <div className="comment-menu-action">
              <IconButton
                  aria-label="more"
                  id={`comment-menu-button-${comment._id}`}
                  aria-controls={open ? 'comment-menu' : undefined}
                  aria-expanded={open ? 'true' : undefined}
                  aria-haspopup="true"
                  onClick={handleMenuClick}
                  size="small"
                  sx={{ color: '#888', padding: '0 4px' }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
                <Menu
                  id="comment-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                   PaperProps={{
                    style: {
                      backgroundColor: '#333',
                      color: 'white',
                    },
                  }}
                >
                  <MenuItem onClick={handleDeleteClick} dense>Delete</MenuItem>
                </Menu>
            </div>
            )}
        </div>
        <p className="comment-text">{comment.text}</p>
      </div>
    </div>
  )
}

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

  // Handle delete comment
  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return
    try {
      const data = await deleteComment(postId, commentId)
      setComments(data.comments)
      toast.success('Comment deleted')
    } catch (error) {
      toast.error('Failed to delete comment')
    }
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
            <CommentItem 
              key={comment._id} 
              comment={comment} 
              onDelete={handleDelete}
              currentUser={user}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default CommentSection
