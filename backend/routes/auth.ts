import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";


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
      { id: user._id, tenantId: user.tenantId },
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
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
