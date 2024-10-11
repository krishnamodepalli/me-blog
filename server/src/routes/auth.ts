import { authenticator, totp } from "otplib";
import { Router, Request, Response } from "express";
import { sign } from "jsonwebtoken";

import { client } from "../lib/db";

const router = Router();

// I've already stored the secret key manually in the database
// I use a primaryKey to map my secret key, i've stored the primaryKey in my .env
router.post("/verify", async (req: Request, res: Response) => {
  // get the verification code
  const code: string = req.body.code;

  const secret = (await client.get("TOTP_KEY")) as string;
  if (!secret) {
    res.status(404).json({ msg: "Cannot find TOTP key" });
    return;
  }
  authenticator.options = {
    digits: 8,
  };
  const success: boolean = authenticator.verify({ token: code, secret });
  if (success) {
    const token = sign(
      process.env.JWT_PAYLOAD as string,
      process.env.JWT_SECRET as string
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });
    res.status(200).json({ msg: "Successfully authorized", token });
  } else res.status(401).json({ msg: "Unauthorized" });
});

// updation of the secret code in the database is manual

export default router;
