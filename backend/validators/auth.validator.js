const Joi = require("joi");

const signupSchema = Joi.object({
  username: Joi.string().min(5).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(/[A-Z]/, "uppercase")
    .pattern(/[!@#$%^&*(),.?":{}|<>]/, "special character")
    .required(),
  college: Joi.string().required(),
  branch: Joi.string().required(),
});

const loginSchema = Joi.object({
  identifier: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = { signupSchema, loginSchema };