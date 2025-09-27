import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { authMiddleware, AuthRequest } from "../middleware/authMiddleware";


const router = Router();

// GET /auth/login - Information about the login endpoint
router.get("/login", (req: Request, res: Response) => {
  res.json({
    message: "Login endpoint - Use POST method to authenticate",
    method: "POST",
    endpoint: "/api/auth/login",
    requiredFields: {
      email: "string (required)",
      password: "string (required)", 
      tenantId: "string (required)"
    },
    example: {
      email: "admin@acme.test",
      password: "password",
      tenantId: "Acme"
    },
    response: {
      token: "JWT token",
      user: {
        id: "user ID",
        name: "user name",
        email: "user email",
        tenantId: "tenant ID"
      }
    },
    note: "This endpoint requires POST method with JSON body. Use the frontend at http://localhost:3000/login for user interface."
  });
});

// POST /auth/login
router.post("/login", async (req: Request, res: Response) => {
  const { email, password, tenantId } = req.body;

  try {
    // 1️⃣ Find user by email AND tenantId
    const user = await User.findOne({ email, tenantId });
    if (!user) {
      return res.status(400).json({ msg: "User not found for this tenant" });
    }

    // 2️⃣ Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    // 3️⃣ Create JWT
    const token = jwt.sign(
      { id: user._id, tenantId: user.tenantId, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    // 4️⃣ Send response
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        tenantId: user.tenantId,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ==================== USER MANAGEMENT ENDPOINTS ====================

// POST /auth/register - Register a new user (Admin only)
router.post("/register", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    // Check if current user is admin
    if (req.user!.role !== 'Admin') {
      return res.status(403).json({ msg: "Only admins can register new users" });
    }

    const { name, email, password, role = 'Member' } = req.body;
    const tenantId = req.user!.tenantId; // Users can only be created in the same tenant

    // Check if user already exists
    const existingUser = await User.findOne({ email, tenantId });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists in this tenant" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      tenantId,
      role
    });

    await newUser.save();

    // Return user without password
    res.status(201).json({
      msg: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        tenantId: newUser.tenantId,
        role: newUser.role
      }
    });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// GET /auth/users - Get all users in tenant (Admin only)
router.get("/users", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    // Check if current user is admin
    if (req.user!.role !== 'Admin') {
      return res.status(403).json({ msg: "Only admins can view users" });
    }

    const users = await User.find({ tenantId: req.user!.tenantId })
      .select('-password') // Exclude password field
      .sort({ createdAt: -1 });

    res.json({
      users,
      count: users.length
    });
  } catch (err) {
    console.error("❌ Get users error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// PUT /auth/users/:id - Update user (Admin only)
router.put("/users/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    // Check if current user is admin
    if (req.user!.role !== 'Admin') {
      return res.status(403).json({ msg: "Only admins can update users" });
    }

    const { name, email, role } = req.body;
    const userId = req.params.id;

    // Check if user exists in same tenant
    const user = await User.findOne({ _id: userId, tenantId: req.user!.tenantId });
    if (!user) {
      return res.status(404).json({ msg: "User not found in this tenant" });
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, role },
      { new: true, select: '-password' }
    );

    res.json({
      msg: "User updated successfully",
      user: updatedUser
    });
  } catch (err) {
    console.error("❌ Update user error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// DELETE /auth/users/:id - Delete user (Admin only)
router.delete("/users/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    // Check if current user is admin
    if (req.user!.role !== 'Admin') {
      return res.status(403).json({ msg: "Only admins can delete users" });
    }

    const userId = req.params.id;

    // Prevent admin from deleting themselves
    if (userId === req.user!.id) {
      return res.status(400).json({ msg: "Cannot delete your own account" });
    }

    // Check if user exists in same tenant
    const user = await User.findOne({ _id: userId, tenantId: req.user!.tenantId });
    if (!user) {
      return res.status(404).json({ msg: "User not found in this tenant" });
    }

    await User.findByIdAndDelete(userId);

    res.json({ msg: "User deleted successfully" });
  } catch (err) {
    console.error("❌ Delete user error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
