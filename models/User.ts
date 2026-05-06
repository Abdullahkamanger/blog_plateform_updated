import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'ADMIN' | 'AUTHOR' | 'READER';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  bio?: string;
  social_links?: {
    twitter?: string | null;
    github?: string | null;
    linkedin?: string | null;
    website?: string | null;
  };
  created_at: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['ADMIN', 'AUTHOR', 'READER'], 
    default: 'READER' 
  },
  status: { 
    type: String, 
    enum: ['PENDING', 'APPROVED', 'REJECTED'], 
    default: 'APPROVED' 
  },
  bio: { type: String, default: null },
  social_links: {
    twitter: { type: String, default: null },
    github: { type: String, default: null },
    linkedin: { type: String, default: null },
    website: { type: String, default: null },
  },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);