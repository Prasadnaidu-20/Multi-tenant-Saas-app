import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User";

dotenv.config();


const createUser = async () => {
  try {
    // 1️⃣ Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("✅ MongoDB connected");

    // 2️⃣ User data
    const userData = {
      name: "Admin Acme",
      email: "admin@acme.test",
      password: "password",
      tenantId: "Acme",
    };

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // 4️⃣ Create user
    const user = new User({ ...userData, password: hashedPassword });
    await user.save();

    console.log("✅ User created:", user);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating user:", err);
    process.exit(1);
  }
};

createUser();
