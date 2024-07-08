const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {Wallet} = require("../schemas/wallet.schema");
const { User } = require('../schemas/user.schema');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const register = async (req, res) => {
    const { username, password } = req.body;

    try {
        const alreadyUser = await User.findOne({ username });

        if (alreadyUser) {
            return res.status(404).json({ message: 'Пользователь уже существует.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            hashedPassword,
        });

        const token = jwt.sign(
            { _id: newUser._id },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

        newUser.token = token;
        const user = await newUser.save();

        const wallet = new Wallet({
            owner: user._id, // connect wallet to user id
            balance: 0,
            currency: 'USD' // default currency
        });

        await wallet.save();

        const { passwordHash, ...userData } = user._doc;
        res.json({
            ...userData,
            token
        });
    } catch (error) {
        console.error('Ошибка при регистрации пользователя:', error);
        res.status(500).json({ message: 'Произошла ошибка при регистрации пользователя' });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    try {

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }
        console.log(user)
        const isValidPassword = await bcrypt.compare(password, user.hashedPassword);

        if (!isValidPassword) {
            return res.status(401).json({ message: 'Неверный логин или пароль' });
        }

        const token = jwt.sign(
            { _id: user._id },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

        const { passwordHash, ...userData } = user._doc;
        res.json({
            ...userData,
            token
        });
    } catch (error) {
        console.error('Ошибка при входе:', error);
        res.status(500).json({ message: 'Произошла ошибка при входе пользователя' });
    }
};

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        throw new Error('Неверный токен.');
    }
};

module.exports = { register, login, verifyToken };
