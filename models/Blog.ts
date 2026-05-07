import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  content?: string;
  cover_image?: string;
  category?: string;
  author_id: mongoose.Types.ObjectId;
  is_published: boolean;
  status: 'DRAFT' | 'PENDING' | 'PUBLISHED';
  parent_blog_id?: mongoose.Types.ObjectId;
  is_archived: boolean;
  created_at: Date;
  last_saved_at: Date;
  likes_count: number;
  dislikes_count: number;
  saves_count: number;
}

const BlogSchema: Schema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, default: null },
  cover_image: { type: String, default: null },
  category: { type: String, default: null },
  author_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true ,
    default:Object("649d1c9e8f1a2c00123e4567") // Default to Admin user if not provided
  },
  is_published: { type: Boolean, default: false },
  status: { 
    type: String, 
    enum: ['DRAFT', 'PENDING', 'PUBLISHED'], 
    default: 'DRAFT' 
  },
  parent_blog_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'Blog', 
    default: null 
  },
  is_archived: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  last_saved_at: { type: Date, default: Date.now },
  likes_count: { type: Number, default: 0 },
  dislikes_count: { type: Number, default: 0 },
  saves_count: { type: Number, default: 0 }
});

export default mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);