import "dotenv/config";
import express from "express";
import authRoutes from "./routes/auth";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Servidor de Scouts funcionando");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});