(() => {
    const NS = "http://www.w3.org/2000/svg"
    const PALETA = [
        "#fcbf45", "#bbadeb", "#a49bdf", "#8986cd", "#7370b8",
        "#5f5ca6", "#cdc5f0", "#b8b0ec", "#9c95dd", "#e3dff8",
        "#d4cff3", "#c6c0ef", "#aba2e4", "#f5d98a", "#e8e4fa"
    ]

    function inyectarEstilos() {
        if (document.getElementById("mapa-caba-style")) return
        const s = document.createElement("style")
        s.id = "mapa-caba-style"
        s.textContent = `
            #mapa-caba { display: block; width: 100%; height: auto; }
            #mapa-caba a { cursor: pointer; }
            #mapa-caba a path {
                stroke: #ffffff;
                stroke-width: 1;
                vector-effect: non-scaling-stroke;
                transition: filter 0.15s ease;
            }
            #mapa-caba a:hover path,
            #mapa-caba a:focus path {
                filter: brightness(0.82);
                stroke: #111827;
                stroke-width: 2;
            }
            #mapa-caba a:focus { outline: none; }
            #mapa-caba text {
                pointer-events: none;
                font-weight: 700;
                text-anchor: middle;
                dominant-baseline: central;
                paint-order: stroke;
                stroke: #111827;
                stroke-width: 3px;
                stroke-linejoin: round;
                fill: #ffffff;
            }
            #mapa-tooltip {
                position: fixed;
                z-index: 50;
                pointer-events: none;
                background: #111827;
                color: #fff;
                font-size: 13px;
                padding: 4px 10px;
                border-radius: 9999px;
                transform: translate(-50%, -140%);
                display: none;
                white-space: nowrap;
                font-family: system-ui, sans-serif;
            }
        `
        document.head.appendChild(s)
    }

    function anillos(feature) {
        const g = feature.geometry
        if (!g) return []
        if (g.type === "Polygon") return [g.coordinates[0] || []]
        if (g.type === "MultiPolygon") return g.coordinates.map(p => p[0] || [])
        return []
    }

    function proyectarCoord(lon, lat) {
        return [lon * Math.cos(34.6 * Math.PI / 180), -lat]
    }

    function construirMapa(geo) {
        const features = (geo.features || []).filter(f =>
            f.geometry && typeof f.properties?.COMUNA === "number"
        )
        if (!features.length) throw new Error("GeoJSON sin features validos")

        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
        for (const f of features) {
            for (const anillo of anillos(f)) {
                for (const [lon, lat] of anillo) {
                    const [x, y] = proyectarCoord(lon, lat)
                    if (x < minX) minX = x
                    if (x > maxX) maxX = x
                    if (y < minY) minY = y
                    if (y > maxY) maxY = y
                }
            }
        }

        const pad = 24
        const W = 1000
        const spanX = maxX - minX
        const spanY = maxY - minY
        const escala = (W - 2 * pad) / spanX
        const H = Math.ceil(spanY * escala + 2 * pad)
        const mapX = x => (x - minX) * escala + pad
        const mapY = y => (y - minY) * escala + pad
        const r = v => Math.round(v * 10) / 10

        const porComuna = new Map()
        for (const f of features) {
            const n = Math.round(f.properties.COMUNA)
            if (n < 1 || n > 15) continue
            if (!porComuna.has(n)) porComuna.set(n, [])
            porComuna.get(n).push(f)
        }

        const svg = document.getElementById("mapa-caba")
        svg.setAttribute("viewBox", `0 0 ${W} ${H}`)
        svg.textContent = ""

        const fontSize = Math.max(16, Math.round(H / 34))

        for (const [n, feats] of porComuna) {
            const a = document.createElementNS(NS, "a")
            a.setAttribute("href", `/barrios/comuna/${n}`)
            a.setAttribute("aria-label", `Comuna ${n}`)

            let mejor = null
            for (const f of feats) {
                const path = document.createElementNS(NS, "path")
                let d = ""
                for (const anillo of anillos(f)) {
                    if (!anillo.length) continue
                    anillo.forEach(([lon, lat], i) => {
                        const [px, py] = proyectarCoord(lon, lat)
                        d += `${i === 0 ? "M" : "L"}${r(mapX(px))},${r(mapY(py))}`
                    })
                    d += "Z"
                }
                if (!d) continue
                path.setAttribute("d", d)
                path.setAttribute("fill", PALETA[(n - 1) % PALETA.length])
                const title = document.createElementNS(NS, "title")
                title.textContent = f.properties.BARRIO
                    ? `${f.properties.BARRIO} — Comuna ${n}`
                    : `Comuna ${n}`
                path.appendChild(title)
                a.appendChild(path)

                const area = f.properties.AREA || 0
                if (!mejor || area > mejor.area) mejor = { f, area }
            }

            if (mejor) {
                const anillo = anillos(mejor.f)[0] || []
                let cx = 0, cy = 0
                for (const [lon, lat] of anillo) {
                    const [px, py] = proyectarCoord(lon, lat)
                    cx += mapX(px)
                    cy += mapY(py)
                }
                if (anillo.length) {
                    cx /= anillo.length
                    cy /= anillo.length
                    const t = document.createElementNS(NS, "text")
                    t.setAttribute("x", r(cx))
                    t.setAttribute("y", r(cy))
                    t.setAttribute("font-size", fontSize)
                    t.textContent = n
                    a.appendChild(t)
                }
            }

            svg.appendChild(a)
        }

        const tooltip = document.createElement("div")
        tooltip.id = "mapa-tooltip"
        document.body.appendChild(tooltip)

        for (const a of svg.querySelectorAll("a")) {
            const n = a.getAttribute("aria-label")
            a.addEventListener("mouseenter", () => {
                tooltip.textContent = `${n} — clic para ver barrios`
                tooltip.style.display = "block"
            })
            a.addEventListener("mousemove", e => {
                tooltip.style.left = e.clientX + "px"
                tooltip.style.top = e.clientY + "px"
            })
            a.addEventListener("mouseleave", () => {
                tooltip.style.display = "none"
            })
        }
    }

    async function init() {
        inyectarEstilos()
        const loading = document.getElementById("mapa-loading")
        const svg = document.getElementById("mapa-caba")
        if (!svg) return
        try {
            const res = await fetch("/data/caba_barrios.geojson")
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const geo = await res.json()
            construirMapa(geo)
            if (loading) loading.remove()
            svg.classList.remove("hidden")
        } catch (err) {
            console.error("Mapa:", err)
            if (loading) {
                loading.innerHTML =
                    'No se pudo cargar el mapa. <a href="/barrios" class="text-lav-600 underline">Ver todos los barrios</a>'
            }
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init)
    } else {
        init()
    }
})()
