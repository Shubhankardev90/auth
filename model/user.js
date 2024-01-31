const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        unique: [true, 'Phone number must be unique'],
        validate: {
            validator: function (v) {
                return /\d{10}/.test(v); // Validate that the phone number is 10 digits
            },
            message: props => `${props.value} is not a valid phone number!`,
        },
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email must be unique'],
        validate: {
            validator: function (v) {
                return /\S+@\S+\.\S+/.test(v); // Basic email format validation
            },
            message: props => `${props.value} is not a valid email address!`,
        },
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
}, { timestamps: true });

// Hash the password before saving
userSchema.pre('save', async function (next) {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(this.password, saltRounds);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
// Create the User model
const User = mongoose.model('User', userSchema);

// Export the User model
module.exports = User;
