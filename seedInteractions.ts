import mongoose from 'mongoose';import Interaction from '@/models/Interaction';

// Connection URI - Replace with your actual MongoDB connection string
const MONGO_URI ="mongodb+srv://blog:lRGfXYObP0ns9vjR@productdatabase.rsyh2kq.mongodb.net/blog_app?appName=ProductDatabase" ;



const interactions = [
  { id: 2, user_id: Object("69f77a0dcfb1dea4e2418d0f"), blog_id: Object("69f77b5e1ffa8e5080a75f68"), type: 'LIKE' },
  { id: 4, user_id: Object("69f77a0dcfb1dea4e2418d0f"), blog_id: Object("69f77b5e1ffa8e5080a75f68"), type: 'SAVE' },
  { id: 30001, user_id: Object("69f77a0dcfb1dea4e2418d0f"), blog_id: Object("69f77b5e1ffa8e5080a75f68"), type: 'SAVE' },
  { id: 60003, user_id: Object("69f77a0dcfb1dea4e2418d0f"), blog_id: Object("69f77b5e1ffa8e5080a75f68"), type: 'SAVE' },
  { id: 60004, user_id: Object("69f77a0dcfb1dea4e2418d0f"), blog_id: Object("69f77b5e1ffa8e5080a75f68"), type: 'LIKE' },
  { id: 90001, user_id: Object("69f77a0dcfb1dea4e2418d0f"), blog_id: Object("69f77b5e1ffa8e5080a75f68"), type: 'LIKE' },
  { id: 90002, user_id: Object("69f77a0dcfb1dea4e2418d0f"), blog_id: Object("69f77b5e1ffa8e5080a75f68"), type: 'DISLIKE' },
  { id: 90003, user_id: Object("69f77a0dcfb1dea4e2418d0f"), blog_id: Object("69f77b5e1ffa8e5080a75f68"), type: 'SAVE' },
  { id: 120001, user_id: Object("69f77a0dcfb1dea4e2418d0f"), blog_id: Object("69f77b5e1ffa8e5080a75f68"), type: 'LIKE' },
  { id: 120002, user_id: Object("69f77a0dcfb1dea4e2418d0f"), blog_id: Object("69f77b5e1ffa8e5080a75f68"), type: 'DISLIKE' },
  { id: 120003, user_id: Object("69f77a0dcfb1dea4e2418d0f"), blog_id: Object("69f77b5e1ffa8e5080a75f68"), type: 'SAVE' },
  { id: 180001, user_id: Object("69f77a0dcfb1dea4e2418d0f"), blog_id: Object("69f77b5e1ffa8e5080a75f68"), type: 'LIKE' },
];

const seedInteractionsDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🔗 Connected to MongoDB successfully.');

    await Interaction.deleteMany({});
    console.log('🧹 Cleaned up existing interactions.');

    await Interaction.insertMany(interactions);
    console.log(`🌱 Database successfully seeded with ${interactions.length} interactions!`);

    await mongoose.connection.close();
  } catch (err) {
    console.error('❌ Error seeding interaction data:', err);
    await mongoose.connection.close();
  }
};

seedInteractionsDB();