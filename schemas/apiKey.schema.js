const mongoose = require('mongoose');

const apiKeySchema = new mongoose.Schema({
    apiKey: { type: String, required: true, unique: true },
    secret: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

const ApiKey = mongoose.model('ApiKey', apiKeySchema);

module.exports = ApiKey;
