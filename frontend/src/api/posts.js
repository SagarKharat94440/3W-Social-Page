import api from './api'

// Get all posts
export async function getPosts(page = 1) {
  const response = await api.get(`/posts?page=${page}&limit=10`)
  return response.data
}

// Create post
export async function createPost(formData) {
  const response = await api.post('/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

// Like post
export async function likePost(postId) {
  const response = await api.put(`/posts/${postId}/like`)
  return response.data
}

// Add comment
export async function addComment(postId, text) {
  const response = await api.post(`/posts/${postId}/comment`, { text })
  return response.data
}

// Delete post
export async function deletePost(postId) {
  const response = await api.delete(`/posts/${postId}`)
  return response.data
}
