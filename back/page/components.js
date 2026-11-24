export const TAILWIND_CONFIG = `
<script src="https://cdn.tailwindcss.com"></script>
<script>
tailwind.config = {
    theme: {
        extend: {
            colors: {
                lav: {
                    50: '#f7f5fd', 100: '#efecfb', 200: '#e3dff8', 300: '#cdc5f0',
                    400: '#bbadeb', 500: '#a49bdf', 600: '#8986cd', 700: '#7370b8',
                    800: '#5f5ca6'
                },
                gold: { DEFAULT: '#fcbf45', dark: '#e5a92e', soft: '#f5d98a' },
                ink: '#241f3d',
                canvas: '#f6f4fc'
            }
        }
    }
}
</script>`

export const COMPONENT_CSS = `
<style type="text/tailwindcss">
@layer components {
    .btn {
        @apply inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer;
        @apply hover:outline hover:outline-2 hover:outline-offset-2 hover:outline-ink;
        @apply focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink;
    }
    .btn-primary {
        @apply bg-lav-600 text-white hover:bg-lav-700;
    }
    .btn-gold {
        @apply bg-gold text-ink hover:bg-gold-dark;
    }
    .btn-ghost {
        @apply bg-transparent text-lav-700 border border-lav-300 hover:bg-lav-100;
    }
    .btn-danger {
        @apply bg-red-500 text-white hover:bg-red-600;
    }
    .card {
        @apply bg-white rounded-2xl border border-lav-200 overflow-hidden flex flex-col;
        @apply hover:outline hover:outline-2 hover:outline-offset-2 hover:outline-lav-600;
    }
    .card-gold {
        @apply hover:outline-gold;
    }
    .panel {
        @apply bg-white rounded-2xl border border-lav-200 p-6;
    }
    .nav-link {
        @apply block px-3 py-1.5 rounded-full text-sm font-medium text-white/90 transition-colors;
        @apply hover:bg-white/10 hover:outline hover:outline-1 hover:outline-offset-1 hover:outline-white/60;
    }
    .nav-link.active {
        @apply bg-gold text-ink hover:bg-gold-dark hover:outline-transparent;
    }
    .badge {
        @apply inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold leading-5;
    }
    .badge-on-media {
        @apply outline outline-1 outline-offset-1 outline-white/80;
    }
    .badge-comuna { @apply bg-gold text-ink; }
    .badge-colectivo { @apply bg-gold text-ink; }
    .badge-tren { @apply bg-lav-600 text-white; }
    .badge-subte { @apply bg-lav-400 text-ink; }
    .badge-neutral { @apply bg-lav-100 text-lav-700; }
    .stat-box {
        @apply bg-lav-50 border border-lav-200 rounded-xl px-4 py-3;
    }
    .stat-label {
        @apply block text-[11px] font-semibold text-lav-700 uppercase tracking-wide mb-0.5;
    }
    .stat-value {
        @apply block font-bold text-ink text-lg;
    }
    .field {
        @apply w-full border border-lav-300 rounded-xl px-3 py-2 text-sm bg-white text-ink placeholder:text-lav-500 focus:outline-none focus:ring-2 focus:ring-lav-600 focus:border-lav-600;
    }
    .label {
        @apply block text-xs font-semibold text-lav-700 uppercase tracking-wide mb-1;
    }
    .section-title {
        @apply text-lg font-bold text-ink mb-3;
    }
    .link {
        @apply text-ink font-semibold underline decoration-lav-400 hover:text-lav-800;
    }
    .empty-state {
        @apply text-center text-ink font-semibold py-10;
    }
}
</style>
<style>
body {
    --s: 16px;
    --c1: #e1e1f3;
    --c2: #efecfa;
    --g: #0000 66%, var(--c1) 67% 98%, #0000;
    background:
        radial-gradient(30% 50% at 30% 100%, var(--g)),
        radial-gradient(30% 50% at 70% 0%, var(--g)) var(--s) 0,
        repeating-linear-gradient(90deg, var(--c1) 0 10%, var(--c2) 0 50%);
    background-size: calc(10 * var(--s)) calc(6 * var(--s));
}
</style>`

