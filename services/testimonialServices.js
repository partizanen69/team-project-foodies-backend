import Testimonial from '../db/testimonial.model.js';

export const findTestimonials = () =>
  Testimonial.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'owner',
        foreignField: '_id',
        as: 'owner',
      },
    },
    {
      $unwind: '$owner',
    },
  ]);
