import jwt from "jsonwebtoken";
import User from "../models/User.js";
import "dotenv/config";

const protectRoute = async (req, res, next) => {
  try {
    // const token = req.header("Authorization").replace("Bearer", "");
    const token = req.header("Authorization")?.replace("Bearer ", "").trim();

    if (!token)
      return res
        .status(401)
        .json({ message: "No authentication token, access denied" });

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // find user
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(401).json({ message: "Token is not valid" });

    req.user = user;
    next();
  } catch (error) {
    console.log("Authentication error:", error.message);
    return res.status(401).json({ message: "Token is not valid" });
  }
};

export default protectRoute;
