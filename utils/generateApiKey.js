const crypto = require('crypto');
const ApiKey = require('../schemas/apiKey.schema');

const generateApiKey = async (user) => {
    const apiKey = crypto.randomBytes(16).toString('hex');

    const currentDateTime = new Date();
    const time = currentDateTime.toTimeString().split(' ')[0]; 
    const date = currentDateTime.toISOString().split('T')[0]; 
    const timezone = currentDateTime.toString().match(/\((.+)\)/)[1]; 

    const dataToHash = `${apiKey}${time}${date}${timezone}`;

    const hashedApiKey = crypto.createHash('sha256').update(dataToHash).digest('hex');

    const secret = crypto.randomBytes(32).toString('hex');

    const newApiKey = new ApiKey({
        apiKey: hashedApiKey,
        secret,
        owner: user._id
    });
    await newApiKey.save()

    return hashedApiKey;
}

module.exports = generateApiKey;