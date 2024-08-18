const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');




public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (users.find(user => user.username === username)) {
        return res.status(409).json({ message: "Username already exists" });
    }

    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
});


// Set up an Axios instance with a base URL and a timeout
const axiosInstance = axios.create({
  baseURL: 'https://slavdutkiewi-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai',
  timeout: 5000, // 5 seconds
});

public_users.get('/', async (req, res) => {
  try {
    const response = await axiosInstance.get('/');
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const response = await axiosInstance.get(`/isbn/${isbn}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(404).json({ message: "Book not found", error: error.message });
  }
});

public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;
  try {
    const response = await axiosInstance.get(`/author/${author}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(404).json({ message: "No books found for this author", error: error.message });
  }
});

public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;
  try {
    const response = await axiosInstance.get(`/title/${title}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(404).json({ message: "No books found with this title", error: error.message });
  }
});

public_users.get('/review/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const response = await axiosInstance.get(`/review/${isbn}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(404).json({ message: "No reviews found for this book", error: error.message });
  }
});

module.exports.general = public_users;
