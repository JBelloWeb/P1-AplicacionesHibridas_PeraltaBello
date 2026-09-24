import { MongoClient, ObjectId } from "mongodb"

const MONGO_URI = "mongodb+srv://juaniperalta_db_user:cIp6LGS9s1rRyrSt@cluster0.6jddqoh.mongodb.net/?appName=Cluster0"

const client = new MongoClient(MONGO_URI)
const db = client.db("barriopoli")

function escapeRegex(text) {
    return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

const ORDEN_MAP = {
    antiguedad: "antiguedad_anio",
    habitantes: "cantidad_habitantes",
    superficie: "superficie_km2"
}

export async function getBarrios(filtros = {}) {
    const filter = { eliminado: { $ne: true } }

    if (filtros?.comuna) filter.comuna = { $eq: parseInt(filtros.comuna) }
    if (filtros?.q) filter.nombre = { $regex: escapeRegex(filtros.q), $options: "i" }
    else if (filtros?.nombre) filter.nombre = { $regex: escapeRegex(filtros.nombre), $options: "i" }

    if (filtros?.linea) {
        filter.$or = [
            { "transporte_publico.colectivos_principales": filtros.linea },
            { "transporte_publico.trenes": filtros.linea }
        ]
    }

    let sort
    const campoOrden = ORDEN_MAP[filtros?.orden]
    if (campoOrden) sort = { [campoOrden]: -1 }

    let query = db.collection("barrios").find(filter)
    if (sort) query = query.sort(sort)
    const barrios = await query.toArray()
    return barrios
}

export async function getLineasTransporte() {
    const colectivos = await db.collection("barrios").aggregate([
        { $match: { eliminado: { $ne: true }, "transporte_publico.colectivos_principales": { $exists: true } } },
        { $unwind: "$transporte_publico.colectivos_principales" },
        { $group: { _id: "$transporte_publico.colectivos_principales" } },
        { $sort: { _id: 1 } }
    ]).toArray()

    const trenes = await db.collection("barrios").aggregate([
        { $match: { eliminado: { $ne: true }, "transporte_publico.trenes": { $exists: true } } },
        { $unwind: "$transporte_publico.trenes" },
        { $group: { _id: "$transporte_publico.trenes" } },
        { $sort: { _id: 1 } }
    ]).toArray()

    return {
        colectivos: colectivos.map(c => c._id),
        trenes: trenes.map(t => t._id)
    }
}

export async function getBarriosDesactivados() {
    const barrios = await db.collection("barrios").find({ eliminado: true }).toArray()
    return barrios
}

export async function getBarriosByComuna(comuna) {
    const barrios = await db.collection("barrios").find({
        comuna: parseInt(comuna),
        eliminado: { $ne: true }
    }).toArray()
    return barrios
}

export async function getBarriosByClienteId(clienteId) {
    const barrios = await db.collection("barrios").find({
        clienteId: new ObjectId(clienteId)
    }).toArray()
    return barrios
}

export async function getBarrioById(id) {
    const barrio = await db.collection("barrios").findOne({ _id: new ObjectId(id) })
    return barrio
}

export async function saveBarrio(barrio) {
    const result = await db.collection("barrios").insertOne(barrio)
    return { ...barrio, _id: result.insertedId }
}

export async function editBarrio(id, updates) {
    const existing = await getBarrioById(id)
    if (!existing) return null
    const merged = { ...existing, ...updates, _id: existing._id }
    await db.collection("barrios").replaceOne({ _id: existing._id }, merged)
    return merged
}

export async function updateBarrio(id, barrio) {
    await db.collection("barrios").updateOne(
        { _id: new ObjectId(id) }, { $set: barrio }
    )
    return barrio
}

export async function desactivarBarrio(id) {
    const barrio = await getBarrioById(id)
    await db.collection("barrios").updateOne(
        { _id: new ObjectId(id) }, { $set: { eliminado: true } }
    )
    return barrio
}

export async function activarBarrio(id) {
    const barrio = await getBarrioById(id)
    await db.collection("barrios").updateOne(
        { _id: new ObjectId(id) }, { $set: { eliminado: false } }
    )
    return barrio
}

export async function deleteBarrioFisico(id) {
    const result = await db.collection("barrios").deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount
}
