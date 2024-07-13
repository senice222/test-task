const express = require('express');
const WalletRoute = require('./routes/wallet.route');
const UserRoute = require('./routes/user.route');

const startServer = () => {
    const app = express();

    app.use(express.json());

    app.listen(4000, () => {
        console.log('Server OK');
        console.log(`worker pid=${process.pid}`)
    });

    app.use('/internal', WalletRoute);
    app.use('/internal', UserRoute);
};

module.exports = { startServer };