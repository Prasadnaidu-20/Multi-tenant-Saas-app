import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User";

dotenv.config();

const createBulkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("✅ MongoDB connected");

    const usersToCreate = [
      { name: "Sarah Wilson", email: "sarah@acme.test", role: "Member" },
      { name: "Tom Brown", email: "tom@acme.test", role: "Member" },
      { name: "Lisa Davis", email: "lisa@acme.test", role: "Member" },
      { name: "Admin Sarah", email: "admin2@acme.test", role: "Admin" },
    ];

    const tenantId = "Acme";
    const defaultPassword = "password123";

    console.log(`🔄 Creating ${usersToCreate.length} users...`);

    for (const userData of usersToCreate) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: userData.email, tenantId });
        
        if (existingUser) {
          console.log(`⚠️ User already exists: ${userData.name} (${userData.email})`);
          continue;
        }

        const hashedPassword = await bcrypt.hash(defaultPassword, 10);
        
        const user = new User({
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          tenantId,
          role: userData.role
        });
        
        await user.save();
        console.log(`✅ Created: ${user.name} (${user.email}) - ${user.role}`);
        
      } catch (error) {
        console.error(`❌ Error creating ${userData.email}:`, error);
      }
    }

    // Show final count
    const totalUsers = await User.countDocuments({ tenantId });
    console.log(`\n📊 Total users in ${tenantId}: ${totalUsers}`);
    
    console.log("\n🔑 All users have password: password123");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

createBulkUsers();
