import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  destination: string;
  coverImage?: string;
  category: string;
  tags: string[];
  author: string;
  likes: number;
  createdAt: Date;
}

const postSchema = new Schema<IPost>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  destination: { type: String, required: true },
  coverImage: { type: String },
  category: { type: String, default: 'General' },
  tags: { type: [String], default: [] },
  author: { type: String, required: true },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IPost>('Post', postSchema);