import { ObjectId } from "mongodb"
import { db } from "./db.js"
import { noEncontrado } from "./errors.js"

const barrios = db.collection("barrios")
const clientes = db.collection("clientes")

const ACTIVO = { eliminado: { $ne: true } }

const ORDEN_MAP = {
    antiguedad: "antiguedad_anio",
    habitantes: "cantidad_habitantes",
    superficie: "superficie_km2"
}

function escapeRegex(text) {
    return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

// filtros ya validados por filtrosBarrioSchema: { q, comuna, linea, orden, eliminado }
export async function getBarrios(filtros = {}) {
    const filter = filtros.eliminado === "true" ? { eliminado: true } : { ...ACTIVO }

    if (filtros.comuna) filter.comuna = filtros.comuna
    if (filtros.q) filter.nombre = { $regex: escapeRegex(filtros.q), $options: "i" }
    if (filtros.linea) {
        filter.$or = [
            { "transporte_publico.subtes": filtros.linea },
            { "transporte_publico.trenes": filtros.linea },
            { "transporte_publico.colectivos_principales": filtros.linea }
        ]
    }

    const campoOrden = ORDEN_MAP[filtros.orden]
    const sort = campoOrden ? { [campoOrden]: -1 } : { nombre: 1 }

    return barrios.find(filter).sort(sort).toArray()
}

// Valores distintos de cada tipo de transporte, para armar los filtros del front.
export async function getLineasTransporte() {
    const [subtes, trenes, colectivos] = await Promise.all([
        barrios.distinct("transporte_publico.subtes", ACTIVO),
        barrios.distinct("transporte_publico.trenes", ACTIVO),
        barrios.distinct("transporte_publico.colectivos_principales", ACTIVO)
    ])
    const porNumero = (a, b) => a.localeCompare(b, "es", { numeric: true })
    return {
        subtes: subtes.sort(porNumero),
        trenes: trenes.sort(porNumero),
        colectivos: colectivos.sort(porNumero)
    }
}

// Devuelve el barrio con los datos básicos de su cliente asociado (si tiene).
export async function getBarrioById(id) {
    const barrio = await barrios.findOne({ _id: new ObjectId(id) })
    if (!barrio) throw noEncontrado("Barrio")
    if (barrio.clienteId) {
        barrio.cliente = await clientes.findOne({ _id: barrio.clienteId }, { projection: { nombre: 1, foto: 1 } })
    }
    return barrio
}

export async function saveBarrio(datos) {
    const result = await barrios.insertOne(datos)
    return { ...datos, _id: result.insertedId }
}

// PUT: reemplaza los datos del barrio. Se conservan el estado (eliminado)
// y la asociación con el cliente, que no forman parte del formulario.
export async function replaceBarrio(id, datos) {
    const _id = new ObjectId(id)
    const existente = await barrios.findOne({ _id })
    if (!existente) throw noEncontrado("Barrio")

    const reemplazo = { ...datos }
    if (existente.eliminado !== undefined) reemplazo.eliminado = existente.eliminado
    if (existente.clienteId) reemplazo.clienteId = existente.clienteId

    await barrios.replaceOne({ _id }, reemplazo)
    return { _id, ...reemplazo }
}

// PATCH: solo los campos enviados. El transporte se actualiza por clave
// ("transporte_publico.subtes") para no pisar las otras listas.
export async function updateBarrio(id, datos) {
    const { transporte_publico, ...resto } = datos
    const cambios = { ...resto }
    for (const [clave, valor] of Object.entries(transporte_publico ?? {})) {
        cambios[`transporte_publico.${clave}`] = valor
    }

    const barrio = await barrios.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: cambios },
        { returnDocument: "after" }
    )
    if (!barrio) throw noEncontrado("Barrio")
    return barrio
}

async function setEliminado(id, eliminado) {
    const barrio = await barrios.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { eliminado } },
        { returnDocument: "after" }
    )
    if (!barrio) throw noEncontrado("Barrio")
    return barrio
}

// Baja lógica: el barrio deja de listarse pero se puede reactivar.
export const desactivarBarrio = (id) => setEliminado(id, true)
export const activarBarrio = (id) => setEliminado(id, false)
