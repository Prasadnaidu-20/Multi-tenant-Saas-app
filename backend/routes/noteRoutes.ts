import { Router } from 'express';
import Note from '../models/Note';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';
import { Response } from 'express';

const router = Router();

// GET /api/notes - Information about the notes endpoint
router.get('/info', (req, res) => {
  res.json({
    message: "Notes API endpoint",
    authentication: "Bearer token required",
    endpoints: {
      "GET /api/notes": "Get all notes for authenticated user's tenant",
      "POST /api/notes": "Create a new note",
      "GET /api/notes/:id": "Get a specific note by ID",
      "PUT /api/notes/:id": "Update a note by ID",
      "DELETE /api/notes/:id": "Delete a note by ID"
    },
    requiredHeaders: {
      "Authorization": "Bearer <jwt_token>",
      "Content-Type": "application/json"
    },
    example: {
      create: {
        method: "POST",
        body: {
          title: "Note Title",
          content: "Note content here"
        }
      }
    },
    note: "All notes are isolated by tenant. Use the frontend at http://localhost:3000 for user interface."
  });
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  const newNote = new Note({
    title: req.body.title,
    content: req.body.content,
    tenantId: req.user!.tenantId,
    createdBy: req.user!.id,
  });
  await newNote.save();
  res.status(201).json(newNote);
});

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  const notes = await Note.find({ tenantId: req.user!.tenantId });
  res.json(notes);
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  const note = await Note.findOne({ _id: req.params.id, tenantId: req.user!.tenantId });
  if (!note) return res.status(404).json({ message: 'Note not found' });
  res.json(note);
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, tenantId: req.user!.tenantId },
    { title: req.body.title, content: req.body.content },
    { new: true }
  );
  if (!note) return res.status(404).json({ message: 'Note not found' });
  res.json(note);
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  const note = await Note.findOneAndDelete({ _id: req.params.id, tenantId: req.user!.tenantId });
  if (!note) return res.status(404).json({ message: 'Note not found' });
  res.json({ message: 'Note deleted successfully' });
});

export default router;
