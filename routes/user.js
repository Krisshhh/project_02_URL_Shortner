//part of authentication video of node.js- 39 min video

const express = require('express');
const {handleUserSignup, handleUserLogin}= require('../controllers/user');
const router = express.Router();


router.post("/", handleUserSignup);
router.post("/login",handleUserLogin);

module.exports = router;