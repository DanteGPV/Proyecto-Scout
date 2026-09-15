// src/utils/validarEdadRama.ts
import { PrismaClient } from "@prisma/client";
import { calcularEdad } from "./edad";

const prisma = new PrismaClient();

export async function validarEdadParaRama(
  id_rama: number,
  fecha_nacimiento: Date
): Promise<string | null> {
  const rama = await prisma.rama.findUnique({
    where: { id: id_rama },
    select: { nombre: true, edad_minima: true, edad_maxima: true },
  });

  if (!rama) {
    return "La rama especificada no existe";
  }

  const edad = calcularEdad(fecha_nacimiento);

  if (edad < rama.edad_minima) {
    return `La edad mínima para ${rama.nombre} es ${rama.edad_minima} años`;
  }

  if (edad > rama.edad_maxima) {
    return `La edad máxima para ${rama.nombre} es ${rama.edad_maxima} años `;
  }

  return null; // sin errores, todo bien
}