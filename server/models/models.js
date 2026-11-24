import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["guest", "admin", "chef"], default: "guest" },
});

const roomSchema = new mongoose.Schema({
  number: { type: String, unique: true },
  type: String,
  price: Number,
  image: String,
});

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
  checkIn: Date,
  checkOut: Date,
  status: { type: String, default: "booked" },
});

const menuSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  image: String,
  inStock: { type: Boolean, default: true },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    roomNumber: String,
    items: [{ name: String, price: Number, qty: Number, image: String }],
    total: Number,
    payment: { type: String, default: "room" },
    status: { type: String, default: "Placed" },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
export const Room = mongoose.model("Room", roomSchema);
export const Booking = mongoose.model("Booking", bookingSchema);
export const MenuItem = mongoose.model("MenuItem", menuSchema);
export const Order = mongoose.model("Order", orderSchema);