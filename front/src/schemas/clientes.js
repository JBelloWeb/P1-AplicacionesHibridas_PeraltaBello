import { z } from "zod"
import { urlOpcional } from "./comunes.js"

export const clienteSchema = z.object({
    nombre: z
        .string("El nombre es obligatorio")
        .trim()
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(80, "El nombre puede tener hasta 80 caracteres"),
    foto: urlOpcional("La foto debe ser una URL válida"),
    descripcion: z
        .string("La descripción debe ser texto")
        .trim()
        .max(500, "La descripción puede tener hasta 500 caracteres")
        .optional()
})

export const clienteParcialSchema = clienteSchema
    .partial()
    .refine((datos) => Object.values(datos).some((v) => v !== undefined), {
        error: "No se envió ningún campo para actualizar"
    })
