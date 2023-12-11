const mongoose = require('mongoose');

// Define a schema for the menu items
const menuItemSchema = new mongoose.Schema({
  id: Number,
  name: String,
  price: Number,
  image: String,
});

// Define a schema for a user's menu
const userMenuSchema = new mongoose.Schema({
  userId: String, // User ID to associate with the menu
  items: [menuItemSchema], // Array of menu items
});

// Create models for menu items and user menus
const MenuItem = mongoose.model('MenuItem', menuItemSchema);
const UserMenu = mongoose.model('UserMenu', userMenuSchema);

module.exports = { MenuItem, UserMenu };