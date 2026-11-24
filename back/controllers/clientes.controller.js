import * as clienteService from "../services/clientes.service.js"
import * as barrioService from "../services/barrios.service.js"
import * as clienteView from "../views/clientes.views.js"

function mapClienteBody(body = {}) {
    const data = {}
    if (typeof body.nombre === "string" && body.nombre.trim()) data.nombre = body.nombre.trim()
    if (typeof body.foto === "string") data.foto = body.foto
    if (typeof body.descripcion === "string") data.descripcion = body.descripcion
    return data
}

export async function getClientes(req, res) {
    try {
        const clientes = await clienteService.getClientes()
        res.send(clienteView.clienteList(clientes))
    } catch (error) {
        res.send(clienteView.page404())
    }
}

export function newClienteForm(req, res) {
    try {
        res.send(clienteView.newClienteForm())
    } catch (error) {
        res.send(clienteView.page404())
    }
}

export async function saveCliente(req, res) {
    try {
        const data = mapClienteBody(req.body)
        if (!data.nombre) return res.redirect("/clientes/nuevo")
        const cliente = await clienteService.saveCliente(data)
        res.redirect(`/clientes/${cliente._id}`)
    } catch (error) {
        res.send(clienteView.page404())
    }
}

export async function editClienteForm(req, res) {
    try {
        const id = req.params?.id
        const cliente = await clienteService.getClienteById(id)
        if (!cliente) return res.send(clienteView.page404())
        res.send(clienteView.editClienteForm(cliente))
    } catch (error) {
        res.send(clienteView.page404())
    }
}

export async function editCliente(req, res) {
    try {
        const id = req.params?.id
        const data = mapClienteBody(req.body)
        if (!data.nombre) return res.redirect(`/clientes/editar/${id}`)
        const cliente = await clienteService.editCliente(id, data)
        if (!cliente) return res.send(clienteView.page404())
        res.redirect(`/clientes/${id}`)
    } catch (error) {
        res.send(clienteView.page404())
    }
}

export async function getClienteById(req, res) {
    try {
        const id = req.params?.id
        const [cliente, barrios, todosLosBarrios] = await Promise.all([
            clienteService.getClienteById(id),
            clienteService.getBarriosByClienteId(id),
            barrioService.getBarrios({})
        ])
        if (!cliente) return res.send(clienteView.page404())
        res.send(clienteView.clienteDetail(cliente, barrios, todosLosBarrios))
    } catch (error) {
        res.send(clienteView.page404())
    }
}

export async function asociarBarrio(req, res) {
    try {
        const id = req.params?.id
        const barrioId = req.body?.barrioId
        if (barrioId) await clienteService.asociarBarrio(id, barrioId)
        res.redirect(`/clientes/${id}`)
    } catch (error) {
        res.send(clienteView.page404())
    }
}

export async function desasociarBarrio(req, res) {
    try {
        const id = req.params?.id
        const barrioId = req.body?.barrioId
        if (barrioId) await clienteService.desasociarBarrio(id, barrioId)
        res.redirect(`/clientes/${id}`)
    } catch (error) {
        res.send(clienteView.page404())
    }
}
