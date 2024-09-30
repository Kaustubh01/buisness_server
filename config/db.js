const mongoose = require('mongoose');

exports.connector = () => {
    mongoose.connect(process.env.DB_URL || 'mongodb://localhost:27017/express-mongo')
    .then(() => console.log('Connected to MongoDB!!'))
    .catch((err) => {
        console.error('Could not connect to MongoDB', err)
        process.exit(1);
    });
}