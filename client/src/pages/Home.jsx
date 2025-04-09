import { useEffect, useState, useCallback } from 'react';
import Navbar from '../comp/Navbar'; // Navbar is used in the JSX
import CreatePostModal from '../comp/CreatePostModal'; // CreatePostModal is used in the JSX

function Home() {
  const [posts, setPosts] = useState([
    {
      _id: 'sample-post-id-1',
      title: 'Sample Post Title',
      content: 'This is a sample post content for preview purposes.',
      school: 'Амжилт кибер сургууль',
      anonymous: true,
      accountEmail: '',
      createdAt: new Date().toISOString(),
      likes: 5,
      comments: ['Sample comment 1', 'Sample comment 2'],
    },
    {
      _id: 'sample-post-id-2',
      title: 'Another Post Title',
      content: 'This is another sample post with a profile image.',
      school: 'ЕБ 85-р Сургууль',
      anonymous: false,
      accountEmail: 'user@example.com',
      profileImg: 'client\src\assets\profile.png', // Add profile image URL
      createdAt: new Date().toISOString(),
      likes: 10,
      comments: ['Another comment 1', 'Another comment 2'],
    },
  ]); // Initialize with sample posts
  const [showModal, setShowModal] = useState(false); // showModal and setShowModal are used in the JSX
  const [user, setUser] = useState(null); // user and setUser are used in the JSX and logic

  const fetchPosts = useCallback(async () => {
    try {
      console.log('Fetching posts from backend...');
      const apiUrl = import.meta.env.VITE_API_URL
        ? `${import.meta.env.VITE_API_URL}/api/posts`
        : 'http://localhost:5000/api/posts';
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      alert('Failed to fetch posts. Please ensure the backend server is running.');
    }
  }, []);

  const handleLike = async (postId) => {
    const apiUrl = `http://localhost:5000/api/posts/${postId}/like`;
    console.log('API URL:', apiUrl);
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response text:', errorText);
        throw new Error(`Failed to like post: ${response.statusText}`);
      }

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, likes: (post.likes || 0) + 1 } : post
        )
      );
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId, comment) => { // handleComment is used in the JSX
    const apiUrl = `http://localhost:5000/api/posts/${postId}/comment`;
    console.log('API URL:', apiUrl);
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response text:', errorText);
        throw new Error(`Failed to comment on post: ${response.statusText}`);
      }

      // Update the local state to reflect the new comment
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, comments: [...(post.comments || []), comment] }
            : post
        )
      );
    } catch (error) {
      console.error('Error commenting on post:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      try {
        setUser(JSON.parse(loggedInUser));
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
  }, [fetchPosts]); // Add fetchPosts to dependencies

  return (
    <>
      <Navbar />
      {showModal && (
        <CreatePostModal
          onClose={() => {
            setShowModal(false);
            fetchPosts(); // Fetch posts after closing the modal
          }}
          onPostCreated={fetchPosts}
          user={user} // Pass user to the modal for validation
        />
      )}
      <div className="post-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '20px' }}>
        {posts.map((post) => (
          <div
            key={post._id}
            className="post"
            style={{
              width: '600px',
              backgroundColor: '#1e1e1e',
              color: '#ffffff',
              borderRadius: '10px',
              padding: '20px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              position: 'relative', // Add relative positioning for the profile image
            }}
          >
            {/* Profile Image */}
            {!post.anonymous && post.profileImg && (
              <img
                src={post.profileImg}
                alt="Profile"
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%', // Make the image circular
                  position: 'absolute',
                  top: '20px',
                  left: '20px',
                  border: '2px solid #ffffff', // Add a white border
                }}
              />
            )}

            {/* Post Title */}
            <h3 style={{ marginBottom: '10px', fontSize: '1.5rem', fontWeight: 'bold', color: '#ffffff', marginLeft: post.profileImg ? '80px' : '0' }}>
              {post.anonymous
                ? `${post.title} (Anonymous)`
                : `${post.title} (${post.accountEmail || 'No Email'})`}
            </h3>

            {/* Post Content */}
            <p style={{ marginBottom: '10px', lineHeight: '1.6' }}>{post.content}</p>

            {/* School */}
            <p style={{ marginBottom: '10px', fontSize: '1rem', color: '#b3b3b3' }}>
              School: {post.school || 'Not specified'}
            </p>

            {/* Created At */}
            <p className="post-date" style={{ fontSize: '0.9rem', color: '#b3b3b3' }}>
              Created on: {new Date(post.createdAt).toLocaleString()}
            </p>

            {/* Like and Comment Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <button
                onClick={() => handleLike(post._id)}
                style={{
                  backgroundColor: 'gray',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '5px',
                  padding: '10px 20px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease',
                }}
              >
                👍 Like ({post.likes || 0})
              </button>
              <button
                onClick={() => handleComment(post._id, 'Sample comment')}
                style={{
                  backgroundColor: 'gray',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '5px',
                  padding: '10px 20px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease',
                }}
              >
                💬 Comment
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Home;

