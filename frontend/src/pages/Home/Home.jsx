import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { getPosts } from '../../api/posts'
import CreatePost from '../../components/CreatePost/CreatePost'
import PostCard from '../../components/PostCard/PostCard'
import './Home.css'

function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  // Load posts
  const loadPosts = async (pageNum = 1) => {
    try {
      const data = await getPosts(pageNum)
      if (pageNum === 1) {
        setPosts(data.posts)
      } else {
        setPosts(prev => [...prev, ...data.posts])
      }
      setHasMore(data.hasMore)
    } catch (error) {
      toast.error('Failed to load posts')
    }
    setLoading(false)
  }

  // Initial load
  useEffect(() => {
    loadPosts()
  }, [])

  // Handle new post
  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev])
  }

  // Load more
  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    loadPosts(nextPage)
  }

  return (
    <div className="home">
      <h1 className="page-title">Social Feed</h1>
      
      <CreatePost onPostCreated={handlePostCreated} />

      {loading ? (
        <div className="loading">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="no-posts">No posts yet. Be the first!</div>
      ) : (
        <>
          {posts.map(post => (
            <PostCard key={post._id} post={post} />
          ))}
          
          {hasMore && (
            <button className="load-more" onClick={loadMore}>
              Load More
            </button>
          )}
        </>
      )}
    </div>
  )
}

export default Home
