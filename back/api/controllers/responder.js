import { HttpError } from "../../services/errors.js"

// Traduce cualquier error a una respuesta JSON. Los HttpError llevan su propio status;
// el resto es un 500 sin detalles internos.
export function responderError(res, error) {
    if (error instanceof HttpError) {
        return res.status(error.status).json({ message: error.message })
    }
    console.error(error)
    res.status(500).json({ message: "Error interno del servidor" })
}
