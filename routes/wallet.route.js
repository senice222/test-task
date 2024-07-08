const { Router } = require('express');
const WalletService = require('../services/wallet.service');
const { checkAuth } = require('../middleware/checkAuth');

const WalletRoute = Router();

WalletRoute.post('/transfer', checkAuth, WalletService.transfer);
WalletRoute.post('/convert', checkAuth, WalletService.convert);

module.exports = WalletRoute;