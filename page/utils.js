import { TAILWIND_CONFIG, COMPONENT_CSS, navBar, pageTitle, badgeLinea, lineasChips, statBox, cardBarrio, cardCliente } from "./components.js"

export function createPage(title, content, active = "") {
    let html = ""
    html += '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">'
    html += '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
    html += '<link rel="icon" type="image/svg+xml" href="/favicon.svg">'
    html += `<title>${title}</title>`
    html += TAILWIND_CONFIG
    html += COMPONENT_CSS
    html += '</head><body class="bg-canvas min-h-screen">'
    html += navBar(active)
    html += '<div class="container mx-auto p-6">'
    html += pageTitle(title)
    html += content
    html += '</div></body></html>'
    return html
}

export function createMenuPage() {
    let html = '<p class="text-ink font-medium mb-6">Selecciona una comuna en el mapa para ver sus barrios:</p>'
    html += '<div class="panel">'
    html += '<p id="mapa-loading" class="text-center text-lav-600 py-24">Cargando mapa…</p>'
    html += '<svg id="mapa-caba" class="hidden" role="img" aria-label="Mapa de comunas de CABA"></svg>'
    html += '</div>'
    html += '<div class="mt-6 text-center">'
    html += '<a href="/barrios" class="link">Ver todos los barrios</a>'
    html += '</div>'
    html += '<script src="/js/mapa.js" defer></script>'
    return html
}

export function createFilterMenu(filtros = {}, lineas = { colectivos: [], trenes: [] }, comuna = "") {
    const q = filtros.q || ""
    const orden = filtros.orden || ""
    const linea = filtros.linea || ""

    let html = ''
    html += '<style>#toggle-filtros:checked + label .filter-chevron{transform:rotate(180deg)}</style>'
    html += '<div class="sticky top-0 z-40 w-full">'
    html += '<input type="checkbox" id="toggle-filtros" class="peer sr-only" />'
    html += '<label for="toggle-filtros" class="mt-2 mb-2 inline-flex items-center gap-2 bg-lav-600 text-white px-4 py-2 rounded-full cursor-pointer hover:bg-lav-700 hover:outline hover:outline-2 hover:outline-offset-2 hover:outline-ink transition-colors text-sm font-medium select-none">'
    html += 'Filtros'
    html += '<span class="filter-chevron inline-block transition-transform">&#9650;</span>'
    html += '</label>'
    html += '<form method="GET" action="/barrios" class="hidden peer-checked:block bg-white rounded-2xl border border-lav-200 p-4">'
    if (comuna) html += `<input type="hidden" name="comuna" value="${comuna}" />`
    html += '<div class="grid grid-cols-1 sm:grid-cols-3 gap-3">'
    html += '<div class="sm:col-span-3">'
    html += '<label class="label">Buscar barrio</label>'
    html += `<input type="text" name="q" value="${q}" placeholder="Nombre del barrio..." class="field" />`
    html += '</div>'
    html += '<div>'
    html += '<label class="label">Ordenar (mayor a menor)</label>'
    html += '<select name="orden" class="field">'
    html += '<option value="">Sin ordenar</option>'
    html += `<option value="antiguedad" ${orden === "antiguedad" ? "selected" : ""}>Antigüedad</option>`
    html += `<option value="habitantes" ${orden === "habitantes" ? "selected" : ""}>Habitantes</option>`
    html += `<option value="superficie" ${orden === "superficie" ? "selected" : ""}>Superficie</option>`
    html += '</select>'
    html += '</div>'
    html += '<div class="sm:col-span-2">'
    html += '<label class="label">Linea de colectivo o ferrocarril</label>'
    html += '<select name="linea" class="field">'
    html += '<option value="">Todas las lineas</option>'
    if (lineas.colectivos?.length) {
        html += '<optgroup label="Colectivos">'
        for (const c of lineas.colectivos) {
            html += `<option value="${c}" ${linea === c ? "selected" : ""}>${c}</option>`
        }
        html += '</optgroup>'
    }
    if (lineas.trenes?.length) {
        html += '<optgroup label="Ferrocarril">'
        for (const t of lineas.trenes) {
            html += `<option value="${t}" ${linea === t ? "selected" : ""}>${t}</option>`
        }
        html += '</optgroup>'
    }
    html += '</select>'
    html += '</div>'
    html += '</div>'
    const clearHref = comuna ? `/barrios/comuna/${encodeURIComponent(comuna)}` : "/barrios"
    html += '<div class="mt-3 flex justify-end gap-2">'
    html += `<a href="${clearHref}" class="btn btn-ghost">Limpiar</a>`
    html += '<button type="submit" class="btn btn-primary">Aplicar</button>'
    html += '</div>'
    html += '</form>'
    html += '</div>'
    return html
}

