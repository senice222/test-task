const crypto = require('crypto');
const ApiKey = require('../schemas/apiKey.schema');

const checkApiKey = async (req, res, next) => {
    const { api_key, timestamp, date, timezone, signature } = req.headers;

    if (!api_key || !timestamp || !date || !timezone || !signature) {
        return res.status(400).send('API key, timestamp, date, timezone, and signature are required');
    }

    const currentTime = Date.now();
    const timeDiff = Math.abs(currentTime - parseInt(timestamp));
    
    if (timeDiff > 300000) { // 5 минут
        return res.status(400).send('Request timestamp is too old');
    }

    try {
        const keyRecord = await ApiKey.findOne({ apiKey: api_key });
        if (!keyRecord) {
            return res.status(401).send('Invalid API key');
        }

        const { secret } = keyRecord;

        const dataToHash = `${api_key}${timestamp}${date}${timezone}${secret}`;
        const expectedSignature = crypto.createHash('sha256').update(dataToHash).digest('hex');

        if (signature !== expectedSignature) {
            return res.status(401).send('Invalid signature');
        }

        next();
    } catch (error) {
        console.error('Error checking API key:', error);
        res.status(500).send('Server error');
    }
};

module.exports = checkApiKey;
