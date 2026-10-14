import { Router } from "express";
import { authRouter } from "./auth";
import { requireAuth, requireRole } from "../middleware/auth";
import type { AuthedRequest } from "../middleware/auth";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);

// Pública: sin autenticación
apiRouter.get("/public", (_req, res) => {
  res.json({ message: "Ruta pública: accesible para cualquier usuario" });
});

// Privada: cualquier usuario autenticado
apiRouter.get("/private", requireAuth, (req: AuthedRequest, res) => {
  res.json({ message: "Ruta privada: estás autenticado", userId: req.auth?.sub, role: req.auth?.role });
});

// Privada + rol: solo admin
apiRouter.get("/admin", requireAuth, requireRole("admin"), (_req, res) => {
  res.json({ message: "Ruta de administrador: tenés el rol admin" });
});
