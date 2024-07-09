const {User} = require("../schemas/user.schema");
const {Wallet} = require("../schemas/wallet.schema");
const axios = require("axios");

const transfer = async (req, res) => {
    const {walletFrom, recipient, amount} = req.body;
    const token = req.headers.authorization.replace(/Bearer\s?/, "");

    if (!token || !walletFrom || !recipient || !amount) {
        return res.status(400).send('Все поля обязательны');
    }

    try {
        const sender = await User.findOne({token});
        if (!sender) return res.status(401).send('Неверный токен');

        const senderWallet = await Wallet.findOne({owner: walletFrom});

        if (!senderWallet || senderWallet.balance < amount) {
            return res.status(400).send('Недостаточно средств или кошелек не найден');
        }

        const recipientUser = await User.findById(recipient)

        if (!recipientUser) return res.status(404).send('Получатель не найден');

        const recipientWallet = await Wallet.findOne({owner: recipientUser._id});
        if (!recipientWallet) {
            return res.status(404).send('Кошелек получателя не найден');
        }

        senderWallet.balance -= amount;
        recipientWallet.balance += amount;

        await senderWallet.save();
        await recipientWallet.save();

        res.send('Перевод выполнен успешно');
    } catch (error) {
        res.status(500).send('Ошибка сервера');
    }
}

const convert = async (req, res) => {
    const {amount} = req.body;
    const token = req.headers.authorization.replace(/Bearer\s?/, "");

    if (!token || !amount) {
        return res.status(400).send('Все поля обязательны');
    }

    try {
        const user = await User.findOne({token});
        if (!user) return res.status(401).send('Неверный токен');
        const {data} = await axios.get('http://api.exchangeratesapi.io/latest', {
            params: {
                access_key: process.env.API_KEY,
            }
        });
        const rates = data.rates;
        const result = {
            originalAmount: amount,
            RUB: Math.round(amount * rates.RUB),
            UAH: Math.round(amount * rates.UAH),
            KZT: Math.round(amount * rates.KZT)
        };

        res.json(result);
    } catch (error) {
        res.status(500).send('Ошибка сервера');
    }
}

module.exports = {transfer, convert}
