import express from 'express';
import { createPost, getPosts } from '../controllers/postController.js'; // Import from controller

const router = express.Router();

// Define routes
router.post('/', createPost); // Use imported createPost
router.get('/', getPosts); // Use imported getPosts

export default router; // Ensure default export