import { useState } from 'react'
import { toast } from 'react-toastify'
import { likePost, deletePost } from '../../api/posts'
import { useAuth } from '../../context/AuthContext'
import CommentSection from '../CommentSection/CommentSection'
import { IconButton, Menu, MenuItem } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import './PostCard.css'

function PostCard({ post, onUpdate }) {
  const { user } = useAuth()
  const [likes, setLikes] = useState(post.likes || [])
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState(post.comments || [])
  
  // Menu state
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  // Check if user liked
  const isLiked = user && likes.some(like => like.user === user._id)


  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  // Handle like
  const handleLike = async () => {
    if (!user) {
      toast.info('Please login to like')
      return
    }
    try {
      const data = await likePost(post._id)
      setLikes(data.likes)
    } catch (error) {
      toast.error('Failed to like')
    }
  }

  const handleDelete = async () => {
    handleMenuClose()
    if (!window.confirm('Are you sure you want to delete this post?')) return
    try {
      await deletePost(post._id)
      toast.success('Post deleted')
      onUpdate && onUpdate() // Refresh list
    } catch (error) {
      toast.error('Failed to delete post')
    }
  }

  return (
    <div className="post-card">
      {/* Header */}
      <div className="post-header">
        <div className="post-avatar">
          {post.username?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="post-info">
          <span className="post-username">{post.username || 'User'}</span>
          <span className="post-date">{formatDate(post.createdAt)}</span>
        </div>
        
        {/* Menu Options */}
        {user && user._id === post.user && (
          <div className="post-menu">
            <IconButton
              aria-label="more"
              id="long-button"
              aria-controls={open ? 'long-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleMenuClick}
              sx={{ color: 'white' }}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="long-menu"
              MenuListProps={{
                'aria-labelledby': 'long-button',
              }}
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
              <MenuItem onClick={handleDelete}>Delete Post</MenuItem>
            </Menu>
          </div>
        )}
      </div>

      {/* Content */}
      {post.text && <p className="post-text">{post.text}</p>}
      
      {post.image && (
        <img src={post.image} alt="Post" className="post-image" />
      )}

      {/* Stats */}
      <div className="post-stats">
        <span>{likes.length} likes</span>
        <span>{comments.length} comments</span>
      </div>

      {/* Actions */}
      <div className="post-actions">
        <button
          className={`action-btn ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          {isLiked ? '❤️' : '🤍'} Like
        </button>
        <button
          className="action-btn"
          onClick={() => setShowComments(!showComments)}
        >
          💬 Comment
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <CommentSection
          postId={post._id}
          comments={comments}
          setComments={setComments}
        />
      )}
    </div>
  )
}

export default PostCard
