import { Router } from 'express';
import Post from '../models/Post';
import Comment from '../models/Comment';

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

// GET /api/posts/:id - fetch a single post by id
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch post', error });
  }
});

// PATCH /api/posts/:id/like - increment likes on a post
router.patch('/:id/like', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Failed to like post', error });
  }
});

// GET /api/posts/:id/comments - fetch comments for a post
router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.id }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch comments', error });
  }
});

// POST /api/posts/:id/comments - add a comment to a post
router.post('/:id/comments', async (req, res) => {
  try {
    const { author, text } = req.body;
    const newComment = new Comment({ postId: req.params.id, author, text });
    const saved = await newComment.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: 'Failed to add comment', error });
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