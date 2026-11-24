import { ObjectId } from "mongodb"

// Verifica que los parámetros de la URL indicados sean ObjectId válidos
// (evita el 500 que tira new ObjectId() con un id mal formado).
export function validateObjectId(...parametros) {
    return (req, res, next) => {
        const invalido = parametros.find((p) => !ObjectId.isValid(req.params[p] ?? ""))
        if (invalido) return res.status(400).json({ message: `El parámetro "${invalido}" no es un id válido` })
        next()
    }
}
