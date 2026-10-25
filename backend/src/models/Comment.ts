import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  postId: mongoose.Types.ObjectId;
  author: string;
  authorId?: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
}

const commentSchema = new Schema<IComment>({
  postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  author: { type: String, required: true },
  authorId: { type: Schema.Types.ObjectId, ref: 'User' },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IComment>('Comment', commentSchema);