export function createListPage(lista, filtros = {}, lineas = {}) {
    let html = ''
    html += createFilterMenu(filtros, lineas, filtros.comuna || "")
    html += '<div class="mb-4">'
    html += '<a href="/barrios/nuevo" class="btn btn-primary">Nuevo Barrio</a>'
    html += '</div>'
    html += '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">'
    lista.forEach(barrio => {
        if (barrio._id) html += cardBarrio(barrio)
    })
    html += '</div>'
    if (!lista.length) html += '<p class="empty-state">No se encontraron barrios con esos filtros.</p>'
    html += '<div class="mt-4"><a href="/" class="link">Volver al menu</a></div>'
    return html
}

export function createListByComunaPage(lista, comuna, filtros = {}, lineas = {}) {
    let html = ''
    html += createFilterMenu(filtros, lineas, comuna)
    html += '<div class="mb-4">'
    html += '<a href="/barrios/nuevo" class="btn btn-primary">Nuevo Barrio</a>'
    html += '</div>'
    html += '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">'
    lista.forEach(barrio => {
        if (barrio._id) html += cardBarrio(barrio)
    })
    html += '</div>'
    if (!lista.length) html += '<p class="empty-state">No se encontraron barrios con esos filtros.</p>'
    html += '<div class="mt-4"><a href="/" class="link">Volver al menu</a></div>'
    return html
}

export function createListDesactivadosPage(lista) {
    let html = '<div class="bg-white rounded-2xl border border-lav-200 overflow-hidden">'
    html += '<table class="w-full">'
    html += '<thead class="bg-lav-50">'
    html += '<tr>'
    html += '<th class="px-4 py-3 text-left text-xs font-semibold text-lav-700 uppercase tracking-wide">Nombre</th>'
    html += '<th class="px-4 py-3 text-left text-xs font-semibold text-lav-700 uppercase tracking-wide">Comuna</th>'
    html += '<th class="px-4 py-3 text-left text-xs font-semibold text-lav-700 uppercase tracking-wide">Acciones</th>'
    html += '</tr></thead><tbody class="divide-y divide-lav-100">'
    lista.forEach(barrio => {
        if (barrio._id) html += `
        <tr class="hover:bg-lav-50 transition-colors">
            <td class="px-4 py-3 font-medium text-ink">${barrio.nombre}</td>
            <td class="px-4 py-3"><span class="badge badge-neutral">Comuna ${barrio.comuna}</span></td>
            <td class="px-4 py-3">
                <a class="btn btn-gold" href="/barrios/activar/${barrio._id}">Reactivar</a>
            </td>
        </tr>`
    })
    html += '</tbody></table></div>'
    html += '<div class="mt-4"><a href="/" class="link">Volver al menu</a></div>'
    return html
}

function transporteGrupo(label, items, tipo) {
    if (!items?.length) return ""
    let html = `<div class="flex flex-wrap items-center gap-2 mb-3"><span class="stat-label mb-0">${label}</span>`
    for (const item of items) html += badgeLinea(item, tipo)
    html += '</div>'
    return html
}

export function createDetailPage(barrio) {
    const tp = barrio.transporte_publico || {}
    const edificios = barrio.edificios_emblematicos || []

    let html = '<div class="space-y-6">'
    html += '<article class="card">'
    html += `<div class="relative"><img src="${barrio.img || "https://picsum.photos/400/225"}" alt="${barrio.nombre}" class="w-full h-56 md:h-72 object-cover" />`
    html += '<div class="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent"></div>'
    html += `<span class="badge badge-comuna badge-on-media absolute top-4 right-4">Comuna ${barrio.comuna}</span></div>`
    html += '<div class="p-6">'
    html += '<div class="grid grid-cols-2 md:grid-cols-4 gap-3">'
    html += statBox("Habitantes", barrio.cantidad_habitantes)
    html += statBox("Superficie km2", barrio.superficie_km2)
    html += statBox("Antigüedad (anio)", barrio.antiguedad_anio)
    html += statBox("Comuna", barrio.comuna)
    html += '</div>'

    if (edificios.length) {
        html += '<div class="mt-6"><h2 class="section-title">Edificios emblemáticos</h2><div class="flex flex-wrap gap-1.5">'
        for (const e of edificios) html += `<span class="badge badge-neutral">${e}</span>`
        html += '</div></div>'
    }

    const tieneLineas = tp.subtes?.length || tp.trenes?.length || tp.colectivos_principales?.length
    if (tieneLineas) {
        html += '<div class="mt-6"><h2 class="section-title">Transporte público</h2>'
        html += transporteGrupo("Subtes", tp.subtes, "subte")
        html += transporteGrupo("Ferrocarril", tp.trenes, "tren")
        html += transporteGrupo("Colectivos", tp.colectivos_principales, "colectivo")
        html += '</div>'
    }

    html += '<div class="mt-6 flex flex-wrap gap-2">'
    html += `<a href="/barrios/editar/${barrio._id}" class="btn btn-gold">Editar</a>`
    html += `<a href="/barrios/borrar/${barrio._id}" class="btn btn-danger">Desactivar</a>`
    html += '<a href="/barrios" class="btn btn-ghost">Volver</a>'
    html += '</div>'
    html += '</div></article>'
    html += '</div>'
    return html
}

