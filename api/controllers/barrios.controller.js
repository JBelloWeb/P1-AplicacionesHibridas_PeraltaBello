import * as barrioService from "../../services/barrios.service.js"

function mapBarrioBody(body = {}) {
    const data = {}
    if (typeof body.nombre === "string" && body.nombre.trim()) data.nombre = body.nombre.trim()
    if (typeof body.img === "string") data.img = body.img
    for (const k of ["comuna", "cantidad_habitantes", "superficie_km2", "antiguedad_anio"]) {
        const v = body[k]
        if (v !== undefined && v !== null && v !== "") {
            const n = Number(v)
            if (!Number.isNaN(n)) data[k] = n
        }
    }
    if (typeof body.edificios_emblematicos === "string")
        data.edificios_emblematicos = body.edificios_emblematicos.split(",").map(s => s.trim()).filter(Boolean)
    if (body.transporte_publico && typeof body.transporte_publico === "object" && !Array.isArray(body.transporte_publico)) {
        const tp = {}
        for (const k of ["subtes", "trenes", "colectivos_principales"]) {
            const v = body.transporte_publico[k]
            if (typeof v === "string") tp[k] = v.split(",").map(s => s.trim()).filter(Boolean)
            else if (Array.isArray(v)) tp[k] = v.filter(x => typeof x === "string")
        }
        if (Object.keys(tp).length) data.transporte_publico = tp
    }
    return data
}

export async function getBarrios(req, res) {
    try {
        const filtros = req.query
        const barrios = await barrioService.getBarrios(filtros)
        res.status(200).json(barrios)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export async function getBarriosDesactivados(req, res) {
    try {
        const barrios = await barrioService.getBarriosDesactivados()
        res.status(200).json(barrios)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export async function getBarriosByComuna(req, res) {
    try {
        const comuna = req.params.comuna
        const barrios = await barrioService.getBarriosByComuna(comuna)
        res.status(200).json(barrios)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export async function getBarrioById(req, res) {
    try {
        const id = req.params.id
        const barrio = await barrioService.getBarrioById(id)
        if (!barrio) return res.status(404).json({ message: "Barrio no encontrado" })
        res.status(200).json(barrio)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export async function saveBarrio(req, res) {
    try {
        const data = mapBarrioBody(req.body)
        if (!data.nombre) return res.status(400).json({ message: "El campo nombre es requerido" })
        const barrio = await barrioService.saveBarrio(data)
        res.status(201).json(barrio)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export async function replaceBarrio(req, res) {
    try {
        const id = req.params.id
        const data = mapBarrioBody(req.body)
        if (!data.nombre) return res.status(400).json({ message: "El campo nombre es requerido" })
        const barrio = await barrioService.editBarrio(id, data)
        if (!barrio) return res.status(404).json({ message: "Barrio no encontrado" })
        res.status(202).json(barrio)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export async function updateBarrio(req, res) {
    try {
        const id = req.params.id
        const data = mapBarrioBody(req.body)
        if (!Object.keys(data).length) return res.status(400).json({ message: "No hay campos válidos para actualizar" })
        const barrio = await barrioService.updateBarrio(id, data)
        res.status(202).json(barrio)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export async function deleteBarrio(req, res) {
    try {
        const id = req.params.id
        const deleted = await barrioService.deleteBarrioFisico(id)
        if (!deleted) return res.status(404).json({ message: "Barrio no encontrado" })
        res.status(200).json({ message: "Barrio eliminado" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
