import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import { prisma } from '../index';
import { AuthRequest } from '../middleware/auth';

export const getAllContacts = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const contacts = await prisma.contact.findMany({
      where: { userId: req.user.userId },
      include: {
        connections: true,
      },
      orderBy: { firstName: 'asc' },
    });

    res.json(contacts);
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ error: 'Failed to get contacts' });
  }
};

export const getContact = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;

    const contact = await prisma.contact.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
      include: {
        connections: true,
      },
    });

    if (!contact) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }

    res.json(contact);
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({ error: 'Failed to get contact' });
  }
};

export const createContact = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      mobile,
      birthday,
      namedayId,
      namedayDate,
      connections,
    } = req.body;

    if (!firstName) {
      res.status(400).json({ error: 'First name is required' });
      return;
    }

    const contact = await prisma.contact.create({
      data: {
        userId: req.user.userId,
        firstName,
        lastName,
        email,
        phone,
        mobile,
        birthday,
        namedayId,
        namedayDate,
        connections: connections
          ? {
              create: connections,
            }
          : undefined,
      },
      include: {
        connections: true,
      },
    });

    res.status(201).json(contact);
  } catch (error) {
    console.error('Create contact error:', error);
    res.status(500).json({ error: 'Failed to create contact' });
  }
};

export const updateContact = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const {
      firstName,
      lastName,
      email,
      phone,
      mobile,
      birthday,
      namedayId,
      namedayDate,
    } = req.body;

    const existingContact = await prisma.contact.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
    });

    if (!existingContact) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }

    const updatedContact = await prisma.contact.update({
      where: { id },
      data: {
        firstName: firstName !== undefined ? firstName : undefined,
        lastName: lastName !== undefined ? lastName : undefined,
        email: email !== undefined ? email : undefined,
        phone: phone !== undefined ? phone : undefined,
        mobile: mobile !== undefined ? mobile : undefined,
        birthday: birthday !== undefined ? birthday : undefined,
        namedayId: namedayId !== undefined ? namedayId : undefined,
        namedayDate: namedayDate !== undefined ? namedayDate : undefined,
      },
      include: {
        connections: true,
      },
    });

    res.json(updatedContact);
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({ error: 'Failed to update contact' });
  }
};

export const deleteContact = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;

    const existingContact = await prisma.contact.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
    });

    if (!existingContact) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }

    await prisma.contact.delete({
      where: { id },
    });

    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
};

export const addConnection = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const connectionData = req.body;

    const contact = await prisma.contact.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
    });

    if (!contact) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }

    const connection = await prisma.connection.create({
      data: {
        contactId: id,
        ...connectionData,
      },
    });

    res.status(201).json(connection);
  } catch (error) {
    console.error('Add connection error:', error);
    res.status(500).json({ error: 'Failed to add connection' });
  }
};

export const updateConnection = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id, connectionId } = req.params;
    const {
      firstName,
      lastName,
      email,
      phone,
      mobile,
      birthday,
      avatarUrl,
      namedayId,
      namedayDate,
    } = req.body;

    const contact = await prisma.contact.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
    });

    if (!contact) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }

    const updatedConnection = await prisma.connection.update({
      where: { id: connectionId },
      data: {
        firstName: firstName !== undefined ? firstName : undefined,
        lastName: lastName !== undefined ? lastName : undefined,
        email: email !== undefined ? email : undefined,
        phone: phone !== undefined ? phone : undefined,
        mobile: mobile !== undefined ? mobile : undefined,
        birthday: birthday !== undefined ? birthday : undefined,
        avatarUrl: avatarUrl !== undefined ? avatarUrl : undefined,
        namedayId: namedayId !== undefined ? namedayId : undefined,
        namedayDate: namedayDate !== undefined ? namedayDate : undefined,
      },
    });

    res.json(updatedConnection);
  } catch (error) {
    console.error('Update connection error:', error);
    res.status(500).json({ error: 'Failed to update connection' });
  }
};

export const deleteConnection = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id, connectionId } = req.params;

    const contact = await prisma.contact.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
    });

    if (!contact) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }

    await prisma.connection.delete({
      where: { id: connectionId },
    });

    res.json({ message: 'Connection deleted successfully' });
  } catch (error) {
    console.error('Delete connection error:', error);
    res.status(500).json({ error: 'Failed to delete connection' });
  }
};

export const uploadContactAvatar = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;

    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const contact = await prisma.contact.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
    });

    if (!contact) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(404).json({ error: 'Contact not found' });
      return;
    }

    const avatarUrl = `/uploads/${req.file.filename}`;

    if (contact.avatarUrl) {
      const oldFilePath = path.join(process.cwd(), contact.avatarUrl);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    const updatedContact = await prisma.contact.update({
      where: { id },
      data: { avatarUrl },
      include: { connections: true },
    });

    res.json(updatedContact);
  } catch (error) {
    console.error('Upload contact avatar error:', error);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Failed to upload contact avatar' });
  }
};

export const deleteContactAvatar = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;

    const contact = await prisma.contact.findFirst({
      where: {
        id,
        userId: req.user.userId,
      },
    });

    if (!contact) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }

    if (contact.avatarUrl) {
      const filePath = path.join(process.cwd(), contact.avatarUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    const updatedContact = await prisma.contact.update({
      where: { id },
      data: { avatarUrl: null },
      include: { connections: true },
    });

    res.json(updatedContact);
  } catch (error) {
    console.error('Delete contact avatar error:', error);
    res.status(500).json({ error: 'Failed to delete contact avatar' });
  }
};
