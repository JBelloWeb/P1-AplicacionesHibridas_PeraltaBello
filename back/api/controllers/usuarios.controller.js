import * as usuarioService from "../../services/usuarios.service.js"
import { responderError } from "./responder.js"

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
