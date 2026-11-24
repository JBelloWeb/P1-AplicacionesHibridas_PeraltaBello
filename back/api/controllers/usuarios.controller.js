import * as usuarioService from "../../services/usuarios.service.js"

function responderError(res, error) {
    if (error instanceof usuarioService.AuthError) {
        return res.status(error.status).json({ message: error.message })
    }
    res.status(500).json({ message: "Error interno del servidor" })
}

export async function registro(req, res) {
    try {
        const usuario = await usuarioService.registrar(req.body)
        res.status(201).json(usuario)
    } catch (error) {
        responderError(res, error)
    }
}

export async function login(req, res) {
    try {
        const sesion = await usuarioService.login(req.body)
        res.status(200).json(sesion)
    } catch (error) {
        responderError(res, error)
    }
}

export async function getUsuarios(req, res) {
    try {
        const usuarios = await usuarioService.getUsuarios()
        res.status(200).json(usuarios)
    } catch (error) {
        responderError(res, error)
    }
}
