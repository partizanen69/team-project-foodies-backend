import Testimonial from "../db/testimonial.model.js";

export const findTestimonials = () => Testimonial.find();
