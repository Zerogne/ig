import { useState } from 'react';

const API_URL = 'http://localhost:5000'; // Ensure this matches your backend's port

function CreatePostModal({ onClose, onPostCreated, user }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [school, setSchool] = useState('');
  const [anonymous, setAnonymous] = useState(false);

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          school,
          anonymous,
          username: anonymous ? null : user.displayName, // Use username if not anonymous
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create post: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Post created successfully:', data); // Notify parent to refresh posts
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>Create a New Post</h2>
        <form onSubmit={handlePost}>
          <div className="input-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              placeholder="Enter post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              placeholder="Enter post content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="school">Select School</label>
            <select
              id="school"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              required
            >
              <option value="">Select your school</option>
              <option value="school1">Амжилт кибер сургууль</option>
              <option value="school2">ЕБ 85-р Сургууль</option>
              <option value="school3">ЕБ 38-р Сургууль</option>
              <option value="school4">ЕБ 36-р Сургууль</option>
              <option value="school5">ЕБ 84-р Сургууль</option>
            </select>
          </div>
          <div className="input-group">
            <label>
              <input
                type="checkbox"
                id="anonymous"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
              />
              Post Anonymously
            </label>
          </div>
          <div className="modal-actions">
            <button type="submit" className="submit-btn">
              Submit
            </button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePostModal;
