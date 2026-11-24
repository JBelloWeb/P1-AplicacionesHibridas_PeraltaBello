import { z } from "zod"

export const listaDeTextos = z
    .union([
        z.array(z.string().trim()),
        z.string().transform((texto) => texto.split(","))
    ])
    .transform((items) => items.map((item) => item.trim()).filter(Boolean))

export const urlOpcional = (mensaje) =>
    z.preprocess((valor) => (valor === "" ? undefined : valor), z.url(mensaje).optional())
