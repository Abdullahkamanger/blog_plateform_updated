import mongoose, { Schema, Document } from 'mongoose';

export interface IInteraction extends Document {
  user_id: mongoose.Types.ObjectId;
  blog_id: mongoose.Types.ObjectId;
  type: 'LIKE' | 'DISLIKE' | 'SAVE';
}

const InteractionSchema: Schema = new Schema({
  user_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  blog_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'Blog', 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['LIKE', 'DISLIKE', 'SAVE'],
    required: true
  }
});

// Enforce unique index equivalent to MySQL's UNIQUE KEY `user_blog_interaction` (`user_id`,`blog_id`,`type`)
InteractionSchema.index({ user_id: 1, blog_id: 1, type: 1 }, { unique: true });

export default mongoose.models.Interaction || mongoose.model<IInteraction>('Interaction', InteractionSchema);