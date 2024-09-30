const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const businessRoutes = require('./routes/businessRoutes');

const app = express();
const port = process.env.PORT || 3000;

db.connector();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});