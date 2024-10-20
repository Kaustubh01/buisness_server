const express = require('express');
const cors = require('cors');
// body-parser is no longer necessary as express.json() and express.urlencoded() handle it
const bodyParser = require('body-parser');

const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const businessRoutes = require('./routes/businessRoutes'); // Import inventory routes

const app = express();
const port = process.env.PORT || 3000;

// Connect to the database
db.connector();

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes); // Add inventory route

// Root route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
