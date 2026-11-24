import * as clienteService from "../../services/clientes.service.js"

export async function getClientes(req, res) {
    try {
        const clientes = await clienteService.getClientes()
        res.status(200).json(clientes)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export async function saveCliente(req, res) {
    try {
        const body = req.body || {}
        const data = {}
        if (typeof body.nombre === "string" && body.nombre.trim()) data.nombre = body.nombre.trim()
        if (typeof body.foto === "string") data.foto = body.foto
        if (typeof body.descripcion === "string") data.descripcion = body.descripcion
        if (!data.nombre) return res.status(400).json({ message: "El campo nombre es requerido" })
        const cliente = await clienteService.saveCliente(data)
        res.status(201).json(cliente)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export async function getBarriosByClienteId(req, res) {
    try {
        const id = req.params.id
        const barrios = await clienteService.getBarriosByClienteId(id)
        res.status(200).json(barrios)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
