import * as clienteService from "../../services/clientes.service.js"
import { responderError } from "./responder.js"

export async function getClientes(req, res) {
    try {
        const clientes = await clienteService.getClientes()
        res.status(200).json(clientes)
    } catch (error) {
        responderError(res, error)
    }
}

export async function getClienteById(req, res) {
    try {
        const cliente = await clienteService.getClienteById(req.params.id)
        res.status(200).json(cliente)
    } catch (error) {
        responderError(res, error)
    }
}

export async function saveCliente(req, res) {
    try {
        const cliente = await clienteService.saveCliente(req.body)
        res.status(201).json(cliente)
    } catch (error) {
        responderError(res, error)
    }
}

export async function replaceCliente(req, res) {
    try {
        const cliente = await clienteService.replaceCliente(req.params.id, req.body)
        res.status(200).json(cliente)
    } catch (error) {
        responderError(res, error)
    }
}

export async function updateCliente(req, res) {
    try {
        const cliente = await clienteService.updateCliente(req.params.id, req.body)
        res.status(200).json(cliente)
    } catch (error) {
        responderError(res, error)
    }
}

export async function deleteCliente(req, res) {
    try {
        const cliente = await clienteService.deleteCliente(req.params.id)
        res.status(200).json(cliente)
    } catch (error) {
        responderError(res, error)
    }
}

export async function getBarriosByClienteId(req, res) {
    try {
        const barrios = await clienteService.getBarriosByClienteId(req.params.id)
        res.status(200).json(barrios)
    } catch (error) {
        responderError(res, error)
    }
}

export async function asociarBarrio(req, res) {
    try {
        const barrio = await clienteService.asociarBarrio(req.params.id, req.params.barrioId)
        res.status(200).json(barrio)
    } catch (error) {
        responderError(res, error)
    }
}

export async function desasociarBarrio(req, res) {
    try {
        const barrio = await clienteService.desasociarBarrio(req.params.id, req.params.barrioId)
        res.status(200).json(barrio)
    } catch (error) {
        responderError(res, error)
    }
}
