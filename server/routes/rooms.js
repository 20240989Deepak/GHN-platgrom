import express from "express";
import { Room, Booking } from "../models/models.js";
import { auth } from "../middleware.js";

const router = express.Router();

router.get("/", async (req, res) => res.json(await Room.find()));

router.post("/", auth(["admin"]), async (req, res) =>
  res.json(await Room.create(req.body))
);

// Booking with double-booking check
router.post("/book", auth(), async (req, res) => {
  const { roomId, checkIn, checkOut } = req.body;
  const clash = await Booking.findOne({
    room: roomId,
    status: { $ne: "cancelled" },
    checkIn: { $lt: new Date(checkOut) },
    checkOut: { $gt: new Date(checkIn) },
  });
  if (clash) return res.status(400).json({ msg: "Room already booked for these dates" });
  const booking = await Booking.create({
    user: req.user.id, room: roomId, checkIn, checkOut,
  });
  res.json(booking);
});

router.get("/my-bookings", auth(), async (req, res) =>
  res.json(await Booking.find({ user: req.user.id }).populate("room"))
);

// Front desk: check-in / check-out
router.put("/booking/:id/:action", auth(["admin"]), async (req, res) => {
  const map = { checkin: "checked-in", checkout: "checked-out" };
  const b = await Booking.findByIdAndUpdate(
    req.params.id, { status: map[req.params.action] }, { new: true }
  );
  res.json(b);
});

export default router;