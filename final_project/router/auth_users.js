const express = require('express');
const jwt = require('jsonwebtoken');
const regd_users = express.Router();

let users = []; 

const isValid = (username) => {
    return username && username.trim() !== "";
};

const authenticatedUser = (username, password) => {
    const user = users.find(user => user.username === username);
    return user && user.password === password;
};

regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ username }, "your_secret_key", { expiresIn: '1h' });
    

    return res.status(200).json({ message: "Login successful"});
});

regd_users.put("/auth/review/:isbn", (req, res) => {
    return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users; 
