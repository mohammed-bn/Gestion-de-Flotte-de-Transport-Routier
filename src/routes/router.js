
const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const roleController = require('../controllers/role.controller');

const {protect, authorize} = require("../middlewares/auth.middleware");

//router pour auth 
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", protect, authController.logout);
router.get("/me", protect, authController.getMe);
router.patch("/change-password", protect, authController.changePassword);


module.exports = router;

