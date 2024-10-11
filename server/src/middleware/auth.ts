import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization as string;
  if (!auth) {
    res.status(401).json({ msg: "No auth token found" });
    return;
  }
  const tokens = (req.headers.authorization as string).split(" ");
  if (tokens.length !== 2) {
    res.status(401).json({ msg: "Invalid Auth token" });
    return;
  }
  const token = tokens[1] as string;
  const payload = verify(token, process.env.JWT_SECRET as string);
  if (payload !== process.env.JWT_PAYLOAD) {
    res.status(401).json({ msg: "Invalid Auth token" });
    return;
  }
  // ALL OK
  next();
};

export default authMiddleware;
