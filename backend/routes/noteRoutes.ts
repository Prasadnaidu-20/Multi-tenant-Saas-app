// import Note from '../models/Note';
// import { Request, Response } from 'express';

// export const createNote = async (req: Request, res: Response) => {
//   try {
//     const newNote = new Note({
//       title: req.body.title,
//       content: req.body.content,
//       tenantId: req.user.tenantId, // from auth middleware
//       createdBy: req.user.id
//     });

//     await newNote.save();
//     res.status(201).json(newNote);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err });
//   }
// };

// export const getNotes = async (req: Request, res: Response) => {
//   try {
//     const notes = await Note.find({ tenantId: req.user.tenantId });
//     res.json(notes);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err });
//   }
// };

// export const getNoteById = async (req: Request, res: Response) => {
//   try {
//     const note = await Note.findOne({ _id: req.params.id, tenantId: req.user.tenantId });
//     if (!note) return res.status(404).json({ message: 'Note not found' });
//     res.json(note);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err });
//   }

// };

// export const updateNote = async (req: Request, res: Response) => {
//   try {
//     const note = await Note.findOneAndUpdate(
//       { _id: req.params.id, tenantId: req.user.tenantId },
//       { title: req.body.title, content: req.body.content },
//       { new: true }
//     );
//     if (!note) return res.status(404).json({ message: 'Note not found' });
//     res.json(note);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err });
//   }
// };


// export const deleteNote = async (req: Request, res: Response) => {
//   try {
//     const note = await Note.findOneAndDelete({ _id: req.params.id, tenantId: req.user.tenantId });
//     if (!note) return res.status(404).json({ message: 'Note not found' });
//     res.json({ message: 'Note deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err });
//   }
// };

