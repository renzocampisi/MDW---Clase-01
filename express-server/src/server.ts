import express, { Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import { connectDB } from "./config/db";

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

async function main(): Promise<void> {
  await connectDB();
  console.log("Mongo conectado");

  app.listen(PORT, () => {
    console.log(`escuchando en el puerto ${PORT}`);
  });
}

main().catch((error) => {
  console.error("No se pudo iniciar el servidor:", error);
  process.exit(1);
});