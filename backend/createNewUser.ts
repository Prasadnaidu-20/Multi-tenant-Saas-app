import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User";

dotenv.config();

const createNewUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("✅ MongoDB connected");

    // Get user details from command line arguments or use defaults
    const args = process.argv.slice(2);
    const name = args[0] || "New User";
    const email = args[1] || "newuser@acme.test";
    const password = args[2] || "password123";
    const tenantId = args[3] || "Acme";
    const role = args[4] || "Member";

    // Check if user already exists
    const existingUser = await User.findOne({ email, tenantId });
    if (existingUser) {
      console.log(`❌ User already exists: ${email} in tenant ${tenantId}`);
      process.exit(1);
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
    console.log(`✅ User created successfully:`);
    console.log(`   Name: ${newUser.name}`);
    console.log(`   Email: ${newUser.email}`);
    console.log(`   Tenant: ${newUser.tenantId}`);
    console.log(`   Role: ${newUser.role}`);
    console.log(`   Password: ${password}`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating user:", err);
    process.exit(1);
  }
};

createNewUser();
