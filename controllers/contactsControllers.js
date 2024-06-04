import * as contactsServices from '../services/contactsServices.js';
import { toController } from '../utils/api.js';

const getAllContacts = async (req, res) => {
  const contacts = await contactsServices.listContacts({
    userId: req.user._id,
  });
  res.status(200).json(contacts);
};

const getOneContact = async (req, res) => {
  const contact = await contactsServices.getContactById({
    contactId: req.params.id,
    userId: req.user._id,
  });

  if (contact) {
    res.status(200).json(contact);
    return;
  }

  res.status(404).json({ message: 'Not found' });
};

const deleteContact = async (req, res) => {
  const removedContact = await contactsServices.removeContact({
    contactId: req.params.id,
    userId: req.user._id,
  });

  if (removedContact) {
    res.status(200).json(removedContact);
    return;
  }

  res.status(404).json({ message: 'Not found' });
};

const createContact = async (req, res) => {
  const { name, email, phone } = req.body;
  const addedContact = await contactsServices.addContact({
    name,
    email,
    phone,
    userId: req.user._id,
  });
  res.status(201).json(addedContact);
};

const updateContact = async (req, res) => {
  const updatedContact = await contactsServices.updateContact({
    contactId: req.params.id,
    updatePayload: req.body,
    userId: req.user._id,
  });

  if (!updatedContact) {
    res.status(404).json({ message: 'Not found' });
    return;
  }

  res.status(200).json(updatedContact);
};

const updateStatusContact = async (req, res) => {
  const { favorite } = req.body;

  const updatedContact = await contactsServices.updateContact({
    contactId: req.params.id,
    updatePayload: {
      favorite,
    },
    userId: req.user._id,
  });

  if (!updatedContact) {
    res.status(404).json({ message: 'Not found' });
    return;
  }

  res.status(200).json(updatedContact);
};

export default {
  getAllContacts: toController(getAllContacts),
  getOneContact: toController(getOneContact),
  deleteContact: toController(deleteContact),
  createContact: toController(createContact),
  updateContact: toController(updateContact),
  updateStatusContact: toController(updateStatusContact),
};
