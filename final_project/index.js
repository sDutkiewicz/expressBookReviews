const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use(session({
    secret: "fingerprint_customer", 
    resave: true, 
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true } // Ensure secure is false if not using HTTPS
}));


app.use("/customer/auth/*", function auth(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Get the token from the header

    if (!token) {
        return res.status(403).json({ message: "Unauthorized access: No token provided." });
    }

    jwt.verify(token, "your_secret_key", (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Unauthorized access: Invalid token." });
        }

        req.user = decoded;
        next();
    });
});


app.use("/customer", customer_routes);
app.use("/", genl_routes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
