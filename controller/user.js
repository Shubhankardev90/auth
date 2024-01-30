const User = require('../model/user');
const generateToken = require('../utils/generateToken');


const register = async (req, res) => {
    const { name, email, phone, password } = req.body;

    const existingUserWithEmail = await User.findOne({ email });
    if (existingUserWithEmail) {
        return res.json({
            'status': 'NOT_OK',
            'message': "User already exists with this email"
        });
    }

    const existingUserWithPhone = await User.findOne({ phone });
    if (existingUserWithPhone) {
        return res.json({
            'status': 'NOT_OK',
            'message': "User already exists with this phone"
        });
    }

    const newUser = new User({
        name,
        email,
        phone,
        password
    });

    await newUser.save();

    const token = await generateToken(newUser.user_id);

    return res.json({
        'status': "OK",
        "message": "You registered successfully",
        "data": {
            'token': token
        }
    });
};


module.exports = {
    register
}