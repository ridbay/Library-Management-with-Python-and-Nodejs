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
const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  publisher: { type: String, required: true },
  category: { type: String, required: true },
  available: { type: Boolean, default: true },
});

const Book = mongoose.model("Book", BookSchema);

// Routes
app.post("/admin/books", async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res
      .status(201)
      .send({ message: "Book added successfully", bookId: book._id });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.delete("/admin/books/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).send({ error: "Book not found" });
    res.send({ message: "Book removed successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend API running on port ${PORT}`));
