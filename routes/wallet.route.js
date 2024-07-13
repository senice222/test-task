const { Router } = require('express');
const WalletService = require('../services/wallet.service');
// const { checkAuth } = require('../middleware/checkAuth');
const checkApiKey = require('../middleware/checkApiKey');

const WalletRoute = Router();

WalletRoute.post('/transfer', checkApiKey, WalletService.transfer);
WalletRoute.post('/convert', checkApiKey, WalletService.convert);

module.exports = WalletRoute;