import { Schema, model } from 'mongoose';
import { handleSaveError } from './hooks.js';

const ingredientSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'The name of the ingredient is required'],
        },
        desc: {
            type: String,
            required: [true, 'Ingredient description is required'],
        },
        img: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

ingredientSchema.post('save', handleSaveError);

const Ingredient = model('ingredient', ingredientSchema);

export default Ingredient;