import jwt from "jsonwebtoken"

export function validateToken(req, res, next) {
    const [tipo, token] = (req.headers.authorization ?? "").split(" ")
    if (tipo !== "Bearer" || !token) {
        return res.status(401).json({ message: "Falta el token de acceso" })
    }
    try {
        req.usuario = jwt.verify(token, process.env.JWT_SECRET)
        next()
    } catch {
        res.status(401).json({ message: "Token inválido o vencido" })
    }
}

export function validateRol(roles) {
    return (req, res, next) => {
        if (roles.includes(req.usuario?.rol)) return next()
        res.status(403).json({ message: "No tenés permisos para esta acción" })
    }
}
