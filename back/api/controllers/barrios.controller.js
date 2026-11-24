import * as barrioService from "../../services/barrios.service.js"
import { responderError } from "./responder.js"

export async function getBarrios(req, res) {
    try {
        const barrios = await barrioService.getBarrios(req.filtros)
        res.status(200).json(barrios)
    } catch (error) {
        responderError(res, error)
    }
}

export async function getLineas(req, res) {
    try {
        const lineas = await barrioService.getLineasTransporte()
        res.status(200).json(lineas)
    } catch (error) {
        responderError(res, error)
    }
}

export async function getBarrioById(req, res) {
    try {
        const barrio = await barrioService.getBarrioById(req.params.id)
        res.status(200).json(barrio)
    } catch (error) {
        responderError(res, error)
    }
}

export async function saveBarrio(req, res) {
    try {
        const barrio = await barrioService.saveBarrio(req.body)
        res.status(201).json(barrio)
    } catch (error) {
        responderError(res, error)
    }
}

export async function replaceBarrio(req, res) {
    try {
        const barrio = await barrioService.replaceBarrio(req.params.id, req.body)
        res.status(200).json(barrio)
    } catch (error) {
        responderError(res, error)
    }
}

export async function updateBarrio(req, res) {
    try {
        const barrio = await barrioService.updateBarrio(req.params.id, req.body)
        res.status(200).json(barrio)
    } catch (error) {
        responderError(res, error)
    }
}

export async function deleteBarrio(req, res) {
    try {
        const barrio = await barrioService.desactivarBarrio(req.params.id)
        res.status(200).json(barrio)
    } catch (error) {
        responderError(res, error)
    }
}

export async function activarBarrio(req, res) {
    try {
        const barrio = await barrioService.activarBarrio(req.params.id)
        res.status(200).json(barrio)
    } catch (error) {
        responderError(res, error)
    }
}
