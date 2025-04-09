



import Post from '../models/postModel.js';

// Controller to create a post
export const createPost = async (req, res) => {
  try {
    const { title, content, anonymous } = req.body;
    const newPost = new Post({ title, content, anonymous });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
};

// Controller to get all posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};