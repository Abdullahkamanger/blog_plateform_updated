import mongoose from 'mongoose';
import User from '@/models/User';

// Connection URI - Replace with your actual MongoDB connection string
const MONGO_URI = "mongodb+srv://blog:lRGfXYObP0ns9vjR@productdatabase.rsyh2kq.mongodb.net/blog_app?appName=ProductDatabase" ;



const users = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@blog.com',
    password: '$2b$10$5DCFm86rcpX84EHXLmqMUOdZy7qUY0saAan/4..fC8rtj.aN1gz2G',
    role: 'ADMIN',
    status: 'APPROVED',
    createdAt: new Date('2026-03-26 21:10:51'),
  },
  {
    id: 2,
    name: 'Abdullah (Author)',
    email: 'author@blog.com',
    password: '$2b$10$GtWzk2i7Z3gG6ZlhGngeweinGA.7NS4YkvKDO8uq6UtQWsNF3JpFS',
    role: 'AUTHOR',
    status: 'APPROVED',
    createdAt: new Date('2026-03-26 21:10:51'),
  },
  {
    id: 30001,
    name: 'Abdullah',
    email: 'abdullahkamanger300@gmail.com',
    password: '$2b$10$zUfRSwqgxFDnG0hgkSbKE.cWs3BxwbWE.Fk5EVgzEbo/DiUymRtw6',
    role: 'ADMIN',
    status: 'APPROVED',
    createdAt: new Date('2026-03-28 15:32:33'),
  },
  {
    id: 90001,
    name: 'Abdullah Kamanger',
    email: 'author@mail.com',
    password: '$2b$10$FqxiZT8OhmGXxJWVjKAcCOkZRD.m.o3hrrTRRgOmzRDrLjk/AZNIy',
    role: 'AUTHOR',
    status: 'APPROVED',
    createdAt: new Date('2026-05-02 15:43:26'),
  },
];

const seedUsersDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🔗 Connected to MongoDB successfully.');

    await User.deleteMany({});
    console.log('🧹 Cleaned up existing users.');

    await User.insertMany(users);
    console.log('🌱 Database successfully seeded with 4 users!');

    await mongoose.connection.close();
  } catch (err) {
    console.error('❌ Error seeding user data:', err);
    await mongoose.connection.close();
  }
};

seedUsersDB();