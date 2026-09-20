import bcrypt from "bcrypt";

export async function hashearPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function validarFortalezaPassword(password: string): string | null {
  if (password.length < 8) {
    return "La contraseña debe tener al menos 8 caracteres";
  }
  if (!/[A-Z]/.test(password)) {
    return "La contraseña debe tener al menos una letra mayúscula";
  }
  if (!/[a-z]/.test(password)) {
    return "La contraseña debe tener al menos una letra minúscula";
  }
  if (!/[0-9]/.test(password)) {
    return "La contraseña debe tener al menos un número";
  }
  return null; // válida
}

export function calcularFortalezaPassword(password: string): "debil" | "media" | "fuerte" {
  let puntos = 0;
  if (password.length >= 8) puntos++;
  if (password.length >= 12) puntos++;
  if (/[A-Z]/.test(password)) puntos++;
  if (/[a-z]/.test(password)) puntos++;
  if (/[0-9]/.test(password)) puntos++;
  if (/[^A-Za-z0-9]/.test(password)) puntos++; // caracteres especiales

  
  if (puntos <= 2) return "debil";
  if (puntos <= 4) return "media";
  return "fuerte";
}

export function validarNuevaPassword(
  nuevaContraseña: string,
  confirmarContraseña: string
): string | null {
  if (nuevaContraseña !== confirmarContraseña) {
    return "Las contraseñas no coinciden";
  }

  const errorFortaleza = validarFortalezaPassword(nuevaContraseña);
  if (errorFortaleza) {
    return errorFortaleza;
  }

  return null;
}