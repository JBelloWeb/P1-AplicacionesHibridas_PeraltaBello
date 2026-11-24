import { Link } from "react-router"
import MapaComunas from "../components/MapaComunas.jsx"

export default function Home() {
    return (
        <div className="flex flex-col gap-10">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-violeta-oscuro mb-2">Barriopoli</h1>
                <p className="text-tinta/60">Explorá los barrios de la Ciudad de Buenos Aires.</p>
            </div>
            <MapaComunas />
            <div className="text-center">
                <Link to="/barrios" className="btn">
                    Ver todos los barrios
                </Link>
            </div>
        </div>
    )
}
