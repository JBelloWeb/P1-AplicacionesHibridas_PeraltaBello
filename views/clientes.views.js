import { createPage, createClienteListPage, createClienteFormPage, createClienteFormEditPage, createClienteDetailPage } from "../page/utils.js"

export function page404() {
    return createPage("404", "<p class='empty-state'>Pagina no encontrada</p>")
}

export function clienteList(clientes) {
    return createPage("Clientes", createClienteListPage(clientes), "clientes")
}

export function newClienteForm() {
    return createPage("Nuevo Cliente", createClienteFormPage(), "clientes")
}

export function editClienteForm(cliente) {
    return createPage("Editar Cliente", createClienteFormEditPage(cliente), "clientes")
}

export function clienteDetail(cliente, barrios, todosLosBarrios) {
    return createPage(cliente.nombre, createClienteDetailPage(cliente, barrios, todosLosBarrios), "clientes")
}
