import express from "express";
import { MenuItem } from "../models/models.js";
import { auth } from "../middleware.js";

const router = express.Router();

router.get("/", async (req, res) => res.json(await MenuItem.find()));

router.post("/", auth(["admin", "chef"]), async (req, res) =>
  res.json(await MenuItem.create(req.body))
);

router.put("/:id", auth(["admin", "chef"]), async (req, res) =>
  res.json(await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true }))
);

export default router;