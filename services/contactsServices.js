import ContactModel from '../db/contacts.model.js';
import { Types as MongooseTypes } from 'mongoose';

export async function listContacts({ userId }) {
  return ContactModel.find({ owner: userId });
}

export async function getContactById({ contactId, userId }) {
  const [contact] = await ContactModel.find({ _id: contactId, owner: userId });
  return contact ?? null;
}

export async function removeContact({ contactId, userId }) {
  return ContactModel.findOneAndDelete({
    _id: new MongooseTypes.ObjectId(contactId),
    owner: userId,
  });
}

export async function addContact({ name, email, phone, userId }) {
  const newContact = new ContactModel({
    name,
    email,
    phone,
    owner: userId,
  });

  await newContact.save();

  return newContact;
}

export async function updateContact({ contactId, updatePayload, userId }) {
  return ContactModel.findByIdAndUpdate(
    { _id: new MongooseTypes.ObjectId(contactId), owner: userId },
    updatePayload,
    { new: true, runValidators: true }
  );
}
