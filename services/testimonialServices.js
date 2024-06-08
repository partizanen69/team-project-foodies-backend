import Testimonial from "../db/testimonial.model.js";

export const getAll = (search = {}) => {
    const { filter = {}, fields = "", settings = {} } = search;
    return Testimonial.find(filter, fields, settings);

};
export const findTestimonials = () => Testimonial.find();
