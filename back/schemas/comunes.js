import { z } from "zod"

// Lista de textos: acepta un array o un string separado por comas ("Línea A, Línea B").
export const listaDeTextos = z
    .union([
        z.array(z.string().trim()),
        z.string().transform((texto) => texto.split(","))
    ])
    .transform((items) => items.map((item) => item.trim()).filter(Boolean))

// URL opcional: el string vacío de un input sin completar cuenta como "no enviado".
export const urlOpcional = (mensaje) =>
    z.preprocess((valor) => (valor === "" ? undefined : valor), z.url(mensaje).optional())
