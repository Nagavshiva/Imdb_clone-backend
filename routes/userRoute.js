const express = require("express");
const userController = require("../controllers/userController");
const validate = require("../middlewares/validateMiddleware");
const signUpSchema = require("../utils/authValidator")

const router = express.Router();

router.post('/register',validate(signUpSchema.signupSchema),userController.register);
router.post('/login',validate(signUpSchema.loginSchema),userController.login);


module.exports = router;