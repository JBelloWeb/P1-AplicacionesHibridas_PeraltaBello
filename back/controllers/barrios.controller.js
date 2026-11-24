import * as barrioService from "../services/barrios.service.js"
import * as barrioView from "../views/barrios.views.js"

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
    return data
}

export async function getBarrios(req, res) {
    try {
        const filtros = req.query
        const [barrios, lineas] = await Promise.all([
            barrioService.getBarrios(filtros),
            barrioService.getLineasTransporte()
        ])
        res.send(barrioView.barrioList(barrios, filtros, lineas))
    } catch (error) {
        res.send(barrioView.page404())
    }
}

export async function getBarriosByComuna(req, res) {
    try {
        const comuna = req.params.comuna
        const filtros = { ...req.query, comuna }
        const [barrios, lineas] = await Promise.all([
            barrioService.getBarrios(filtros),
            barrioService.getLineasTransporte()
        ])
        res.send(barrioView.barrioListByComuna(barrios, comuna, filtros, lineas))
    } catch (error) {
        res.send(barrioView.page404())
    }
}

export async function getBarriosDesactivados(req, res) {
    try {
        const barrios = await barrioService.getBarriosDesactivados()
        res.send(barrioView.barrioListDesactivados(barrios))
    } catch (error) {
        res.send(barrioView.page404())
    }
}

export async function getBarrioById(req, res) {
    try {
        const id = req.params?.id
        const barrio = await barrioService.getBarrioById(id)
        res.send(barrioView.barrio(barrio))
    } catch (error) {
        res.send(barrioView.page404())
    }
}

export function newBarrioForm(req, res) {
    try {
        res.send(barrioView.newBarrioForm())
    } catch (error) {
        res.send(barrioView.page404())
    }
}

export async function editBarrioForm(req, res) {
    try {
        const id = req.params?.id
        const barrio = await barrioService.getBarrioById(id)
        res.send(barrioView.editBarrioForm(barrio))
    } catch (error) {
        res.send(barrioView.page404())
    }
}

export async function saveBarrio(req, res) {
    try {
        const data = mapBarrioBody(req.body)
        if (!data.nombre) return res.redirect("/barrios/nuevo")
        const barrio = await barrioService.saveBarrio(data)
        res.send(barrioView.barrio(barrio))
    } catch (error) {
        res.send(barrioView.page404())
    }
}

export async function editBarrio(req, res) {
    try {
        const id = req.params?.id
        const data = mapBarrioBody(req.body)
        if (!data.nombre) return res.redirect(`/barrios/editar/${id}`)
        const barrio = await barrioService.editBarrio(id, data)
        if (!barrio) return res.send(barrioView.page404())
        res.send(barrioView.barrio(barrio))
    } catch (error) {
        res.send(barrioView.page404())
    }
}

export async function desactivarBarrioForm(req, res) {
    try {
        const id = req.params?.id
        const barrio = await barrioService.getBarrioById(id)
        res.send(barrioView.createDetailDesactivarPage(barrio))
    } catch (error) {
        res.send(barrioView.page404())
    }
}

export async function desactivarBarrio(req, res) {
    try {
        const id = req.params?.id
        await barrioService.desactivarBarrio(id)
        res.redirect("/barrios")
    } catch (error) {
        res.send(barrioView.page404())
    }
}

export async function activarBarrio(req, res) {
    try {
        const id = req.params?.id
        await barrioService.activarBarrio(id)
        res.redirect("/barrios/desactivados")
    } catch (error) {
        res.send(barrioView.page404())
    }
}
