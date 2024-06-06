import { Schema, model } from 'mongoose';
import { handleSaveError } from './hooks.js';

const recipeSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    area: {
      type: String,
      required: [true, 'Area is required'],
    },
    instructions: {
      type: String,
      required: [true, 'Instructions are required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    thumb: {
      type: String,
      default: null,
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
    },
    ingredients: [
      {
        id: { type: String, required: true },
        measure: { type: String, required: [true, 'Measure is required'] },
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

recipeSchema.post('save', handleSaveError);

const Recipe = model('recipe', recipeSchema);

export default Recipe;
