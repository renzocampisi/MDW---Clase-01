import express, { Request, Response } from "express";
import "dotenv/config";
import cors from "cors";

const app = express();
const PORT: number = Number(process.env.PORT) || 3000;

app.use(cors({ origin: process.env.CORS_ORIGIN ?? "http://localhost:5173" }));
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("hola");
});

app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    uptimeSeconds: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`escuchando en el puerto ${PORT}`);
});