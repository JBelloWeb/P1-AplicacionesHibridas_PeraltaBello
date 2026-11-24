import { useEffect, useRef, useState, useMemo } from "react"
import { useNavigate } from "react-router"

function proyectar(lon, lat, bounds, w, h) {
    const x = ((lon - bounds.minLon) / (bounds.maxLon - bounds.minLon)) * w
    const y = h - ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * h
    return [x, y]
}

function coordsAPath(coordsAnillo, bounds, w, h) {
    return coordsAnillo
        .map(([lon, lat], i) => {
            const [x, y] = proyectar(lon, lat, bounds, w, h)
            return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`
        })
        .join(" ") + " Z"
}

const PALETA = [
    "#c4b5f4","#a78bfa","#9b7cf7","#8b6cf4","#7c5cf0",
    "#6d4ced","#5e3cea","#4f2ce7","#8e66cc","#b37dff",
    "#c4a5f7","#d4b8f9","#a070e8","#9060e0","#7850d4"
]

export default function MapaComunas() {
    const svgRef = useRef(null)
    const [tooltip, setTooltip] = useState(null)
    const [geojson, setGeojson] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        fetch("/data/caba_barrios.geojson")
            .then((r) => r.json())
            .then(setGeojson)
            .catch(() => {})
    }, [])

    const { comunas, bounds, W, H } = useMemo(() => {
        if (!geojson) return { comunas: [], bounds: null, W: 800, H: 600 }

        let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity
        const mapaComuna = {}

        geojson.features.forEach((f) => {
            const { COMUNA, BARRIO, AREA } = f.properties
            const coords = f.geometry.type === "Polygon"
                ? f.geometry.coordinates
                : f.geometry.coordinates.flat()

            coords.forEach((anillo) =>
                anillo.forEach(([lon, lat]) => {
                    if (lon < minLon) minLon = lon
                    if (lon > maxLon) maxLon = lon
                    if (lat < minLat) minLat = lat
                    if (lat > maxLat) maxLat = lat
                })
            )

            if (!mapaComuna[COMUNA]) mapaComuna[COMUNA] = { barrios: [], mayor: null }
            mapaComuna[COMUNA].barrios.push({ BARRIO, AREA, coords })
            if (!mapaComuna[COMUNA].mayor || AREA > mapaComuna[COMUNA].mayor.AREA) {
                mapaComuna[COMUNA].mayor = { BARRIO, AREA, coords }
            }
        })

        const bounds = { minLon, maxLon, minLat, maxLat }
        const W = 800, H = 620

        const comunas = Object.entries(mapaComuna).map(([num, { barrios, mayor }]) => ({
            num: Number(num),
            barrios,
            mayor,
            color: PALETA[(Number(num) - 1) % PALETA.length]
        }))

        return { comunas, bounds, W, H }
    }, [geojson])

    if (!geojson) {
        return <p className="py-16 text-center text-violeta animate-pulse">Cargando mapa…</p>
    }

    return (
        <div className="relative overflow-hidden rounded-3xl border border-lila/30 bg-white">
            <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
                {comunas.map(({ num, barrios, mayor, color }) => {
                    const centroide = (() => {
                        if (!mayor) return null
                        const anillo = mayor.coords[0]
                        const lon = anillo.reduce((s, [x]) => s + x, 0) / anillo.length
                        const lat = anillo.reduce((s, [, y]) => s + y, 0) / anillo.length
                        return proyectar(lon, lat, bounds, W, H)
                    })()

                    return (
                        <g
                            key={num}
                            onClick={() => navigate(`/barrios?comuna=${num}`)}
                            onMouseEnter={() => setTooltip({ num, barrios: barrios.map((b) => b.BARRIO) })}
                            onMouseLeave={() => setTooltip(null)}
                            className="cursor-pointer"
                        >
                            {barrios.map(({ BARRIO, coords }) =>
                                coords.map((anillo, i) => (
                                    <path
                                        key={`${BARRIO}-${i}`}
                                        d={coordsAPath(anillo, bounds, W, H)}
                                        fill={color}
                                        stroke="white"
                                        strokeWidth="0.8"
                                        className="hover:opacity-80 transition-opacity"
                                    />
                                ))
                            )}
                            {centroide && (
                                <text
                                    x={centroide[0]}
                                    y={centroide[1]}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fontSize="11"
                                    fontWeight="bold"
                                    fill="white"
                                    className="pointer-events-none select-none"
                                >
                                    {num}
                                </text>
                            )}
                        </g>
                    )
                })}
            </svg>
            {tooltip && (
                <div className="absolute bottom-4 left-4 max-w-xs rounded-2xl bg-white/90 border border-lila/40 px-4 py-3 shadow-sm backdrop-blur-sm">
                    <p className="font-bold text-violeta-oscuro text-sm mb-1">Comuna {tooltip.num}</p>
                    <p className="text-xs text-tinta/70 leading-relaxed">{tooltip.barrios.join(" · ")}</p>
                </div>
            )}
        </div>
    )
}
