import dotenv from 'dotenv';
dotenv.config(); // Load environment variables
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'; // Import CORS middleware
import User from './models/userModel.js'; // Import the User model

const app = express(); // Initialize the app here

// Use CORS middleware after initializing the app
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend's URL
  methods: ['GET', 'POST'], // Specify allowed methods
  credentials: true // Allow cookies if needed
}));

app.use(express.json()); // Middleware to parse JSON in requests

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit the process with an error code
  });

// Example Post model
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  school: String,
  anonymous: Boolean,
  username: String,
  createdAt: { type: Date, default: Date.now },
});
const Post = mongoose.model('Post', postSchema);

// Route to create a post
app.post('/api/posts', async (req, res) => {
  try {
    const { title, content, school, anonymous, email } = req.body;
    const newPost = new Post({ title, content, school, anonymous, username: email });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Route to fetch all posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Route to like a post
app.post('/api/posts/:id/like', async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.likes = (post.likes || 0) + 1; // Increment the likes count
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ error: 'Failed to like post' });
  }
});

// Route to comment on a post
app.post('/api/posts/:id/comment', async (req, res) => {
  try {
    const postId = req.params.id;
    const { comment } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.comments = post.comments || [];
    post.comments.push(comment); // Add the new comment
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.error('Error commenting on post:', error);
    res.status(500).json({ error: 'Failed to comment on post' });
  }
});

// Route to save user data
app.post('/api/users', async (req, res) => {
  try {
    const { username, email } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create a new user
    const newUser = new User({ username, email });
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ error: 'Failed to save user' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app; // Use export instead of module.exports
