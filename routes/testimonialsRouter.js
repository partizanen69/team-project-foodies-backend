import express from 'express';
import testimonialControllers from '../controllers/testimonialControllers.js';

const testimonialsRouter = express.Router();
testimonialsRouter.get('/', testimonialControllers.getTestimonials);

export default testimonialsRouter;