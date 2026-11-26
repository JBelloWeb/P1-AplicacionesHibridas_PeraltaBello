import { z } from "zod"
import { listaDeTextos, urlOpcional } from "./comunes.js"

const ANIO_ACTUAL = new Date().getFullYear()

const numOpcional = (schema) =>
    z.preprocess((v) => (v === "" || v === undefined ? undefined : v), schema.optional())

const listaOpcional = z.preprocess(
    (v) => (v === "" || v === undefined ? undefined : v),
    listaDeTextos.optional()
)

export const barrioSchema = z.object({
    nombre: z
        .string("El nombre es obligatorio")
        .trim()
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(60, "El nombre puede tener hasta 60 caracteres"),
    comuna: z.coerce
        .number("La comuna es obligatoria")
        .int("La comuna debe ser un número entero")
        .min(1, "La comuna va de 1 a 15")
        .max(15, "La comuna va de 1 a 15"),
    img: urlOpcional("La imagen debe ser una URL válida"),
    cantidad_habitantes: numOpcional(z.coerce.number("Los habitantes deben ser un número").int().nonnegative("Los habitantes no pueden ser negativos")),
    superficie_km2: numOpcional(z.coerce.number("La superficie debe ser un número").positive("La superficie debe ser mayor a 0")),
    antiguedad_anio: numOpcional(
        z.coerce
            .number("El año debe ser un número")
            .int()
            .min(1536, "El año no puede ser anterior a la fundación de Buenos Aires (1536)")
            .max(ANIO_ACTUAL, `El año no puede ser posterior a ${ANIO_ACTUAL}`)
    ),
    edificios_emblematicos: listaOpcional,
    transporte_publico: z
        .object({
            subtes: listaOpcional,
            trenes: listaOpcional,
            colectivos_principales: listaOpcional
        })
        .optional()
})

export const barrioParcialSchema = barrioSchema
    .partial()
    .refine((datos) => Object.values(datos).some((v) => v !== undefined), {
        error: "No se envió ningún campo para actualizar"
    })

export const ORDENES = ["antiguedad", "habitantes", "superficie"]
