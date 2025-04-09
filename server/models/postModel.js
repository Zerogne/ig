import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  anonymous: { type: Boolean, default: false },
});

const Post = mongoose.model('Post', postSchema);

export default Post; // Ensure default export
