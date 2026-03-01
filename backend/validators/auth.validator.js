const Joi = require("joi");

const signupSchema = Joi.object({
  username: Joi.string().min(5).required().messages({
    "string.empty": "Username is required",
    "string.min": "Username must be at least 5 characters",
    "any.required": "Username is required",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please enter a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string()
    .min(8)
    .pattern(/[A-Z]/, "uppercase")
    .pattern(/[!@#$%^&*(),.?":{}|<>]/, "special character")
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters",
      "string.pattern.name": "Password must contain at least one {#name}",
      "any.required": "Password is required",
    }),
  college: Joi.string().required().messages({
    "string.empty": "College is required",
    "any.required": "College is required",
  }),
  branch: Joi.string().required().messages({
    "string.empty": "Branch is required",
    "any.required": "Branch is required",
  }),
});

const loginSchema = Joi.object({
  identifier: Joi.string().required().messages({
    "string.empty": "Username or email is required",
    "any.required": "Username or email is required",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
});

module.exports = { signupSchema, loginSchema };