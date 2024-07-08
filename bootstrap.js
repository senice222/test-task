const mongoose = require('mongoose');
const { startServer } = require('./index');
require('dotenv').config();

const MONGODB_URL = process.env.MONGODB_URL;

mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        startServer();
    })
    .catch((e) => console.log('DB err', e));

process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('Closed connection with MongoDB successfully');
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
    } finally {
        process.exit();
    }
});
