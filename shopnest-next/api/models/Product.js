const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    image: {
      type: String,
      required: [true, 'Please provide an image URL'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: [
        'Electronics',
        'Fashion',
        'Home',
        'Books',
        'Sports',
        'Beauty',
        'Toys',
        'Food',
      ],
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      default: 0,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: [
      {
        user: String,
        text: String,
        rating: Number,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    tags: [String],
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Create index for faster queries
ProductSchema.index({ category: 1, name: 1 });
ProductSchema.index({ isFeatured: 1 });

module.exports = mongoose.model('Product', ProductSchema);
