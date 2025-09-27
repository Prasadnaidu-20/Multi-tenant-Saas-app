import { Router, Request, Response } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Invitation from "../models/Invitation";
import { authMiddleware, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

// POST /admin/invite - Send invitation to user (Admin only)
router.post("/invite", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    // Check if current user is admin
    if (req.user!.role !== 'Admin') {
      return res.status(403).json({ msg: "Only admins can send invitations" });
    }

    const { email, role = 'Member' } = req.body;
    const tenantId = req.user!.tenantId;
    const invitedBy = req.user!.id;

    // Validate email
    if (!email || !email.includes('@')) {
      return res.status(400).json({ msg: "Valid email is required" });
    }

    // Check if user already exists in this tenant
    const existingUser = await User.findOne({ email, tenantId });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists in this tenant" });
    }

    // Check if there's already a pending invitation
    const existingInvitation = await Invitation.findOne({ 
      email, 
      tenantId, 
      status: 'pending' 
    });
    if (existingInvitation) {
      return res.status(400).json({ msg: "Invitation already sent to this email" });
    }

    // Generate invitation token
    const token = crypto.randomBytes(32).toString('hex');
    
    // Set expiration (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Create invitation
    const invitation = new Invitation({
      email,
      tenantId,
      invitedBy,
      role,
      token,
      expiresAt
    });

    await invitation.save();

    // In a real application, you would send an email here
    // For now, we'll just return the invitation link
    const invitationLink = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/accept-invitation?token=${token}`;
    
    console.log(`📧 Invitation sent to ${email}: ${invitationLink}`);

    res.status(201).json({
      msg: "Invitation sent successfully",
      invitation: {
        email,
        role,
        expiresAt,
        invitationLink // In production, don't return this in the response
      }
    });
  } catch (err) {
    console.error("❌ Invitation error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// GET /admin/invitations - Get all invitations for tenant (Admin only)
router.get("/invitations", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    // Check if current user is admin
    if (req.user!.role !== 'Admin') {
      return res.status(403).json({ msg: "Only admins can view invitations" });
    }

    const invitations = await Invitation.find({ tenantId: req.user!.tenantId })
      .populate('invitedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      invitations,
      count: invitations.length
    });
  } catch (err) {
    console.error("❌ Get invitations error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// GET /admin/invite/accept/:token - Accept invitation
router.get("/invite/accept/:token", async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    // Find invitation
    const invitation = await Invitation.findOne({ 
      token, 
      status: 'pending' 
    }).populate('invitedBy', 'name email');

    if (!invitation) {
      return res.status(404).json({ msg: "Invalid or expired invitation" });
    }

    // Check if invitation is expired
    if (new Date() > invitation.expiresAt) {
      invitation.status = 'expired';
      await invitation.save();
      return res.status(400).json({ msg: "Invitation has expired" });
    }

    res.json({
      msg: "Invitation is valid",
      invitation: {
        email: invitation.email,
        tenantId: invitation.tenantId,
        role: invitation.role,
        invitedBy: invitation.invitedBy
      }
    });
  } catch (err) {
    console.error("❌ Accept invitation error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// POST /admin/invite/accept/:token - Complete invitation acceptance
router.post("/invite/accept/:token", async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { name, password } = req.body;

    // Find invitation
    const invitation = await Invitation.findOne({ 
      token, 
      status: 'pending' 
    });

    if (!invitation) {
      return res.status(404).json({ msg: "Invalid or expired invitation" });
    }

    // Check if invitation is expired
    if (new Date() > invitation.expiresAt) {
      invitation.status = 'expired';
      await invitation.save();
      return res.status(400).json({ msg: "Invitation has expired" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      email: invitation.email, 
      tenantId: invitation.tenantId 
    });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash password
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      name,
      email: invitation.email,
      password: hashedPassword,
      tenantId: invitation.tenantId,
      role: invitation.role
    });

    await newUser.save();

    // Mark invitation as accepted
    invitation.status = 'accepted';
    invitation.acceptedAt = new Date();
    await invitation.save();

    // Generate JWT token
    const jwtToken = jwt.sign(
      { id: newUser._id, tenantId: newUser.tenantId, role: newUser.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      msg: "Account created successfully",
      token: jwtToken,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        tenantId: newUser.tenantId,
        role: newUser.role
      }
    });
  } catch (err) {
    console.error("❌ Complete invitation error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
