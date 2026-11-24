import { z } from "zod"
import { listaDeTextos, urlOpcional } from "./comunes.js"

const ANIO_ACTUAL = new Date().getFullYear()

export const barrioSchema = z.object({
    nombre: z
        .string("El nombre es obligatorio")
        .trim()
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(60, "El nombre puede tener hasta 60 caracteres"),
    comuna: z
        .number("La comuna es obligatoria")
        .int("La comuna debe ser un número entero")
        .min(1, "La comuna va de 1 a 15")
        .max(15, "La comuna va de 1 a 15"),
    img: urlOpcional("La imagen debe ser una URL válida"),
    cantidad_habitantes: z
        .number("Los habitantes deben ser un número")
        .int("Los habitantes deben ser un número entero")
        .nonnegative("Los habitantes no pueden ser negativos")
        .optional(),
    superficie_km2: z
        .number("La superficie debe ser un número")
        .positive("La superficie debe ser mayor a 0")
        .optional(),
    antiguedad_anio: z
        .number("El año debe ser un número")
        .int("El año debe ser un número entero")
        .min(1536, "El año no puede ser anterior a la fundación de Buenos Aires (1536)")
        .max(ANIO_ACTUAL, `El año no puede ser posterior a ${ANIO_ACTUAL}`)
        .optional(),
    edificios_emblematicos: listaDeTextos.optional(),
    transporte_publico: z
        .object({
            subtes: listaDeTextos.optional(),
            trenes: listaDeTextos.optional(),
            colectivos_principales: listaDeTextos.optional()
        })
        .optional()
})

// PATCH: los mismos campos, todos opcionales, pero al menos uno.
export const barrioParcialSchema = barrioSchema
    .partial()
    .refine((datos) => Object.values(datos).some((v) => v !== undefined), {
        error: "No se envió ningún campo para actualizar"
    })

export const ORDENES = ["antiguedad", "habitantes", "superficie"]

export const filtrosBarrioSchema = z.object({
    q: z.string().trim().max(60, "La búsqueda puede tener hasta 60 caracteres").optional(),
    comuna: z.coerce.number().int().min(1, "La comuna va de 1 a 15").max(15, "La comuna va de 1 a 15").optional(),
    linea: z.string().trim().max(60).optional(),
    orden: z.enum(ORDENES, `El orden debe ser: ${ORDENES.join(", ")}`).optional(),
    eliminado: z.enum(["true", "false"], 'eliminado debe ser "true" o "false"').optional()
})
