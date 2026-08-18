const express = require('express');
const { register, login, me ,updateProfile} = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');
const { loginRateLimiter } = require('../middleware/rateLimiter'); 

const router = express.Router();

router.post('/register', register);         
router.post('/login', loginRateLimiter, login);  
router.get('/me', requireAuth, me);            
router.put('/me', requireAuth, updateProfile);  

module.exports = router;