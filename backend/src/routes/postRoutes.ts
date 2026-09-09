import { Router } from 'express';
import Post from '../models/Post';

const router = Router();

// GET /api/posts - fetch all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch posts', error });
  }
});

// POST /api/posts - create a new post
router.post('/', async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create post', error });
  }
});

export default router;