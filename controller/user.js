const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../model/user');
const generateToken = require('../utils/generateToken');
const { sendEmail } = require('../utils/sendEmail');


const register = async (req, res) => {
    const { name, email, phone, password } = req.body;

    const existingUserWithEmail = await User.findOne({ email });
    if (existingUserWithEmail) {
        return res.json({
            status: 'NOT_OK',
            message: "User already exists with this email"
        });
    }

    const existingUserWithPhone = await User.findOne({ phone });
    if (existingUserWithPhone) {
        return res.json({
            status: 'NOT_OK',
            message: "User already exists with this phone"
        });
    }

    const newUser = new User({
        name,
        email,
        phone,
        password
    });

    await newUser.save();

    const token = await generateToken(newUser.id);

    return res.json({
        status: "OK",
        message: "You registered successfully",
        data: {
            'token': token
        }
    });
};

const login = async (req, res) => {
    const { phone, email, password } = req.body;

    try {
        let user;

        if (email) {
            // If login is via email
            user = await User.findOne({ email });
        } else if (phone) {
            // If login is via phone number
            user = await User.findOne({ phone });
        } else {
            return res.status(400).json(
                {
                    status: "NOT_OK",
                    message: 'Email or phone is required for login'
                }
            );
        }

        if (!user) {
            return res.status(404).json({
                status: "NOT_OK",
                message: 'User not found'
            }
            );
        }

        // Compare the provided password with the hashed password stored in the database
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(401).json(
                {
                    status: "NOT_OK",
                    message: 'Invalid password'
                }
            );
        }

        // Generate JWT token and send it in the response
        const token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({
            status: "OK",
            message: "Logged in successfully",
            data: {
                token: token
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "NOT_OK",
            message: 'Internal Server Error'
        });
    }
};

const profile = async (req, res) => {
    const user = req.user;
    return res.json({
        "status": "OK",
        "message": "Welcome " + user.name,
        "data": {
            'user': user
        }
    })
}

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    try {
        if (!user) {
            return res.json({
                status: "NOT_OK",
                message: "User not found"
            })
        }
        const token = generateToken(user.id);
        const protocol = req.protocol;
        const host = req.get('host');
        const resetLink = `${protocol}://${host}/api/v1/reset-password?token=${token}`;
        const emailSubject = 'Reset Your Password';
        const emailHtml = `<p>Click the following link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`;

        await sendEmail(user.email, emailSubject, emailHtml);

        return res.json({
            status: "OK",
            message: "Reset password link sent successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }

}

const resetPassword = async (req, res) => {
    const token = req.query.token;
    const { newPassword, compareNewPassword, savePassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user by ID from the token
        const user = await User.findById(decoded.user_id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (savePassword) {
            if (!newPassword) {
                return res.json({
                    status: 'NOT_OK',
                    message: 'Enter new password'
                })
            }
            if (!compareNewPassword) {
                return res.json({
                    status: 'NOT_OK',
                    message: 'Compare password is incorrect'
                })
            }
            // Update user's password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
            user.password = hashedPassword;
            await user.save();

            return res.json({
                status: "OK",
                message: "Password reset successful",
            });
        }

        return res.json({
            status: "OK",
            message: "Hi "+user.name+" enter your new password"
        })

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ message: 'Token has expired' });
        }

        return res.status(403).json({ message: 'Invalid token' });
    }
}

module.exports = {
    register,
    profile,
    login,
    forgotPassword,
    resetPassword,
}