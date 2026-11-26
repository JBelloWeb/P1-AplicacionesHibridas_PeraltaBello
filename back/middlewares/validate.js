function sinIndefinidos(valor) {
    if (Array.isArray(valor)) return valor.map(sinIndefinidos)
    if (valor && typeof valor === "object") {
        return Object.fromEntries(
            Object.entries(valor)
                .filter(([, v]) => v !== undefined)
                .map(([k, v]) => [k, sinIndefinidos(v)])
        )
    }
    return valor
}

function formatearErrores(error) {
    return error.issues.map((issue) => ({
        campo: issue.path.join("."),
        mensaje: issue.message
    }))
}

export function validate(schema) {
    return async (req, res, next) => {
        const resultado = await schema.safeParseAsync(req.body ?? {})
        if (!resultado.success) {
            return res.status(400).json({ message: "Datos inválidos", errores: formatearErrores(resultado.error) })
        }
        req.body = sinIndefinidos(resultado.data)
        next()
    }
}

export function validateQuery(schema) {
    return async (req, res, next) => {
        const resultado = await schema.safeParseAsync(req.query)
        if (!resultado.success) {
            return res.status(400).json({ message: "Filtros inválidos", errores: formatearErrores(resultado.error) })
        }
        req.filtros = resultado.data
        next()
    }
}
