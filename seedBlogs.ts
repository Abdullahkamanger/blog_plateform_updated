import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import mongoose from 'mongoose';

const blogs = [
  {
    id: 1,
    title: 'Getting Started with Node.js',
    slug: 'getting-started-with-nodejs-001',
    content: 'Node.js is a powerful JavaScript runtime built on Chrome\'s V8 engine. In this post we will explore how to set up a Node.js project from scratch, install packages with npm, and create your first HTTP server.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    category: 'Technology',
    authorId: 2,
    status: 1,
    createdAt: new Date('2026-03-26 21:10:52'),
    isFeatured: 1,
    views: 1,
    isPublished: 1,
  },
  {
    id: 2,
    title: 'Understanding REST APIs',
    slug: 'understanding-rest-apis-002',
    content: 'REST (Representational State Transfer) is an architectural style for designing networked applications. This guide covers the six constraints of REST, HTTP methods (GET, POST, PUT, DELETE), status codes, and how to design clean endpoints.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
    category: 'Web Development',
    authorId: 2,
    status: 1,
    createdAt: new Date('2026-03-26 21:10:52'),
    isFeatured: 0,
    views: 0,
    isPublished: 0,
  },
  {
    id: 3,
    title: 'React Hooks Explained',
    slug: 'react-hooks-explained-003',
    content: 'React Hooks revolutionised how we write React components. We will deep-dive into useState, useEffect, useContext, and custom hooks — with practical examples you can use in your projects today.',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    category: 'React',
    authorId: 2,
    status: 1,
    createdAt: new Date('2026-03-26 21:10:52'),
    isFeatured: 1,
    views: 0,
    isPublished: 1,
  },
  {
    id: 4,
    title: 'MySQL vs TiDB: What\'s the Difference?',
    slug: 'mysql-vs-tidb-004',
    content: 'TiDB is a distributed SQL database fully compatible with the MySQL protocol. In this post we compare TiDB Cloud with traditional MySQL — covering scalability, high availability, HTAP workloads, and when to choose each.',
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800',
    category: 'Database',
    authorId: 2,
    status: 1,
    createdAt: new Date('2026-03-26 21:10:52'),
    isFeatured: 0,
    views: 0,
    isPublished: 0,
  },
  {
    id: 5,
    title: 'Building a Full-Stack MERN App',
    slug: 'building-mern-app-005',
    content: 'MERN stands for MongoDB, Express, React, and Node.js. But what if you swap MongoDB for MySQL/TiDB? In this tutorial we build a complete blog application with authentication, role-based access control, and a cloud database.',
    image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800',
    category: 'Tutorial',
    authorId: 2,
    status: 0,
    createdAt: new Date('2026-03-26 21:10:52'),
    isFeatured: 0,
    views: 0,
    isPublished: 0,
  },
  {
    id: 30001,
    title: 'Short HTML Tutorial',
    slug: 'short-html-tutorial-1774787018661',
    content: '{"blocks":[{"id":"VnOfgl1xHr","type":"paragraph","data":{"text":"A short brief html tutorial covers important basics"}},{"id":"eTUferRTBv","type":"header","data":{"text":"HyperTextMarkupLanguage(HTML)","level":2}},{"id":"NSDW6I9GjK","type":"paragraph","data":{"text":"Html is a markup language used to write web documents it has basic text formatiing propertys ans it can be made more verstile and useful to make interactive webpages using javascript but that\'s a different topic for another blog for now understand that html cannot handle any businees logic or we cannot do desicion based programming in it&nbsp;"}}]}',
    image: 'https://images.pexels.com/photos/18356772/pexels-photo-18356772.jpeg?_gl=1*po1pmx*_ga*MTUzODY4MDczNy4xNzc0Nzg2OTU1*_ga_8JE65Q40S6*czE3NzQ3ODY5NTUkbzEkZzAkdDE3NzQ3ODY5NTUkajYwJGwwJGgw',
    category: 'Tech',
    authorId: 2,
    status: 1,
    createdAt: new Date('2026-03-29 12:23:38'),
    isFeatured: 0,
    views: 0,
    isPublished: 1,
  },
  {
    id: 90001,
    title: 'dfhgfhf',
    slug: 'dfhgfhf-1774859600665',
    content: '{"blocks":[{"id":"k9TImvzmKO","type":"paragraph","data":{"text":"xdgdfgdfgd"}}]}',
    image: 'https://ix-marketing.imgix.net/bg-remove_after.png?auto=format,compress&w=1946',
    category: 'Tech',
    authorId: 2,
    status: 1,
    createdAt: new Date('2026-03-30 08:33:20'),
    isFeatured: 1,
    views: 1,
    isPublished: 1,
  },
  {
    id: 90002,
    title: 'fghfgh',
    slug: 'fghfgh-1774859841498',
    content: '{"blocks":[{"id":"Cgr_i4s7IJ","type":"paragraph","data":{"text":"fghfgh"}}]}',
    image: 'https://ix-marketing.imgix.net/bg-remove_after.png?auto=format,compress&w=1946',
    category: 'Tech',
    authorId: 2,
    status: 1,
    createdAt: new Date('2026-03-30 08:37:21'),
    isFeatured: 1,
    views: 0,
    isPublished: 1,
  },
  {
    id: 120001,
    title: 'This is a Title man',
    slug: 'this-is-a-title-man-1777737384748',
    content: '{"blocks":[{"id":"HXm-oqvzZK","type":"image","data":{"caption":"this is a image","withBorder":true,"withBackground":false,"stretched":true,"file":{"url":"https://res.cloudinary.com/dlodk37zj/image/upload/v1777737097/blog_covers/riyewsacmubfhfd9i8kf.jpg"}}},{"id":"rRJZo8TcBe","type":"header","data":{"text":"more like ths will be added","level":2}},{"id":"LhcW5vRZJg","type":"quote","data":{"text":"this is a Quote man","caption":"Abdullah","alignment":"left"}},{"id":"qUD_vvlKDL","type":"code","data":{"code":"#include<stdio.h>\\n\\nvoid main(){\\nprintf(\\\"hello world\\\");\\n\\n}"}},{"id":"Uu2cR_TryV","type":"delimiter","data":{}},{"id":"aHeo1S6pXb","type":"paragraph","data":{"text":"this is a simple text"}}]}',
    image: 'https://images.unsplash.com/photo-1773332598451-8a0a59941912?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8',
    category: 'Tech',
    authorId: 90001,
    status: 1,
    createdAt: new Date('2026-05-02 15:56:26'),
    isFeatured: 1,
    views: 0,
    isPublished: 0,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://blog:lRGfXYObP0ns9vjR@productdatabase.rsyh2kq.mongodb.net/blog_app?appName=ProductDatabase" );
    console.log('🔗 Connected to MongoDB successfully.');

    await Blog.deleteMany({});
    console.log('🧹 Cleaned up existing blogs.');

    await Blog.insertMany(blogs);
    console.log('🌱 Database successfully seeded with 9 blogs!');

    await mongoose.connection.close();
  } catch (err) {
    console.error('❌ Error seeding data:', err);
    await mongoose.connection.close();
  }
};

seedDB();