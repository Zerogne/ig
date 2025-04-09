import dotenv from 'dotenv';
dotenv.config(); // Load environment variables
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'; // Import CORS middleware
import Post from './models/postModel.js'; // Use import for Post model
import postRoutes from './routes/postRoutes.js'; // Use import for routes

const app = express(); // Initialize the app here

// Use CORS middleware after initializing the app
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend's URL
  methods: ['GET', 'POST'], // Specify allowed methods
  credentials: true // Allow cookies if needed
}));

app.use(express.json()); // Middleware to parse JSON in requests

// Connect to MongoDB

mongoose.connect(process.env. MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit the process with an error code
  });

// Register the post routes
app.use('/api/posts', postRoutes);

// Route to create a post
app.post('/api/posts', async (req, res) => {
  try {
    const { title, content, anonymous } = req.body;
    const newPost = new Post({ title, content, anonymous });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Route to fetch all posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

export default app; // Use export instead of module.exports
