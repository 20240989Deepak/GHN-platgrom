import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { User, Room, MenuItem } from "./models/models.js";

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);

await User.deleteMany();
await Room.deleteMany();
await MenuItem.deleteMany();

const pass = await bcrypt.hash("123456", 10);
await User.insertMany([
  { name: "Admin", email: "admin@ghn.com", password: pass, role: "admin" },
  { name: "Chef", email: "chef@ghn.com", password: pass, role: "chef" },
  { name: "Guest", email: "guest@ghn.com", password: pass, role: "guest" },
]);

await Room.insertMany([
  { number: "101", type: "Standard", price: 2500, image: "https://picsum.photos/seed/r101/400/250" },
  { number: "102", type: "Deluxe", price: 4000, image: "https://picsum.photos/seed/r102/400/250" },
  { number: "201", type: "Executive Suite", price: 7000, image: "https://picsum.photos/seed/r201/400/250" },
  { number: "301", type: "Penthouse", price: 12000, image: "https://picsum.photos/seed/r301/400/250" },
]);

await MenuItem.insertMany([
  { name: "Paneer Butter Masala", price: 280, category: "Main Course", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&h=300&fit=crop" },
  { name: "Veg Biryani", price: 220, category: "Main Course", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&h=300&fit=crop" },
  { name: "Masala Dosa", price: 150, category: "Breakfast", image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=300&h=300&fit=crop" },
  { name: "Club Sandwich", price: 180, category: "Snacks", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&h=300&fit=crop" },
  { name: "Cold Coffee", price: 120, category: "Beverages", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=300&fit=crop" },
  { name: "Gulab Jamun", price: 90, category: "Dessert", image: "https://images.unsplash.com/photo-1666190092689-e3968aa0c32c?w=300&h=300&fit=crop" },
]);

console.log("Seed done");
process.exit();