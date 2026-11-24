// Valida req.body con un schema de Zod. Si pasa, req.body queda con los datos
// ya limpios (trim, coerciones, campos desconocidos descartados).
export function validate(schema) {
    return async (req, res, next) => {
        const resultado = await schema.safeParseAsync(req.body ?? {})
        if (!resultado.success) {
            const errores = resultado.error.issues.map((issue) => ({
                campo: issue.path.join("."),
                mensaje: issue.message
            }))
            return res.status(400).json({ message: "Datos inválidos", errores })
        }
        req.body = resultado.data
        next()
    }
}
