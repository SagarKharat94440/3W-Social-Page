import { useState } from 'react'
import { toast } from 'react-toastify'
import { likePost } from '../../api/posts'
import { useAuth } from '../../context/AuthContext'
import CommentSection from '../CommentSection/CommentSection'
import './PostCard.css'

function PostCard({ post, onUpdate }) {
  const { user } = useAuth()
  const [likes, setLikes] = useState(post.likes || [])
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState(post.comments || [])

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