export function navBar(active = "") {
    const link = (href, label, key) =>
        `<a href="${href}" class="nav-link${active === key ? " active" : ""}">${label}</a>`
    return `
<nav class="relative bg-gradient-to-r from-lav-600 to-lav-400 text-white border-b-2 border-gold">
    <div class="container mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-2">
        <a href="/" class="flex items-center gap-2 text-xl font-extrabold tracking-tight">
            <span class="inline-block w-2.5 h-2.5 rounded-full bg-gold"></span>Barriopoli
        </a>
        <input type="checkbox" id="toggle-nav" class="peer sr-only" />
        <label for="toggle-nav" class="md:hidden p-2 rounded-lg hover:bg-white/20 cursor-pointer select-none" aria-label="Abrir menu">
            <span class="block w-5 h-0.5 bg-white mb-1"></span>
            <span class="block w-5 h-0.5 bg-white mb-1"></span>
            <span class="block w-5 h-0.5 bg-white"></span>
        </label>
        <div class="hidden w-full flex-col gap-1 p-2 order-last peer-checked:flex md:order-none md:flex md:w-auto md:flex-row md:items-center md:gap-1 md:p-0">
            ${link("/barrios", "Todos", "barrios")}
            ${link("/barrios/desactivados", "Desactivados", "desactivados")}
            ${link("/clientes", "Clientes", "clientes")}
            ${link("/barrios/nuevo", "Nuevo", "nuevo")}
        </div>
    </div>
</nav>`
}

export function pageTitle(text) {
    return `<h1 class="text-3xl font-extrabold text-ink tracking-tight border-l-4 border-gold pl-3 mb-6">${text}</h1>`
}

export function badgeLinea(texto, tipo) {
    const mapa = { colectivo: "badge-colectivo", tren: "badge-tren", subte: "badge-subte" }
    return `<span class="badge ${mapa[tipo] || "badge-neutral"}">${texto}</span>`
}

export function lineasChips(barrio, max = 3) {
    const tp = barrio.transporte_publico
    if (!tp) return ""
    const chips = []
    for (const t of tp.subtes || []) chips.push(badgeLinea(t, "subte"))
    for (const t of tp.trenes || []) chips.push(badgeLinea(t, "tren"))
    for (const t of tp.colectivos_principales || []) chips.push(badgeLinea(t, "colectivo"))
    if (!chips.length) return ""
    const resto = chips.length - max
    return `<div class="flex flex-wrap gap-1.5 mb-4">${chips.slice(0, max).join("")}${resto > 0 ? `<span class="badge badge-neutral">+${resto}</span>` : ""}</div>`
}

export function statBox(label, value) {
    return `<div class="stat-box"><span class="stat-label">${label}</span><span class="stat-value">${value ?? "-"}</span></div>`
}

export function cardBarrio(barrio) {
    return `
<article class="card">
    <div class="relative overflow-hidden">
        <img src="${barrio.img || "https://picsum.photos/400/225"}" alt="${barrio.nombre}" class="w-full h-40 object-cover" />
        <div class="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/40 to-transparent"></div>
        <span class="badge badge-comuna badge-on-media absolute top-3 right-3">Comuna ${barrio.comuna}</span>
    </div>
    <div class="p-4 flex flex-1 flex-col">
        <h3 class="text-lg font-bold text-ink mb-2 truncate">${barrio.nombre}</h3>
        <div class="grid grid-cols-2 gap-2 mb-4">
            <div><span class="stat-label">Habitantes</span><span class="text-sm font-semibold text-ink">${barrio.cantidad_habitantes || "-"}</span></div>
            <div><span class="stat-label">Superficie km2</span><span class="text-sm font-semibold text-ink">${barrio.superficie_km2 || "-"}</span></div>
        </div>
        ${lineasChips(barrio)}
        <a class="btn btn-primary w-full mt-auto" href="/barrios/${barrio._id}">Ver</a>
    </div>
</article>`
}

export function cardCliente(cliente) {
    return `
<article class="card">
    <div class="relative overflow-hidden">
        <img src="${cliente.foto || "https://picsum.photos/400/225"}" alt="${cliente.nombre}" class="w-full h-40 object-cover" />
        <div class="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/40 to-transparent"></div>
    </div>
    <div class="p-4 flex flex-1 flex-col">
        <h3 class="text-lg font-bold text-ink mb-2 truncate">${cliente.nombre}</h3>
        <p class="text-sm text-gray-600 mb-4 line-clamp-2">${cliente.descripcion || ""}</p>
        <div class="flex gap-2 mt-auto">
            <a class="btn btn-primary flex-1" href="/clientes/${cliente._id}">Ver</a>
            <a class="btn btn-gold flex-1" href="/clientes/editar/${cliente._id}">Editar</a>
        </div>
    </div>
</article>`
}
