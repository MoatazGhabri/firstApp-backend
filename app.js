// app.js (backend)
require('dotenv').config(); // Load environment variables from .env file

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const bcrypt = require('bcryptjs'); // Import the bcryptjs library
const bodyParser = require('body-parser');

// Middleware
app.use(express.json());
app.use(cors({
  origin: ["https://mern-task-app-hpih.onrender.com"]
}));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  quantity: Number,
  image: String,
});

const Product = mongoose.model("Product", productSchema);

// Define API routes for CRUD operations
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.post("/api/products", async (req, res) => {
  const { name, price, quantity, image } = req.body;
  try {
    const product = new Product({ name, price, quantity, image });
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to create product" });
  }
});

app.put("/api/products/:id", async (req, res) => {
  const { name, price, quantity, image } = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, quantity, image },
      { new: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});
// app.js (backend)

// ...

app.get("/api/products", async (req, res) => {
  console.log(req.body); // Add this line to check the received data

  try {
    const products = await Product.find({}, { _id: 0, name: 1, price: 1, quantity: 1, image: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// ......................................
// Fetch all comments for admin
const commentSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  email: String,
  address: String,
  number: String,
  quantity: Number,
  productName: String,
  image: String,
  price: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Comment = mongoose.model("Comment", commentSchema);

app.get("/api/comments", async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});
app.get("/api/comments", async (req, res) => {
  console.log(req.body); // Add this line to check the received data

  try {
    const comments = await Comment.find({}, { _id: 0, name: 1,lastName:1, email:1, address:1, number:1, quantity:1, productName:1, image:1, price: 1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});
// Confirm a comment and move it to confirmedComments collection
app.post("/api/comments/:id/confirm", async (req, res) => {
  const commentId = req.params.id;
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Create a new confirmedComment based on the existing comment data
    const confirmedComment = new ConfirmedComment({
      ...comment.toObject(),
      confirmedAt: new Date(),
    });

    // Save the confirmedComment and remove the original comment
    await confirmedComment.save();
    await Comment.findByIdAndDelete(commentId);

    res.status(201).json(confirmedComment);
  } catch (error) {
    res.status(500).json({ error: "Failed to confirm comment" });
  }
});

// Remove a comment
app.delete("/api/comments/:id/remove", async (req, res) => {
  const commentId = req.params.id;
  try {
    const deletedComment = await Comment.findByIdAndDelete(commentId);
    if (!deletedComment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    res.json(deletedComment);
  } catch (error) {
    res.status(500).json({ error: "Failed to remove comment" });
  }
});


// ......................................
// µµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµ

const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const Admin = mongoose.model('Admin', adminSchema);

// Route for admin login
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username, password });

    if (admin) {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
// ************************************************


// µµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµ
const userSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  email: String,
  address: String,
  number: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const User = mongoose.model("User", userSchema);

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});
app.get("/api/users", async (req, res) => {
  console.log(req.body); // Add this line to check the received data

  try {
    const users = await User.find({}, { _id: 0, name: 1,lastName:1, email:1, address:1, number:1});
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});
app.delete("/api/users/:id/remove", async (req, res) => {
  const usersId = req.params.id;
  try {
    const deleteduser = await User.findByIdAndDelete(usersId);
    if (!deleteduser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(deleteduser);
  } catch (error) {
    res.status(500).json({ error: "Failed to remove user" });
  }
});
// µµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµµ
// Add these endpoints after your existing endpoints

app.get("/api/users/count", async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user count" });
  }
});

app.get("/api/comments/count", async (req, res) => {
  try {
    const count = await Comment.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch comment count" });
  }
});

app.get("/api/products/count", async (req, res) => {
  try {
    const count = await Product.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch comment count" });
  }
});
// ******************************************
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
