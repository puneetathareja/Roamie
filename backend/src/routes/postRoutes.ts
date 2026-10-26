import { Router } from 'express';
import Post from '../models/Post';
import Comment from '../models/Comment';
import User from '../models/User';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/posts - fetch all posts (supports ?search= and ?category=)
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter: Record<string, unknown> = {};

    if (category && typeof category === 'string' && category !== 'All') {
      filter.category = category;
    }

    if (search && typeof search === 'string') {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped, 'i');
      filter.$or = [
        { title: regex },
        { destination: regex },
        { tags: regex },
      ];
    }

    const posts = await Post.find(filter).sort({ createdAt: -1 });
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

// POST /api/posts/:id/comments - add a comment (login required)
router.post('/:id/comments', requireAuth, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const newComment = new Comment({
      postId: req.params.id,
      author: user.name,
      authorId: user._id,
      text: req.body.text,
    });
    const saved = await newComment.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: 'Failed to add comment', error });
  }
});

// POST /api/posts - create a new post (login required)
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const { title, content, destination, coverImage, category, tags } = req.body;
    const newPost = new Post({
      title,
      content,
      destination,
      coverImage,
      category,
      tags,
      author: user.name,
      authorId: user._id,
    });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create post', error });
  }
});

// PATCH /api/posts/:id - edit a post (owner only)
router.patch('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    if (!post.authorId || post.authorId.toString() !== req.userId) {
      return res.status(403).json({ message: 'You can only edit your own posts' });
    }

    const { title, content, destination, coverImage, category, tags } = req.body;
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (destination !== undefined) post.destination = destination;
    if (coverImage !== undefined) post.coverImage = coverImage;
    if (category !== undefined) post.category = category;
    if (tags !== undefined) post.tags = tags;

    const updated = await post.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update post', error });
  }
});

// DELETE /api/posts/:id - delete a post (owner only)
router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    if (!post.authorId || post.authorId.toString() !== req.userId) {
      return res.status(403).json({ message: 'You can only delete your own posts' });
    }

    await Comment.deleteMany({ postId: post._id });
    await User.updateMany({ bookmarks: post._id }, { $pull: { bookmarks: post._id } });
    await post.deleteOne();

    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete post', error });
  }
});

export default router;