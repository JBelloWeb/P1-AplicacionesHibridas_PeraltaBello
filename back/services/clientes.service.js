import { ObjectId } from "mongodb"
import { db } from "./db.js"
import { noEncontrado } from "./errors.js"

const clientes = db.collection("clientes")
const barrios = db.collection("barrios")

// Lista con la cantidad de barrios activos asociados a cada cliente.
export async function getClientes() {
    return clientes
        .aggregate([
            {
                $lookup: {
                    from: "barrios",
                    localField: "_id",
                    foreignField: "clienteId",
                    pipeline: [{ $match: { eliminado: { $ne: true } } }, { $project: { _id: 1 } }],
                    as: "barrios"
                }
            },
            { $addFields: { cantidad_barrios: { $size: "$barrios" } } },
            { $project: { barrios: 0 } },
            { $sort: { nombre: 1 } }
        ])
        .toArray()
}

export async function getClienteById(id) {
    const cliente = await clientes.findOne({ _id: new ObjectId(id) })
    if (!cliente) throw noEncontrado("Cliente")
    return cliente
}

export async function saveCliente(datos) {
    const result = await clientes.insertOne(datos)
    return { ...datos, _id: result.insertedId }
}

export async function replaceCliente(id, datos) {
    const _id = new ObjectId(id)
    const result = await clientes.replaceOne({ _id }, datos)
    if (!result.matchedCount) throw noEncontrado("Cliente")
    return { _id, ...datos }
}

export async function updateCliente(id, datos) {
    const cliente = await clientes.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: datos },
        { returnDocument: "after" }
    )
    if (!cliente) throw noEncontrado("Cliente")
    return cliente
}

// Borra el cliente y libera los barrios que tenía asociados.
export async function deleteCliente(id) {
    const _id = new ObjectId(id)
    const cliente = await clientes.findOneAndDelete({ _id })
    if (!cliente) throw noEncontrado("Cliente")
    await barrios.updateMany({ clienteId: _id }, { $unset: { clienteId: "" } })
    return cliente
}

export async function getBarriosByClienteId(id) {
    await getClienteById(id)
    return barrios
        .find({ clienteId: new ObjectId(id), eliminado: { $ne: true } })
        .sort({ nombre: 1 })
        .toArray()
}

// Un barrio tiene como máximo un cliente: asociar lo reasigna.
export async function asociarBarrio(clienteId, barrioId) {
    await getClienteById(clienteId)
    const barrio = await barrios.findOneAndUpdate(
        { _id: new ObjectId(barrioId), eliminado: { $ne: true } },
        { $set: { clienteId: new ObjectId(clienteId) } },
        { returnDocument: "after" }
    )
    if (!barrio) throw noEncontrado("Barrio")
    return barrio
}

export async function desasociarBarrio(clienteId, barrioId) {
    const barrio = await barrios.findOneAndUpdate(
        { _id: new ObjectId(barrioId), clienteId: new ObjectId(clienteId) },
        { $unset: { clienteId: "" } },
        { returnDocument: "after" }
    )
    if (!barrio) throw noEncontrado("Barrio asociado a ese cliente")
    return barrio
}
