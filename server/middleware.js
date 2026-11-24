import jwt from "jsonwebtoken";

export const auth = (roles = []) => (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    if (roles.length && !roles.includes(data.role))
      return res.status(403).json({ msg: "Access denied" });
    req.user = data;
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
};