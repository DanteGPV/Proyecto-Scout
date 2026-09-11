import "dotenv/config";
import express from "express";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/auth";
import miembrosRoutes from "./routes/miembros";
import organismosRoutes from "./routes/organismos";
import ramasRoutes from "./routes/ramas";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/miembros", miembrosRoutes);
app.use("/ramas", ramasRoutes);
app.use("/organismos", organismosRoutes);

app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Servidor de Scouts funcionando");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});