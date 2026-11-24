import { createDetailDesactivar, createDetailPage, createBarrioFormEditPage, createBarrioFormPage, createListPage, createListDesactivadosPage, createListByComunaPage, createPage, createMenuPage } from "../page/utils.js"

export function page404() {
    return createPage("404", "<p class='empty-state'>Pagina no encontrada</p>")
}

export function menuPage() {
    return createPage("Barrios de Buenos Aires", createMenuPage())
}

export function barrioList(barrios, filtros = {}, lineas = { colectivos: [], trenes: [] }) {
    return createPage("Todos los Barrios", createListPage(barrios, filtros, lineas), "barrios")
}

export function barrioListByComuna(barrios, comuna, filtros = {}, lineas = { colectivos: [], trenes: [] }) {
    return createPage("Barrios - Comuna " + comuna, createListByComunaPage(barrios, comuna, filtros, lineas), "barrios")
}

export function barrioListDesactivados(barrios) {
    return createPage("Barrios Desactivados", createListDesactivadosPage(barrios), "desactivados")
}

export function barrio(barrio) {
    return createPage(barrio.nombre, createDetailPage(barrio), "barrios")
}

export function newBarrioForm() {
    return createPage("Nuevo Barrio", createBarrioFormPage(), "nuevo")
}

export function editBarrioForm(barrio) {
    return createPage("Editar Barrio", createBarrioFormEditPage(barrio), "barrios")
}

export function createDetailDesactivarPage(barrio) {
    return createPage("Desactivar: " + barrio.nombre, createDetailDesactivar(barrio), "barrios")
}
