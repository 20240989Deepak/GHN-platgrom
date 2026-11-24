import express from "express";
import { Order, Booking } from "../models/models.js";
import { auth } from "../middleware.js";
import { io } from "../server.js";

const router = express.Router();

// Guest places order
router.post("/", auth(), async (req, res) => {
  const { roomNumber, items, payment } = req.body;

  // Charge to room only if guest has active check-in
  if (payment === "room") {
    const active = await Booking.findOne({ user: req.user.id, status: "checked-in" });
    if (!active)
      return res.status(400).json({ msg: "No active check-in. Charge to room not allowed" });
  }

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const order = await Order.create({
    user: req.user.id, roomNumber, items, total, payment,
  });
  io.emit("newOrder", order);
  res.json(order);
});

router.get("/my", auth(), async (req, res) =>
  res.json(await Order.find({ user: req.user.id }).sort({ createdAt: -1 }))
);

// Kitchen: all orders
router.get("/", auth(["chef", "admin"]), async (req, res) =>
  res.json(await Order.find().sort({ createdAt: -1 }))
);

// Kitchen updates status: Placed -> Cooking -> Dispatched -> Delivered
router.put("/:id/status", auth(["chef", "admin"]), async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id, { status: req.body.status }, { new: true }
  );
  io.emit("orderUpdated", order);
  res.json(order);
});

export default router;