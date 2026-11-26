import { HttpError } from "../../services/errors.js"

export function responderError(res, error) {
    if (error instanceof HttpError) {
        return res.status(error.status).json({ message: error.message })
    }
    console.error(error)
    res.status(500).json({ message: "Error interno del servidor" })
}
