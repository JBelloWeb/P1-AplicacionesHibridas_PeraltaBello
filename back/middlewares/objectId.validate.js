import { ObjectId } from "mongodb"

export function validateObjectId(...parametros) {
    return (req, res, next) => {
        const invalido = parametros.find((p) => !ObjectId.isValid(req.params[p] ?? ""))
        if (invalido) return res.status(400).json({ message: `El parámetro "${invalido}" no es un id válido` })
        next()
    }
}
