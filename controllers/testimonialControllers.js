import * as testimonialServices from "../services/testimonialServices.js";
import { toController } from "../utils/api.js";

const getTestimonials = async (req, res) => {
    const testimonials = await testimonialServices.findTestimonials();
    res.status(200).json(testimonials);
};

export default { getTestimonials: toController(getTestimonials),
};