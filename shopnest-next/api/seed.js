/**
 * Database Seeding Script
 * Populate MongoDB with sample products
 * 
 * Usage: node api/seed.js
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const Product = require('./models/Product');
const { connectDB, disconnectDB } = require('./config/mongodb');

const sampleProducts = [
  {
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 2499,
    originalPrice: 3999,
    image: 'https://via.placeholder.com/300?text=Headphones',
    category: 'Electronics',
    stock: 50,
    discount: 37,
    rating: 4.5,
    tags: ['electronics', 'audio', 'bestseller'],
    isFeatured: true,
  },
  {
    name: 'Smart Watch',
    description: 'Fitness tracking and notifications smartwatch',
    price: 4999,
    originalPrice: 6999,
    image: 'https://via.placeholder.com/300?text=Smartwatch',
    category: 'Electronics',
    stock: 30,
    discount: 28,
    rating: 4.3,
    tags: ['electronics', 'wearable', 'fitness'],
    isFeatured: true,
  },
  {
    name: 'Cotton T-Shirt',
    description: 'Comfortable 100% cotton T-shirt for everyday wear',
    price: 499,
    originalPrice: 899,
    image: 'https://via.placeholder.com/300?text=TShirt',
    category: 'Fashion',
    stock: 200,
    discount: 44,
    rating: 4.2,
    tags: ['fashion', 'clothing', 'casual'],
    isFeatured: false,
  },
  {
    name: 'Yoga Mat',
    description: 'Non-slip exercise yoga mat for home and gym',
    price: 599,
    originalPrice: 1299,
    image: 'https://via.placeholder.com/300?text=YogaMat',
    category: 'Sports',
    stock: 80,
    discount: 53,
    rating: 4.6,
    tags: ['sports', 'fitness', 'yoga'],
    isFeatured: true,
  },
  {
    name: 'Coffee Maker',
    description: 'Automatic drip coffee maker with thermal carafe',
    price: 1999,
    originalPrice: 3499,
    image: 'https://via.placeholder.com/300?text=CoffeeMaker',
    category: 'Home',
    stock: 25,
    discount: 42,
    rating: 4.4,
    tags: ['home', 'kitchen', 'appliances'],
    isFeatured: true,
  },
  {
    name: 'JavaScript Guide',
    description: 'Complete guide to JavaScript programming language',
    price: 399,
    originalPrice: 599,
    image: 'https://via.placeholder.com/300?text=JSBook',
    category: 'Books',
    stock: 100,
    discount: 33,
    rating: 4.7,
    tags: ['books', 'programming', 'javascript'],
    isFeatured: false,
  },
  {
    name: 'Face Moisturizer',
    description: 'Hydrating face cream for all skin types',
    price: 899,
    originalPrice: 1499,
    image: 'https://via.placeholder.com/300?text=Moisturizer',
    category: 'Beauty',
    stock: 150,
    discount: 40,
    rating: 4.5,
    tags: ['beauty', 'skincare', 'moisturizer'],
    isFeatured: false,
  },
  {
    name: 'Building Blocks',
    description: 'Colorful educational building blocks for kids',
    price: 299,
    originalPrice: 599,
    image: 'https://via.placeholder.com/300?text=Blocks',
    category: 'Toys',
    stock: 120,
    discount: 50,
    rating: 4.8,
    tags: ['toys', 'kids', 'educational'],
    isFeatured: true,
  },
  {
    name: 'Organic Pasta',
    description: 'Premium organic whole wheat pasta',
    price: 199,
    originalPrice: 349,
    image: 'https://via.placeholder.com/300?text=Pasta',
    category: 'Food',
    stock: 300,
    discount: 42,
    rating: 4.3,
    tags: ['food', 'organic', 'pasta'],
    isFeatured: false,
  },
  {
    name: 'Laptop Stand',
    description: 'Adjustable aluminum laptop stand for ergonomic setup',
    price: 1299,
    originalPrice: 1999,
    image: 'https://via.placeholder.com/300?text=Laptop+Stand',
    category: 'Electronics',
    stock: 60,
    discount: 35,
    rating: 4.6,
    tags: ['electronics', 'accessories', 'office'],
    isFeatured: false,
  },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Clear existing products
    await Product.deleteMany({});
    console.log('✓ Cleared existing products');

    // Insert sample products
    const inserted = await Product.insertMany(sampleProducts);
    console.log(`✓ Seeded ${inserted.length} products successfully`);

    // Show categories
    const categories = await Product.distinct('category');
    console.log('\nCategories added:');
    categories.forEach((cat) => console.log(`  - ${cat}`));

    // Show featured products
    const featured = await Product.countDocuments({ isFeatured: true });
    console.log(`\n✓ Featured products: ${featured}`);

    // Disconnect from MongoDB
    await disconnectDB();
  } catch (error) {
    console.error('✗ Seeding failed:', error.message);
    process.exit(1);
  }
}

// Run the seeding script
seedDatabase();
