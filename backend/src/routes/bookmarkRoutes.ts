import { Router } from 'express';
import mongoose from 'mongoose';
import User from '../models/User';
import Post from '../models/Post';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/bookmarks - full posts the logged-in user has saved
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const posts = await Post.find({ _id: { $in: user.bookmarks } }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookmarks', error });
  }
});

// GET /api/bookmarks/ids - just the ids of saved posts
router.get('/ids', requireAuth, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.bookmarks.map((id) => id.toString()));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookmark ids', error });
  }
});

// POST /api/bookmarks/:postId - toggle a bookmark on or off
router.post('/:postId', requireAuth, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const postId = req.params.postId as string;
    const alreadySaved = user.bookmarks.some((id) => id.toString() === postId);
    const objectId = new mongoose.Types.ObjectId(postId);

    await User.updateOne(
      { _id: req.userId },
      alreadySaved
        ? { $pull: { bookmarks: objectId } }
        : { $addToSet: { bookmarks: objectId } }
    );

    res.json({ bookmarked: !alreadySaved });
  } catch (error) {
    res.status(400).json({ message: 'Failed to update bookmark', error });
  }
});

export default router;