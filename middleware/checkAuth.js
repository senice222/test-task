const {verifyToken} = require("../services/user.service");
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const checkAuth = (req, res, next) => {
    const token = req.headers.authorization.replace(/Bearer\s?/, "");

    if (!token) {
        return res.status(403).json({
            message: "Нет доступа",
        });
    }
    try {
        const { _id } = verifyToken(token, JWT_SECRET);
        req.userId = _id;
        next();
    } catch (err) {
        return res.status(403).json({
            message: "Нет доступа",
        });
    }
};

module.exports = {checkAuth};