const Joi = require('joi');

const usernameSchema = Joi.string().alphanum().min(3).max(30).required();
const passwordSchema = Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required();

exports.validateUsername = (username) => {
    const { error, value } = usernameSchema.validate(username);
    return { error, value }  
};

exports.validatePassword = (password) => {
    const { error, value } = passwordSchema.validate(password);
   return { error, value }
};