function barrioFormField(label, name, type = "text", value = "", extra = "") {
    return `<div><label class="label">${label}</label><input name="${name}" type="${type}" value="${value}" class="field" ${extra} /></div>`
}

export function createBarrioFormPage() {
    let html = '<div class="panel max-w-xl">'
    html += "<form action='/barrios/nuevo' method='POST' class='space-y-4'>"
    html += barrioFormField("Nombre:", "nombre")
    html += barrioFormField("Imagen (URL):", "img", "text", "https://picsum.photos/400/225")
    html += barrioFormField("Comuna:", "comuna", "number")
    html += barrioFormField("Cantidad Habitantes:", "cantidad_habitantes", "number")
    html += barrioFormField("Superficie km2:", "superficie_km2", "number", "", 'step="0.1"')
    html += barrioFormField("Antiguedad (anio):", "antiguedad_anio", "number")
    html += barrioFormField("Edificios Emblematicos (separados por coma):", "edificios_emblematicos")
    html += '<button type="submit" class="btn btn-primary">Guardar</button>'
    html += "</form>"
    html += '<div class="mt-4"><a href="/barrios" class="link">Volver</a></div></div>'
    return html
}

export function createBarrioFormEditPage(barrio) {
    let html = '<div class="panel max-w-xl">'
    html += `<form action='/barrios/editar/${barrio._id}' method='POST' class='space-y-4'>`
    html += barrioFormField("Nombre:", "nombre", "text", barrio.nombre || "")
    html += barrioFormField("Imagen (URL):", "img", "text", barrio.img || "https://picsum.photos/400/225")
    html += barrioFormField("Comuna:", "comuna", "number", barrio.comuna || "")
    html += barrioFormField("Cantidad Habitantes:", "cantidad_habitantes", "number", barrio.cantidad_habitantes || "")
    html += barrioFormField("Superficie km2:", "superficie_km2", "number", barrio.superficie_km2 || "", 'step="0.1"')
    html += barrioFormField("Antiguedad (anio):", "antiguedad_anio", "number", barrio.antiguedad_anio || "")
    html += barrioFormField("Edificios Emblematicos (separados por coma):", "edificios_emblematicos", "text", (barrio.edificios_emblematicos || []).join(", "))
    html += '<button type="submit" class="btn btn-primary">Guardar</button>'
    html += "</form>"
    html += '<div class="mt-4"><a href="/barrios" class="link">Volver</a></div></div>'
    return html
}

export function createDetailDesactivar(barrio) {
    let html = '<div class="panel max-w-xl">'
    html += '<p class="text-gray-700 mb-4">Esta seguro que desea desactivar este barrio?</p>'
    html += '<div class="stat-box mb-4">'
    html += `<p class="font-bold text-ink">${barrio.nombre}</p>`
    html += `<span class="badge badge-neutral mt-1">Comuna ${barrio.comuna}</span>`
    html += '</div>'
    html += `<form action='/barrios/borrar/${barrio._id}' method='POST'>`
    html += '<button type="submit" class="btn btn-danger">Desactivar</button>'
    html += '</form>'
    html += '<div class="mt-4"><a href="/barrios" class="link">Cancelar</a></div></div>'
    return html
}

