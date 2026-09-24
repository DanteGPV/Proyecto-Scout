import cloudinary from "../config/cloudinary";

export function subirImagenACloudinary(buffer: Buffer, carpeta: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: carpeta,
        transformation: [{ width: 500, height: 500, crop: "limit" }],
      },
      (error, resultado) => {
        if (error || !resultado) {
          return reject(error);
        }
        resolve(resultado.secure_url);
      }
    );

    stream.end(buffer);
  });
}