import { useState, useRef } from 'react'
import { toast } from 'react-toastify'
import { createPost } from '../../api/posts'
import { useAuth } from '../../context/AuthContext'
import './CreatePost.css'

function CreatePost({ onPostCreated }) {
  const { user } = useAuth()
  const [text, setText] = useState('')
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const fileRef = useRef()

  // Handle image select
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  // Remove image
  const removeImage = () => {
    setImage(null)
    setPreview('')
    fileRef.current.value = ''
  }

  // Submit post
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!text.trim() && !image) {
      toast.error('Add some text or image')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      if (text) formData.append('text', text)
      if (image) formData.append('image', image)

      const newPost = await createPost(formData)
      
      setText('')
      removeImage()
      onPostCreated(newPost)
      toast.success('Post created!')
    } catch (error) {
      toast.error('Failed to create post')
    }
    setLoading(false)
  }

  if (!user) {
    return (
      <div className="create-post-login">
        Please login to create a post
      </div>
    )
  }

  return (
    <form className="create-post" onSubmit={handleSubmit}>
      <div className="create-post-header">
        <div className="avatar">{user?.username?.[0]?.toUpperCase() || 'U'}</div>
        <textarea
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
        />
      </div>

      {preview && (
        <div className="image-preview">
          <img src={preview} alt="Preview" />
          <button type="button" onClick={removeImage} className="remove-btn">
            ✕
          </button>
        </div>
      )}

      <div className="create-post-footer">
        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          onChange={handleImageChange}
          hidden
        />
        <button
          type="button"
          onClick={() => fileRef.current.click()}
          className="btn-image"
        >
          📷 Image
        </button>
        <button type="submit" disabled={loading} className="btn-post">
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </form>
  )
}

export default CreatePost
