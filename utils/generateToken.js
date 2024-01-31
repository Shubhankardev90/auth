const jwt = require('jsonwebtoken');

const generateToken = (user_id) => {
    const secretKey = process.env.JWT_SECRET;
    const payload = {
        user_id: user_id
    };
    const options = {
        expiresIn: '7d'
    };

    const token = jwt.sign(payload, secretKey, options);

    return token;
};

module.exports = generateToken