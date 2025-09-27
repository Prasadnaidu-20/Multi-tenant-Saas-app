import { Router } from 'express';
import Note from '../models/Note.js';
import User from '../models/User.js';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware.js';
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

router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Get user details to check plan
    const user = await User.findById(req.user!.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check plan limits
    if (user.role === 'Member') { // Free plan
      const noteCount = await Note.countDocuments({ 
        tenantId: req.user!.tenantId,
        createdBy: req.user!.id 
      });
      
      if (noteCount >= 3) {
        res.status(403).json({ 
          message: 'Free plan limit reached. You can only create 3 notes. Upgrade to Pro for unlimited notes.',
          plan: 'Free',
          limit: 3,
          current: noteCount
        });
        return;
      }
    }

    const newNote = new Note({
      title: req.body.title,
      content: req.body.content,
      tenantId: req.user!.tenantId,
      createdBy: req.user!.id,
    });
    
    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Get user details to check plan
    const user = await User.findById(req.user!.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const notes = await Note.find({ 
      tenantId: req.user!.tenantId
    }).populate('createdBy', 'name email');
    
    // Count only user's own notes for plan limits
    const userNoteCount = await Note.countDocuments({ 
      tenantId: req.user!.tenantId,
      createdBy: req.user!.id 
    });
    const plan = user.role === 'Member' ? 'Free' : 'Pro';
    const limit = user.role === 'Member' ? 3 : 'unlimited';
    
    res.json({
      notes,
      planInfo: {
        plan,
        limit,
        current: userNoteCount,
        remaining: user.role === 'Member' ? Math.max(0, 3 - userNoteCount) : 'unlimited'
      }
    });
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const note = await Note.findOne({ _id: req.params.id, tenantId: req.user!.tenantId });
    if (!note) {
      res.status(404).json({ message: 'Note not found' });
      return;
    }
    res.json(note);
  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.user!.tenantId },
      { title: req.body.title, content: req.body.content },
      { new: true }
    );
    if (!note) {
      res.status(404).json({ message: 'Note not found' });
      return;
    }
    res.json(note);
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, tenantId: req.user!.tenantId });
    if (!note) {
      res.status(404).json({ message: 'Note not found' });
      return;
    }
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
