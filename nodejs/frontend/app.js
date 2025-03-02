const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Models
const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
});

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  publisher: { type: String, required: true },
  category: { type: String, required: true },
  available: { type: Boolean, default: true },
});

const User = mongoose.model("User", UserSchema);
const Book = mongoose.model("Book", BookSchema);

// Routes
app.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res
      .status(201)
      .send({ message: "User enrolled successfully", userId: user._id });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.get("/books", async (req, res) => {
  try {
    const { publisher, category } = req.query;
    const query = { available: true };
    if (publisher) query.publisher = publisher;
    if (category) query.category = category;
    const books = await Book.find(query);
    res.send(books);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .where("available")
      .equals(true);
    if (!book) return res.status(404).send({ error: "Book not found" });
    res.send(book);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.post("/books/:id/borrow", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book || !book.available)
      return res.status(400).send({ error: "Book not available" });
    book.available = false;
    await book.save();
    res.send({ message: "Book borrowed successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Frontend API running on port ${PORT}`));
