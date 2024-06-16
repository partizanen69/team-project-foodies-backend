import Testimonial from "../db/testimonial.model.js";




export const findTestimonials = () => Testimonial.find();


// const testimonials = await Testimonial.aggregate([
//     {
//         $lookup: {
//             from: 'users',
//             localField: 'owner',
//             foreignField: '_id',
//             as: 'owner',
//         }

//     },
//     return testimonials;
// ]);