export function createClienteListPage(clientes) {
    let html = '<div class="mb-4">'
    html += '<a href="/clientes/nuevo" class="btn btn-primary">Nuevo Cliente</a>'
    html += '</div>'
    if (!clientes.length) html += '<p class="empty-state">No hay clientes registrados.</p>'
    else {
        html += '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">'
        clientes.forEach(cliente => {
            if (cliente._id) html += cardCliente(cliente)
        })
        html += '</div>'
    }
    html += '<div class="mt-4"><a href="/" class="link">Volver al menu</a></div>'
    return html
}

export function createClienteFormPage() {
    let html = '<div class="panel max-w-xl">'
    html += "<form action='/clientes/nuevo' method='POST' class='space-y-4'>"
    html += '<div><label class="label">Nombre:</label><input name="nombre" class="field" /></div>'
    html += '<div><label class="label">Foto (URL):</label><input name="foto" value="https://picsum.photos/400/225" class="field" /></div>'
    html += '<div><label class="label">Descripcion:</label><textarea name="descripcion" rows="3" class="field"></textarea></div>'
    html += '<button type="submit" class="btn btn-primary">Guardar</button>'
    html += "</form>"
    html += '<div class="mt-4"><a href="/clientes" class="link">Volver</a></div></div>'
    return html
}

export function createClienteFormEditPage(cliente) {
    let html = '<div class="panel max-w-xl">'
    html += `<form action='/clientes/editar/${cliente._id}' method='POST' class='space-y-4'>`
    html += `<div><label class="label">Nombre:</label><input name="nombre" value="${cliente.nombre || ''}" class="field" /></div>`
    html += `<div><label class="label">Foto (URL):</label><input name="foto" value="${cliente.foto || 'https://picsum.photos/400/225'}" class="field" /></div>`
    html += `<div><label class="label">Descripcion:</label><textarea name="descripcion" rows="3" class="field">${cliente.descripcion || ''}</textarea></div>`
    html += '<button type="submit" class="btn btn-primary">Guardar</button>'
    html += "</form>"
    html += '<div class="mt-4"><a href="/clientes" class="link">Volver</a></div></div>'
    return html
}

export function createClienteDetailPage(cliente, barrios = [], todosLosBarrios = []) {
    let html = '<div class="space-y-6">'
    html += '<article class="card">'
    html += `<div class="relative"><img src="${cliente.foto || 'https://picsum.photos/400/225'}" alt="${cliente.nombre}" class="w-full h-56 md:h-72 object-cover" />`
    html += '<div class="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent"></div></div>'
    html += '<div class="p-6">'
    html += '<p class="text-gray-600 mb-4">' + (cliente.descripcion || "-") + '</p>'
    html += '<div class="flex flex-wrap gap-2">'
    html += `<a href="/clientes/editar/${cliente._id}" class="btn btn-gold">Editar</a>`
    html += '<a href="/clientes" class="btn btn-ghost">Volver</a>'
    html += '</div>'
    html += '</div></article>'

    html += '<section class="panel">'
    html += '<h2 class="section-title">Barrios vinculados</h2>'
    if (!barrios.length) html += '<p class="text-lav-600">No hay barrios vinculados a este cliente.</p>'
    else {
        html += '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">'
        barrios.forEach(b => {
            if (!b._id) return
            html += `<div class="stat-box flex items-center justify-between gap-2">`
            html += `<div><a href="/barrios/${b._id}" class="link">${b.nombre}</a>`
            html += `<span class="badge badge-neutral mt-1">Comuna ${b.comuna}</span></div>`
            html += `<form action="/clientes/${cliente._id}/desasociar" method="POST">`
            html += `<input type="hidden" name="barrioId" value="${b._id}" />`
            html += `<button type="submit" class="btn btn-danger">Desasociar</button>`
            html += '</form></div>'
        })
        html += '</div>'
    }
    html += '</section>'

    html += '<section class="panel">'
    html += '<h2 class="section-title">Asociar barrio</h2>'
    if (!todosLosBarrios.length) html += '<p class="text-lav-600">No hay barrios disponibles.</p>'
    else {
        html += `<form action="/clientes/${cliente._id}/asociar" method="POST" class="flex flex-wrap gap-3 items-end">`
        html += '<div class="flex-1 min-w-48">'
        html += '<label class="label">Barrio</label>'
        html += '<select name="barrioId" class="field">'
        todosLosBarrios.forEach(b => {
            if (b._id) html += `<option value="${b._id}">${b.nombre} (Comuna ${b.comuna})</option>`
        })
        html += '</select></div>'
        html += '<button type="submit" class="btn btn-primary">Asociar</button>'
        html += '</form>'
    }
    html += '</section>'
    html += '</div>'
    return html
}
