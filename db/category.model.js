import { Schema, model } from 'mongoose';
import { handleSaveError, setUpdateOptions } from './hooks.js';

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    imgUrl: {
      type: String,
      required: [true, 'Email is required'],
    },
  },
  { versionKey: false, timestamps: true }
);

categorySchema.post('save', handleSaveError);

categorySchema.pre('findOneAndUpdate', setUpdateOptions);

categorySchema.post('findOneAndUpdate', handleSaveError);

const Category = model('category', categorySchema);

export default Category;
