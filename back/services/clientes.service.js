import { ObjectId } from "mongodb"
import { db } from "./db.js"

export async function getClientes() {
    const clientes = await db.collection("clientes").find().toArray()
    return clientes
}

export async function getClienteById(id) {
    const cliente = await db.collection("clientes").findOne({ _id: new ObjectId(id) })
    return cliente
}

export async function saveCliente(cliente) {
    const result = await db.collection("clientes").insertOne(cliente)
    return { ...cliente, _id: result.insertedId }
}

export async function getBarriosByClienteId(clienteId) {
    const barrios = await db.collection("barrios").find({
        clienteId: new ObjectId(clienteId)
    }).toArray()
    return barrios
}

export async function editCliente(id, updates) {
    const existing = await getClienteById(id)
    if (!existing) return null
    const merged = { ...existing, ...updates, _id: existing._id }
    await db.collection("clientes").replaceOne({ _id: existing._id }, merged)
    return merged
}

export async function asociarBarrio(clienteId, barrioId) {
    if (!ObjectId.isValid(clienteId) || !ObjectId.isValid(barrioId)) return null
    const cliente = await getClienteById(clienteId)
    if (!cliente) return null
    const result = await db.collection("barrios").updateOne(
        { _id: new ObjectId(barrioId) },
        { $set: { clienteId: new ObjectId(clienteId) } }
    )
    return result.matchedCount > 0
}

export async function desasociarBarrio(clienteId, barrioId) {
    if (!ObjectId.isValid(clienteId) || !ObjectId.isValid(barrioId)) return null
    const result = await db.collection("barrios").updateOne(
        { _id: new ObjectId(barrioId), clienteId: new ObjectId(clienteId) },
        { $unset: { clienteId: "" } }
    )
    return result.matchedCount > 0
}
