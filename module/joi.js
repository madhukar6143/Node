const Joi = require('joi');

const usernameSchema = Joi.string().alphanum().min(3).max(30).required();
const passwordSchema = Joi.string()
                           .min(8)
                           .max(30)
                           .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})'))
                           .required()
                           .error(new Error('Password must contain at least 8 characters, including uppercase and lowercase letters, numbers, and special characters'));
                           ;

exports.validateUsername = (username) => {
    const { error, value } = usernameSchema.validate(username);
    return { error, value }  
};

exports.validatePassword = (password) => {
    const { error, value } = passwordSchema.validate(password);
   return { error, value }
};
