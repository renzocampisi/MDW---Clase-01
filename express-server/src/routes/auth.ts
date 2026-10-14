import { Router } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { requireAuth, signToken } from "../middleware/auth";
import type { AuthedRequest } from "../middleware/auth";

export const authRouter = Router();

function publicUser(u: InstanceType<typeof User>) {
  return { id: String(u._id), name: u.name, email: u.email, role: u.role };
}

authRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body ?? {};
  if (!name || !email || !password || String(password).length < 6) {
    res.status(400).json({ message: "name, email y password (mín. 6 caracteres) son obligatorios" });
    return;
  }
  if (await User.exists({ email: String(email).toLowerCase() })) {
    res.status(409).json({ message: "El email ya está registrado" });
    return;
  }
  // El rol nunca se toma del body: todo registro público es "user".
  const user = await User.create({
    name,
    email,
    passwordHash: await bcrypt.hash(String(password), 10),
  });
  res.status(201).json({ token: signToken({ sub: String(user._id), role: user.role }), user: publicUser(user) });
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  const user = email ? await User.findOne({ email: String(email).toLowerCase() }) : null;
  if (!user || !(await bcrypt.compare(String(password ?? ""), user.passwordHash))) {
    res.status(401).json({ message: "Credenciales inválidas" });
    return;
  }
  res.json({ token: signToken({ sub: String(user._id), role: user.role }), user: publicUser(user) });
});

authRouter.get("/me", requireAuth, async (req: AuthedRequest, res) => {
  const user = await User.findById(req.auth?.sub);
  if (!user) {
    res.status(401).json({ message: "Usuario inexistente" });
    return;
  }
  res.json({ user: publicUser(user) });
});
