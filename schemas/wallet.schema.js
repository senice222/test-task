const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',  
        required: true
    },
    balance: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true,
        default: 'USDT'
    },
});

const Wallet = mongoose.model('Wallet', WalletSchema);

module.exports = {Wallet};