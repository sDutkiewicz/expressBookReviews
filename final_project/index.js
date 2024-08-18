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
    saveUninitialized: true
}));

app.use("/customer/auth/*", function auth(req, res, next) {
    const token = req.session.token;

    if (!token) {
        return res.status(403).json({ message: "Unauthorized access: No token provided." });
    }

    jwt.verify(token, "fingerprint_customer", (err, decoded) => {
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
