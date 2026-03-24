import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
	windowMs: 10 * 60 * 1000,  			// 10 minutes
	limit: 100,              			// max requests per window per user
	standardHeaders: 'draft-7',      	// adds RateLimit headers to responses
	legacyHeaders: false,
	message: {
		error: 'Too many requests, please try again later.',
	},
});

export const createLimiter = rateLimit({
	windowMs: 60 * 1000,   
	limit: 10,           
	message: {
		error: 'Too many applications created, slow down.',
	},
});