const { Router } = require('express');
const UserService = require('../services/user.service');

const UserRoute = Router();

UserRoute.post('/login', UserService.login);
UserRoute.post('/register', UserService.register);

module.exports = UserRoute;