import multer from "multer";

const storage = multer.memoryStorage();

const filtroArchivo = (req: any, file: Express.Multer.File, cb: any) => {
  const tiposPermitidos = /jpeg|jpg|png|webp/;
  const extensionValida = tiposPermitidos.test(file.originalname.toLowerCase());
  const mimeValido = tiposPermitidos.test(file.mimetype);

  if (extensionValida && mimeValido) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes (jpg, png, webp)"));
  }
};

export const upload = multer({
  storage,
  fileFilter: filtroArchivo,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB máximo
});