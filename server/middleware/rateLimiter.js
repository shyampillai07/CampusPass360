const rateLimit = require('express-rate-limit');


const windowMinutes = Number(process.env.LOGIN_RATE_LIMIT_WINDOW_MIN || 15);
const maxAttempts = Number(process.env.LOGIN_RATE_LIMIT_MAX_ATTEMPTS || 10);

const loginRateLimiter = rateLimit({
  windowMs: windowMinutes * 60 * 1000, 
  max: maxAttempts,                     
  standardHeaders: true,               
  legacyHeaders: false,                 
  message: { error: 'Too many login attempts. Please try again later.' },
});

module.exports = { loginRateLimiter };