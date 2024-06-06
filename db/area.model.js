import { Schema, model } from 'mongoose';
import { handleSaveError, setUpdateOptions } from './hooks.js';

const areaSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
  },
  { versionKey: false, timestamps: true }
);

areaSchema.post('save', handleSaveError);

areaSchema.pre('findOneAndUpdate', setUpdateOptions);

areaSchema.post('findOneAndUpdate', handleSaveError);

const Area = model('area', areaSchema);

export default Area;
