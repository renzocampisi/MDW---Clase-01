import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "./config/db";
import { User } from "./models/User";

// Crea (o actualiza) un usuario admin: npm run seed:admin
async function main(): Promise<void> {
  await connectDB();
  const email = (process.env.ADMIN_EMAIL ?? "admin@example.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "admin123";
  await User.findOneAndUpdate(
    { email },
    { name: "Admin", email, passwordHash: await bcrypt.hash(password, 10), role: "admin" },
    { upsert: true },
  );
  console.log(`Admin listo: ${email}`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
